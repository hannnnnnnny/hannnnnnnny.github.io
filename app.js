/*
 * Yi Han - portfolio interactions (vanilla, no framework).
 * Modules: project filters, AIDLC tabs, scroll progress, section nav,
 * hero spotlight, role typewriter, scroll reveal, card spotlight,
 * and an interactive KNN classifier (the hero widget).
 */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.documentElement.classList.add("js-enabled");

  /* ---------- Project filters ---------- */
  function initProjectFilters() {
    const buttons = $$("[data-project-filter]");
    const cards = $$("[data-project-groups]");
    const status = $("#project-filter-status");
    if (!buttons.length) return;

    const apply = (filter) => {
      const activeButton = buttons.find((button) => button.dataset.projectFilter === filter);
      const filterLabel = activeButton ? activeButton.textContent.trim() : "All";
      let visibleCount = 0;

      buttons.forEach((button) => {
        const active = button.dataset.projectFilter === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      cards.forEach((card) => {
        const groups = (card.dataset.projectGroups || "").split(/\s+/).filter(Boolean);
        const visible = filter === "all" || groups.includes(filter);
        card.hidden = !visible;
        card.classList.toggle("is-filtered-out", !visible);
        if (visible) visibleCount += 1;
      });
      if (status) {
        status.textContent = filter === "all"
          ? `Showing all ${cards.length} selected projects.`
          : `Showing ${visibleCount} of ${cards.length} selected projects for ${filterLabel}.`;
      }
    };

    buttons.forEach((button) =>
      button.addEventListener("click", () => apply(button.dataset.projectFilter || "all")),
    );
    apply("all");
  }

  /* ---------- AIDLC lifecycle tabs ---------- */
  function initLifecycleTabs() {
    const tabs = $$("[data-lifecycle-target]");
    const panels = $$("[data-lifecycle-panel]");
    if (!tabs.length) return;

    const apply = (target) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.lifecycleTarget === target;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.dataset.lifecyclePanel === target;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });
    };

    tabs.forEach((tab) =>
      tab.addEventListener("click", () => apply(tab.dataset.lifecycleTarget || "frame")),
    );
    apply("frame");
  }

  /* ---------- Scroll progress + active section ---------- */
  function initScrollSync() {
    const progress = $(".scroll-progress");
    const navLinks = $$("[data-section-link]");

    const onScroll = () => {
      if (!progress) return;
      const page = document.documentElement;
      const max = page.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(page.scrollTop / max, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const sections = $$("main section[id]");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.dataset.sectionLink === entry.target.id;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-38% 0px -48% 0px", threshold: 0.02 },
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Hero cursor spotlight ---------- */
  function initHeroSpotlight() {
    const hero = $(".hero");
    if (!hero || !finePointer || reduceMotion) return;

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      hero.classList.add("spotlight-on");
    });
    hero.addEventListener("pointerleave", () => hero.classList.remove("spotlight-on"));
  }

  /* ---------- Role typewriter ---------- */
  function initRoleRotator() {
    const rotator = $(".role-rotator");
    const word = rotator && $(".role-word", rotator);
    if (!rotator || !word) return;

    const roles = (rotator.dataset.roles || "").split("|").filter(Boolean);
    if (roles.length < 2) return;

    if (reduceMotion) {
      word.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    const tick = () => {
      const current = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      word.textContent = current.slice(0, charIndex);

      let delay = deleting ? 45 : 95;
      if (!deleting && charIndex === current.length) {
        delay = 1500;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 320;
      }
      window.setTimeout(tick, delay);
    };
    window.setTimeout(tick, 1600);
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    const targets = $$(
      ".section-heading, .focus-grid article, .lifecycle-layout, .project-card, .note-card, .skills-grid section, .contact-section .section-copy",
    );
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    targets.forEach((node, index) => {
      node.classList.add("reveal");
      node.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 60}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    targets.forEach((node) => observer.observe(node));
  }

  /* ---------- Card cursor glow ---------- */
  function initCardGlow() {
    if (!finePointer) return;
    const cards = $$(".project-card, .focus-grid article, .note-card");
    cards.forEach((card) => {
      card.classList.add("has-glow");
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--cx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--cy", `${event.clientY - rect.top}px`);
      });
    });
  }

  /* ---------- Interactive KNN classifier ---------- */
  const KNN = {
    labels: ["A", "B", "C"],
    palette: { A: "#f48fb1", B: "#7dd3fc", C: "#7ee7d6" },
    names: { A: "Cluster A", B: "Cluster B", C: "Cluster C" },
    points: [
      { x: 0.18, y: 0.30, label: "A" }, { x: 0.24, y: 0.40, label: "A" },
      { x: 0.31, y: 0.24, label: "A" }, { x: 0.35, y: 0.37, label: "A" },
      { x: 0.41, y: 0.30, label: "A" }, { x: 0.22, y: 0.20, label: "A" },
      { x: 0.64, y: 0.24, label: "B" }, { x: 0.73, y: 0.33, label: "B" },
      { x: 0.79, y: 0.23, label: "B" }, { x: 0.83, y: 0.41, label: "B" },
      { x: 0.69, y: 0.47, label: "B" }, { x: 0.86, y: 0.30, label: "B" },
      { x: 0.26, y: 0.72, label: "C" }, { x: 0.37, y: 0.64, label: "C" },
      { x: 0.46, y: 0.79, label: "C" }, { x: 0.55, y: 0.68, label: "C" },
      { x: 0.60, y: 0.82, label: "C" }, { x: 0.69, y: 0.71, label: "C" },
    ],
    grid: { cols: 30, rows: 22, cells: null, k: -1 },
    probe: { x: 0.52, y: 0.5 },
    pad: 24,
    k: 5,
    lastPred: null,
    lastInteraction: 0,
    following: false,
  };

  function knnClassify(nx, ny, k) {
    const nearest = KNN.points
      .map((p) => ({ label: p.label, d: (p.x - nx) ** 2 + (p.y - ny) ** 2 }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);

    const votes = { A: 0, B: 0, C: 0 };
    const weight = { A: 0, B: 0, C: 0 };
    nearest.forEach((n, i) => {
      votes[n.label] += 1;
      weight[n.label] += k - i; // tie-break toward closer neighbours
    });
    let best = "A";
    KNN.labels.forEach((label) => {
      if (votes[label] > votes[best] || (votes[label] === votes[best] && weight[label] > weight[best])) {
        best = label;
      }
    });
    return { label: best, votes };
  }

  function buildDecisionGrid(k) {
    if (KNN.grid.k === k && KNN.grid.cells) return;
    const { cols, rows } = KNN.grid;
    const cells = new Array(cols * rows);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const nx = (c + 0.5) / cols;
        const ny = (r + 0.5) / rows;
        cells[r * cols + c] = knnClassify(nx, ny, k).label;
      }
    }
    KNN.grid.cells = cells;
    KNN.grid.k = k;
  }

  function initKnn() {
    const canvas = $("#model-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const kInput = $("#knn-k");
    const kOutput = $("#knn-k-output");
    const predEl = $("#knn-pred");
    const votesEl = $("#knn-votes");

    const toScreen = (w, h, p) => ({
      x: KNN.pad + p.x * (w - KNN.pad * 2),
      y: KNN.pad + p.y * (h - KNN.pad * 2),
    });
    const toNorm = (w, h, px, py) => ({
      x: clamp((px - KNN.pad) / (w - KNN.pad * 2), 0, 1),
      y: clamp((py - KNN.pad) / (h - KNN.pad * 2), 0, 1),
    });

    function updateReadout() {
      const { label, votes } = knnClassify(KNN.probe.x, KNN.probe.y, KNN.k);
      const signature = `${label}:${votes.A}:${votes.B}:${votes.C}:${KNN.k}`;
      if (signature === KNN.lastPred) return;
      KNN.lastPred = signature;

      if (predEl) {
        predEl.textContent = KNN.names[label];
        predEl.style.color = KNN.palette[label];
      }
      if (votesEl) {
        votesEl.innerHTML = KNN.labels
          .map((l) => {
            const pct = (votes[l] / KNN.k) * 100;
            return `<span class="knn-vote"><span class="knn-bar">` +
              `<i style="width:${pct}%;background:${KNN.palette[l]}"></i></span>` +
              `<b>${l} &middot; ${votes[l]}</b></span>`;
          })
          .join("");
      }
    }

    function draw(time) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(rect.width, 240);
      const h = Math.max(rect.height, 170);
      if (canvas.width !== Math.round(w * dpr)) canvas.width = Math.round(w * dpr);
      if (canvas.height !== Math.round(h * dpr)) canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // idle auto-orbit so the widget feels alive
      if (!reduceMotion && !KNN.following && time - KNN.lastInteraction > 2200) {
        const t = time * 0.00018;
        KNN.probe.x = 0.5 + 0.3 * Math.sin(t * 0.9);
        KNN.probe.y = 0.5 + 0.26 * Math.sin(t * 1.33 + 0.7);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0a0e13";
      ctx.fillRect(0, 0, w, h);

      buildDecisionGrid(KNN.k);
      const { cols, rows, cells } = KNN.grid;
      const cellW = (w - KNN.pad * 2) / cols;
      const cellH = (h - KNN.pad * 2) / rows;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          ctx.fillStyle = hexToRgba(KNN.palette[cells[r * cols + c]], 0.1);
          ctx.fillRect(KNN.pad + c * cellW, KNN.pad + r * cellH, cellW + 0.6, cellH + 0.6);
        }
      }

      // faint plot frame
      ctx.strokeStyle = "rgba(148,163,184,0.14)";
      ctx.lineWidth = 1;
      ctx.strokeRect(KNN.pad, KNN.pad, w - KNN.pad * 2, h - KNN.pad * 2);

      const probe = toScreen(w, h, KNN.probe);
      const neighbours = KNN.points
        .map((p) => {
          const s = toScreen(w, h, p);
          return { p, s, d: Math.hypot(s.x - probe.x, s.y - probe.y) };
        })
        .sort((a, b) => a.d - b.d)
        .slice(0, KNN.k);
      const nearestSet = new Set(neighbours.map((n) => n.p));

      // animated neighbour links
      const dash = reduceMotion ? 0 : (time * 0.03) % 12;
      neighbours.forEach(({ s, p }) => {
        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(KNN.palette[p.label], 0.6);
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -dash;
        ctx.moveTo(probe.x, probe.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // data points
      KNN.points.forEach((p) => {
        const s = toScreen(w, h, p);
        const isNear = nearestSet.has(p);
        if (isNear) {
          ctx.beginPath();
          ctx.strokeStyle = hexToRgba(KNN.palette[p.label], 0.55);
          ctx.lineWidth = 2;
          ctx.arc(s.x, s.y, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = KNN.palette[p.label];
        ctx.strokeStyle = "rgba(8,12,18,0.85)";
        ctx.lineWidth = 1.5;
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // probe, coloured by prediction
      const pred = knnClassify(KNN.probe.x, KNN.probe.y, KNN.k).label;
      const pulse = reduceMotion ? 0 : Math.sin(time * 0.004) * 2;
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(KNN.palette[pred], 0.16);
      ctx.arc(probe.x, probe.y, 18 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#f4f7fb";
      ctx.strokeStyle = KNN.palette[pred];
      ctx.lineWidth = 3;
      ctx.arc(probe.x, probe.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      updateReadout();
    }

    let rafId = 0;
    let running = false;
    const loop = (time) => {
      draw(time);
      rafId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    // pointer follow
    const setProbeFromEvent = (event) => {
      const rect = canvas.getBoundingClientRect();
      KNN.probe = toNorm(rect.width, rect.height, event.clientX - rect.left, event.clientY - rect.top);
      KNN.lastInteraction = performance.now();
    };
    canvas.addEventListener("pointerenter", () => {
      KNN.following = true;
    });
    canvas.addEventListener("pointermove", (event) => {
      KNN.following = true;
      setProbeFromEvent(event);
      if (!running) draw(performance.now());
    });
    canvas.addEventListener("pointerdown", (event) => {
      KNN.following = true;
      setProbeFromEvent(event);
      if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    });
    const release = () => {
      KNN.following = false;
      KNN.lastInteraction = performance.now();
    };
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointerleave", release);
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    // k control
    if (kInput) {
      const onInput = () => {
        KNN.k = Number(kInput.value);
        if (kOutput) kOutput.textContent = `k = ${KNN.k}`;
        KNN.lastInteraction = performance.now();
        if (!running) draw(performance.now());
      };
      kInput.addEventListener("input", onInput);
      KNN.k = Number(kInput.value) || 5;
    }

    // pause when off-screen / tab hidden
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !reduceMotion) start();
            else stop();
          });
        },
        { threshold: 0.05 },
      );
      io.observe(canvas);
    } else if (!reduceMotion) {
      start();
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (!reduceMotion) start();
    });

    draw(performance.now()); // first paint even when reduced motion
  }

  /* ---------- helpers ---------- */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function hexToRgba(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  /* ---------- boot ---------- */
  initProjectFilters();
  initLifecycleTabs();
  initScrollSync();
  initHeroSpotlight();
  initRoleRotator();
  initScrollReveal();
  initCardGlow();
  initKnn();
})();
