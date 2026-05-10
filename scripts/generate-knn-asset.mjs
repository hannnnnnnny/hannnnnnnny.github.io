import fs from "node:fs/promises";

const width = 1200;
const height = 780;
const margin = { top: 172, right: 58, bottom: 96, left: 88 };
const plotW = width - margin.left - margin.right;
const plotH = height - margin.top - margin.bottom;
const centers = [
  [-2.2, -1.0],
  [1.9, 1.35],
  [0.2, -2.15]
];
const spreads = [0.82, 0.9, 0.72];
const regionColors = ["#ffd4e3", "#d8f4eb", "#ddd6ff"];
const pointColors = ["#c94f7c", "#2f9d82", "#6b5bd6"];
const labels = ["Segment A", "Segment B", "Segment C"];

let seed = 7;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function gaussian() {
  const u = Math.max(random(), 1e-9);
  const v = Math.max(random(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const samples = [];
for (let cls = 0; cls < centers.length; cls += 1) {
  for (let i = 0; i < 60; i += 1) {
    samples.push({
      x: centers[cls][0] + gaussian() * spreads[cls],
      y: centers[cls][1] + gaussian() * spreads[cls],
      cls
    });
  }
}

const xMin = Math.min(...samples.map((d) => d.x)) - 1.05;
const xMax = Math.max(...samples.map((d) => d.x)) + 1.05;
const yMin = Math.min(...samples.map((d) => d.y)) - 1.05;
const yMax = Math.max(...samples.map((d) => d.y)) + 1.05;

function classify(x, y) {
  const nearest = samples
    .map((sample) => ({
      cls: sample.cls,
      distance: Math.hypot(sample.x - x, sample.y - y)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 7);

  const votes = [0, 0, 0];
  nearest.forEach((item) => {
    votes[item.cls] += 1 / Math.max(item.distance, 0.001);
  });
  return votes.indexOf(Math.max(...votes));
}

function sx(x) {
  return margin.left + ((x - xMin) / (xMax - xMin)) * plotW;
}

function sy(y) {
  return margin.top + (1 - (y - yMin) / (yMax - yMin)) * plotH;
}

const cell = 16;
const cells = [];
for (let py = margin.top; py < margin.top + plotH; py += cell) {
  for (let px = margin.left; px < margin.left + plotW; px += cell) {
    const x = xMin + ((px - margin.left + cell / 2) / plotW) * (xMax - xMin);
    const y = yMax - ((py - margin.top + cell / 2) / plotH) * (yMax - yMin);
    const cls = classify(x, y);
    cells.push(`<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${cell + 1}" height="${cell + 1}" fill="${regionColors[cls]}" opacity="0.78"/>`);
  }
}

const grid = [];
for (let i = 0; i <= 8; i += 1) {
  const x = margin.left + (plotW / 8) * i;
  grid.push(`<line x1="${x}" y1="${margin.top}" x2="${x}" y2="${margin.top + plotH}" stroke="#ffffff" stroke-width="1.4" opacity="0.85"/>`);
}
for (let i = 0; i <= 6; i += 1) {
  const y = margin.top + (plotH / 6) * i;
  grid.push(`<line x1="${margin.left}" y1="${y}" x2="${margin.left + plotW}" y2="${y}" stroke="#ffffff" stroke-width="1.4" opacity="0.85"/>`);
}

const points = samples
  .map((sample) => {
    const r = 7.2 + random() * 2.3;
    return `<circle cx="${sx(sample.x).toFixed(1)}" cy="${sy(sample.y).toFixed(1)}" r="${r.toFixed(1)}" fill="${pointColors[sample.cls]}" stroke="#fff" stroke-width="2.2" opacity="0.93"/>`;
  })
  .join("\n");

const legend = labels
  .map((label, index) => {
    const y = 116 + index * 34;
    return `<g><circle cx="925" cy="${y}" r="8" fill="${pointColors[index]}" stroke="#fff" stroke-width="2"/><text x="944" y="${y + 5}" font-size="18" font-weight="700" fill="#6f5a66">${label}</text></g>`;
  })
  .join("\n");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="KNN decision boundary visualization">
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#c94f7c" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="titleGradient" x1="0" x2="1">
      <stop stop-color="#c94f7c"/>
      <stop offset="1" stop-color="#8e7ad8"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="780" rx="32" fill="#fff7fb"/>
  <rect x="28" y="28" width="1144" height="724" rx="28" fill="#ffffff" opacity="0.66" filter="url(#softShadow)"/>
  <text x="64" y="66" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="#c94f7c" letter-spacing="2">REAL KNN CLASSIFICATION</text>
  <text x="64" y="114" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="900" fill="#241a22">K=7 Decision Boundary</text>
  <text x="64" y="148" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="#6f5a66">180 observations · distance-weighted nearest neighbors · predicted class regions</text>
  <g clip-path="inset(${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px round 18px)">
    ${cells.join("\n")}
    ${grid.join("\n")}
  </g>
  <rect x="${margin.left}" y="${margin.top}" width="${plotW}" height="${plotH}" rx="18" fill="none" stroke="#f3b3cc" stroke-width="2"/>
  ${points}
  <text x="${margin.left}" y="${height - 36}" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="#6f5a66">Feature 1: engagement score</text>
  <text x="28" y="${margin.top + plotH / 2}" transform="rotate(-90 28 ${margin.top + plotH / 2})" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="#6f5a66">Feature 2: value signal</text>
  <rect x="894" y="52" width="238" height="132" rx="18" fill="#fff" opacity="0.9" stroke="#f1b3ca"/>
  ${legend}
  <text x="640" y="724" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="900" fill="url(#titleGradient)">KNN learns local structure from nearby examples</text>
</svg>
`;

await fs.writeFile("assets/knn-distribution.svg", svg, "utf8");
console.log("Generated assets/knn-distribution.svg");
