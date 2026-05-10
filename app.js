const canvas = document.querySelector("#network-canvas");
const ctx = canvas.getContext("2d");
const activeSkill = document.querySelector("#active-skill");
const metricAccuracy = document.querySelector("#metric-accuracy");
const metricSignal = document.querySelector("#metric-signal");
const metricStack = document.querySelector("#metric-stack");
const skillCards = Array.from(document.querySelectorAll(".skill-card"));
const slider = document.querySelector("#model-slider");
const readout = document.querySelector("#model-readout");
const bars = Array.from(document.querySelectorAll(".bar-chart span"));
const codeStream = document.querySelector("#code-stream");

const palette = {
  rose: "#f48fb1",
  deep: "#c94f7c",
  mint: "#bcebdc",
  violet: "#8e7ad8",
  ink: "#241a22"
};

const layers = [4, 6, 5, 3];
let nodes = [];
let pulses = [];
let activeIndex = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * scale));
  canvas.height = Math.max(1, Math.floor(rect.height * scale));
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  buildNodes(rect.width, rect.height);
}

function buildNodes(width, height) {
  nodes = layers.map((count, layerIndex) => {
    const x = width * (0.13 + layerIndex * 0.25);
    return Array.from({ length: count }, (_, nodeIndex) => {
      const spread = height * 0.68;
      const y = height * 0.16 + ((nodeIndex + 0.5) / count) * spread;
      return {
        x,
        y,
        r: 7 + ((nodeIndex + layerIndex) % 3),
        phase: Math.random() * Math.PI * 2
      };
    });
  });
  pulses = Array.from({ length: 14 }, (_, index) => ({
    fromLayer: index % (layers.length - 1),
    fromNode: index % 4,
    toNode: (index * 2) % 5,
    progress: Math.random(),
    speed: 0.004 + Math.random() * 0.006
  }));
}

function drawNetwork(time = 0) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.34;
  for (let i = 0; i < 40; i += 1) {
    const x = (Math.sin(time * 0.0003 + i) * 0.5 + 0.5) * width;
    const y = (Math.cos(time * 0.0002 + i * 1.7) * 0.5 + 0.5) * height;
    ctx.fillStyle = i % 3 === 0 ? palette.mint : palette.rose;
    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  nodes.forEach((layer, layerIndex) => {
    if (layerIndex === nodes.length - 1) return;
    layer.forEach((node, nodeIndex) => {
      nodes[layerIndex + 1].forEach((next, nextIndex) => {
        const strength = 0.14 + ((nodeIndex + nextIndex + activeIndex) % 4) * 0.045;
        ctx.strokeStyle = `rgba(201, 79, 124, ${strength})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      });
    });
  });

  pulses.forEach((pulse) => {
    const fromLayer = nodes[pulse.fromLayer];
    const toLayer = nodes[pulse.fromLayer + 1];
    const from = fromLayer[pulse.fromNode % fromLayer.length];
    const to = toLayer[pulse.toNode % toLayer.length];
    pulse.progress = (pulse.progress + pulse.speed) % 1;
    const x = from.x + (to.x - from.x) * pulse.progress;
    const y = from.y + (to.y - from.y) * pulse.progress;

    ctx.fillStyle = pulse.fromLayer % 2 === 0 ? palette.deep : palette.violet;
    ctx.beginPath();
    ctx.arc(x, y, 3.6, 0, Math.PI * 2);
    ctx.fill();
  });

  nodes.forEach((layer, layerIndex) => {
    layer.forEach((node, nodeIndex) => {
      const lift = Math.sin(time * 0.002 + node.phase) * 2.5;
      const active = (nodeIndex + layerIndex + activeIndex) % 3 === 0;
      ctx.fillStyle = active ? palette.deep : "#fff";
      ctx.strokeStyle = active ? palette.rose : "rgba(201, 79, 124, 0.42)";
      ctx.lineWidth = active ? 3 : 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y + lift, node.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  });

  requestAnimationFrame(drawNetwork);
}

function activateSkill(card, index) {
  activeIndex = index;
  skillCards.forEach((item) => item.classList.toggle("is-active", item === card));
  activeSkill.textContent = card.dataset.skill;
  metricAccuracy.textContent = `${card.dataset.accuracy}%`;
  metricSignal.textContent = card.dataset.signal;
  metricStack.textContent = card.dataset.stack;
}

skillCards.forEach((card, index) => {
  card.addEventListener("pointerenter", () => activateSkill(card, index));
  card.addEventListener("focusin", () => activateSkill(card, index));
  card.addEventListener("click", () => activateSkill(card, index));
});

const codeLines = [
  "import pandas as pd",
  "from sklearn.model_selection import train_test_split",
  "from sklearn.ensemble import RandomForestRegressor",
  "",
  "dataset = pd.read_csv('business_signals.csv')",
  "features = dataset[['quality', 'fit', 'logic', 'model']]",
  "target = dataset['business_value']",
  "",
  "model = RandomForestRegressor(random_state=42)",
  "model.fit(features, target)",
  "insight = model.predict(next_decision)",
  "print(f'Expected value: {insight:.0%}')"
];

let codePosition = 0;
function typeCode() {
  codePosition = (codePosition + 1) % (codeLines.join("\n").length + 80);
  const fullCode = codeLines.join("\n");
  const visible = fullCode.slice(0, Math.min(codePosition, fullCode.length));
  codeStream.textContent = visible || fullCode.slice(0, 1);
}

function updateModelPanel() {
  const value = Number(slider.value);
  readout.textContent = `Predicted business value: ${value}%`;
  bars.forEach((bar, index) => {
    const offset = [0, -12, 8, -22][index];
    const width = Math.max(28, Math.min(96, value + offset));
    bar.style.setProperty("--value", `${width}%`);
  });
}

window.addEventListener("resize", resizeCanvas);
slider.addEventListener("input", updateModelPanel);

activateSkill(skillCards[3], 3);
resizeCanvas();
updateModelPanel();
setInterval(typeCode, 42);
requestAnimationFrame(drawNetwork);
