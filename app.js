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

  function initHashPosition() {
    window.addEventListener("load", () => {
      const id = window.location.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }, { once: true });
  }

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
      document.dispatchEvent(new CustomEvent("projectfilterchange", {
        detail: { filter, visibleCount, total: cards.length },
      }));
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

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    const targets = $$(
      ".section-heading, .focus-grid article, .lifecycle-layout, .project-card, .note-card, .contact-section .section-copy",
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
        if (!reduceMotion && card.classList.contains("project-card")) {
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
          card.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
        }
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  /* ---------- Command palette ---------- */
  function initCommandPalette() {
    const palette = $("#command-palette");
    const backdrop = $("[data-command-backdrop]");
    const input = $("#command-input");
    const openers = $$("[data-command-open]");
    const closeButton = $("[data-command-close]");
    const items = $$("[data-command-item]");
    if (!palette || !backdrop || !input || !items.length) return;

    let lastFocus = null;
    let activeIndex = 0;

    const visibleItems = () => items.filter((item) => !item.hidden);

    const setActive = (index) => {
      const visible = visibleItems();
      if (!visible.length) return;
      activeIndex = (index + visible.length) % visible.length;
      visible.forEach((item, itemIndex) => item.classList.toggle("is-command-active", itemIndex === activeIndex));
      visible[activeIndex].focus({ preventScroll: true });
    };

    const filterItems = () => {
      const query = input.value.trim().toLowerCase();
      items.forEach((item) => {
        const label = `${item.dataset.commandLabel || ""} ${item.textContent || ""}`.toLowerCase();
        item.hidden = Boolean(query && !label.includes(query));
        item.classList.remove("is-command-active");
      });
      activeIndex = 0;
      const visible = visibleItems();
      if (visible[0]) visible[0].classList.add("is-command-active");
    };

    const openPalette = () => {
      lastFocus = document.activeElement;
      palette.hidden = false;
      backdrop.hidden = false;
      document.body.classList.add("command-open");
      input.value = "";
      filterItems();
      window.setTimeout(() => input.focus(), 20);
    };

    const closePalette = () => {
      palette.hidden = true;
      backdrop.hidden = true;
      document.body.classList.remove("command-open");
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus({ preventScroll: true });
      }
    };

    const runCommand = (item) => {
      const target = item.dataset.commandTarget;
      if (!target) return;
      closePalette();
      if (target.startsWith("#")) {
        const node = $(target);
        if (node) node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        if (history.pushState) history.pushState(null, "", target);
        return;
      }
      window.location.href = target;
    };

    openers.forEach((opener) => opener.addEventListener("click", openPalette));
    closeButton?.addEventListener("click", closePalette);
    backdrop.addEventListener("click", closePalette);
    input.addEventListener("input", filterItems);
    items.forEach((item) => item.addEventListener("click", () => runCommand(item)));

    document.addEventListener("keydown", (event) => {
      const isCommandShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (isCommandShortcut) {
        event.preventDefault();
        if (palette.hidden) openPalette();
        else closePalette();
      } else if (!palette.hidden && event.key === "Escape") {
        closePalette();
      } else if (!palette.hidden && event.key === "ArrowDown") {
        event.preventDefault();
        setActive(activeIndex + 1);
      } else if (!palette.hidden && event.key === "ArrowUp") {
        event.preventDefault();
        setActive(activeIndex - 1);
      } else if (!palette.hidden && event.key === "Enter") {
        const current = visibleItems()[activeIndex];
        if (current) {
          event.preventDefault();
          runCommand(current);
        }
      }
    });
  }

  /* ---------- Project inspector ---------- */
  function initProjectInspector() {
    const inspector = $(".project-inspector");
    const cards = $$("[data-project-groups]");
    if (!inspector || !cards.length) return;

    const current = $("[data-inspector-current]", inspector);
    const title = $("#project-inspector-title", inspector);
    const type = $(".inspector-type", inspector);
    const role = $("[data-inspector-role]", inspector);
    const proof = $("[data-inspector-proof]", inspector);
    const angle = $("[data-inspector-angle]", inspector);
    const tags = $(".inspector-tags", inspector);
    const link = $(".inspector-link", inspector);

    const update = (card) => {
      if (!card || card.hidden) return;
      const projectTitle = $("h3", card)?.textContent?.trim() || "Selected project";
      const projectSignal = card.dataset.projectSignal || $(".project-type", card)?.textContent?.trim() || "Project signal";
      const roleFit = card.dataset.roleFit || "Practical software work";
      const proofPoint = card.dataset.proof || "Readable code, workflow details, and project notes";
      const interviewAngle = card.dataset.angle || "A focused example to discuss decisions and tradeoffs.";
      const projectTags = $$(".tags li", card).map((tag) => tag.textContent.trim());
      const projectLink = $(".project-link", card)?.getAttribute("href") || "#projects";

      cards.forEach((item) => item.classList.toggle("is-previewed", item === card));
      if (current) current.textContent = projectTitle;
      if (title) title.textContent = "What this proves";
      if (type) type.textContent = projectSignal;
      if (role) role.textContent = roleFit;
      if (proof) proof.textContent = proofPoint;
      if (angle) angle.textContent = interviewAngle;
      if (tags) tags.innerHTML = projectTags.slice(0, 4).map((tag) => "<span>" + tag + "</span>").join("");
      if (link) {
        link.href = projectLink;
        link.setAttribute("aria-label", "Open the " + projectTitle + " README");
      }
    };

    cards.forEach((card) => {
      card.tabIndex = 0;
      card.addEventListener("pointerenter", () => update(card));
      card.addEventListener("focusin", () => update(card));
      card.addEventListener("click", (event) => {
        if (!event.target.closest("a")) update(card);
      });
    });

    inspector.addEventListener("pointermove", (event) => {
      const rect = inspector.getBoundingClientRect();
      inspector.style.setProperty("--cx", `${event.clientX - rect.left}px`);
      inspector.style.setProperty("--cy", `${event.clientY - rect.top}px`);
    });

    document.addEventListener("projectfilterchange", () => {
      update(cards.find((card) => !card.hidden));
    });
    update(cards[0]);
  }

  /* ---------- Skill capability map ---------- */
  function initSkillMap() {
    const canvas = $("#skill-map-canvas");
    const status = $("#skill-map-status");
    const cards = $$("[data-skill-card]");
    if (!canvas || !cards.length) return;

    const ctx = canvas.getContext("2d");
    const activeName = $("#skill-active-name");
    const selectionState = $("#skill-selection-state");
    const projectLinks = $("#skill-project-links");
    const projects = {
      pansub: { label: "PanSub", href: "#project-pansub" },
      sales: { label: "Video Game Sales ML", href: "#project-video-game-sales" },
      renova: { label: "ReNova Marketplace", href: "#project-renova" },
      study: { label: "Study Room Booking", href: "#project-study-room" },
      teacher: { label: "Teacher System", href: "#project-teacher-system" },
      portfolio: { label: "This portfolio", href: "#top" },
      zanytalk: {
        label: "ZanyTalk forum",
        href: "https://github.com/UOA-PGCIT-S1-2026/pgcit-final-project-zany-zorillas",
        external: true,
      },
      github: { label: "GitHub repositories", href: "https://github.com/hannnnnnnny", external: true },
    };
    const evidence = {
      Python: { text: "Cleans data, compares models, and turns outputs into readable evidence.", projects: ["sales"] },
      pandas: { text: "Builds repeatable cleaning, transformation, and analysis steps for structured data.", projects: ["sales"] },
      "scikit-learn": { text: "Supports model comparison, clustering, KNN, regression, and evaluation.", projects: ["sales"] },
      Jupyter: { text: "Keeps exploration, charts, decisions, and model outputs inspectable in one workflow.", projects: ["sales"] },
      KNN: { text: "Connects distance-based classification theory with an interactive browser demonstration.", projects: ["sales", "portfolio"] },
      "K-Means": { text: "Explores clusters and patterns before turning them into reportable findings.", projects: ["sales"] },
      R: { text: "Supports statistical analysis, visual exploration, and evidence-based reporting.", projects: ["github"] },
      Regression: { text: "Models relationships between variables and compares predictive performance.", projects: ["sales"] },
      AIDLC: { text: "Frames AI work around the user problem, data checks, evaluation, and iteration.", projects: ["pansub"] },
      Prompting: { text: "Uses prompts as one part of a product workflow, with outputs checked against the task.", projects: ["pansub"] },
      Translation: { text: "Applies AI-assisted translation to a concrete lecture-caption workflow.", projects: ["pansub"] },
      Extension: { text: "Works within browser constraints, live captions, overlays, and user-controlled interaction.", projects: ["pansub"] },
      Evaluation: { text: "Treats model or AI output as evidence to inspect, not a result to accept automatically.", projects: ["sales", "pansub"] },
      "Tool design": { text: "Turns a narrow user problem into a small interface that can be tested and improved.", projects: ["pansub", "study"] },
      Java: { text: "Implements domain logic and service layers for practical full-stack systems.", projects: ["renova", "teacher"] },
      "Spring Boot": { text: "Structures APIs, authentication, services, and transactional application flows.", projects: ["renova", "teacher"] },
      "Node.js": { text: "Runs ZanyTalk's Express and SQLite backend plus its JavaScript service tooling.", projects: ["zanytalk"] },
      Express: { text: "Provides a lightweight route and middleware model for backend prototypes.", projects: ["github"] },
      "REST API": { text: "Connects frontend workflows to clear resource and state transitions.", projects: ["renova", "teacher"] },
      Maven: { text: "Keeps Java builds and dependencies reproducible across machines.", projects: ["renova", "teacher"] },
      "Java Swing": { text: "Builds event-driven Java desktop interfaces with familiar application controls.", projects: ["github"] },
      Vue: { text: "Builds stateful product interfaces for marketplaces, booking, and administration.", projects: ["renova", "study", "teacher"] },
      Svelte: { text: "Explores component-based interfaces with a small runtime and direct reactivity.", projects: ["github"] },
      HTML5: { text: "Keeps portfolio and browser-extension structure semantic and progressively enhanced.", projects: ["pansub", "portfolio"] },
      CSS3: { text: "Handles responsive layout, visual hierarchy, interaction states, and reduced motion.", projects: ["portfolio", "pansub"] },
      JavaScript: { text: "Powers this portfolio's vanilla JavaScript canvas, filters, navigation, and interaction state.", projects: ["portfolio"] },
      Vite: { text: "Supports fast local iteration and reproducible frontend builds.", projects: ["study"] },
      MySQL: { text: "Grounds marketplace and administration workflows in explicit relational models.", projects: ["renova", "teacher"] },
      MongoDB: { text: "Supports document-oriented data models for flexible application prototypes.", projects: ["github"] },
      SQLite: { text: "Provides a compact local database for prototypes, scripts, and portable development workflows.", projects: ["github"] },
      SQL: { text: "Connects filters, relationships, reports, and application state to stored data.", projects: ["renova", "teacher"] },
      Git: { text: "Supports ZanyTalk's branch, commit, and pull-request workflow for reviewable team changes.", projects: ["zanytalk"] },
      GitHub: { text: "Makes source, READMEs, project history, and reviewable changes easy to inspect.", projects: ["github"] },
      npm: { text: "Manages JavaScript tooling and repeatable local project setup.", projects: ["study", "portfolio"] },
      Testing: { text: "Checks syntax, interactions, responsive layout, and edge states before publishing.", projects: ["portfolio", "sales"] },
      Playwright: { text: "Automates real browser flows, interaction checks, and responsive verification.", projects: ["portfolio"] },
      "E2E testing": { text: "Tests ZanyTalk user journeys with Playwright, alongside Vitest and Supertest API checks.", projects: ["zanytalk"] },
      "Google Cloud Platform (GCP)": { text: "Deployment/hosting on GCP; project evidence to be added.", projects: [] },
    };
    const nodes = [
      { key: "Data", label: "DATA", x: 0.2, y: 0.25, color: "#7dd3fc", text: "Data work anchors the site: cleaning, modelling, charts, and evidence." },
      { key: "AI", label: "AI", x: 0.66, y: 0.18, color: "#f48fb1", text: "AI tools connect user workflows with translation, search, and evaluation." },
      { key: "Backend", label: "API", x: 0.82, y: 0.47, color: "#f2c879", text: "Backend skills make the project real: APIs, auth, services, and deployment shape." },
      { key: "Frontend", label: "UI", x: 0.56, y: 0.76, color: "#7ee7d6", text: "Frontend turns the work into something people can actually inspect and use." },
      { key: "Database", label: "SQL", x: 0.2, y: 0.69, color: "#a7b8c7", text: "Database thinking keeps projects grounded in schema, queries, and relationships." },
      { key: "Engineering", label: "ENG", x: 0.45, y: 0.43, color: "#dce5ec", text: "Engineering connects JavaScript services, Git workflows, and automated testing." },
      { key: "Ops", label: "OPS", x: 0.83, y: 0.77, color: "#8ab4f8", text: "Systems and operations cover deployment, hosting, and cloud runtime concerns." },
    ];
    const links = [
      ["Data", "AI"], ["Data", "Database"], ["Data", "Engineering"],
      ["AI", "Frontend"], ["AI", "Engineering"], ["Backend", "Database"],
      ["Backend", "Frontend"], ["Backend", "Ops"], ["Frontend", "Engineering"],
      ["Engineering", "Ops"],
    ];
    let activeKey = cards[0].dataset.skillCard || "Data";
    let activeCard = cards[0];
    let pinnedCard = null;
    let rafId = 0;

    const nodeByKey = (key) => nodes.find((node) => node.key === key);

    const renderProjectLinks = (projectKeys) => {
      if (!projectLinks) return;
      projectLinks.replaceChildren();
      if (!projectKeys?.length) {
        const placeholder = document.createElement("span");
        placeholder.className = "skill-project-placeholder";
        placeholder.textContent = "Project evidence pending";
        projectLinks.append(placeholder);
        return;
      }
      projectKeys.forEach((projectKey) => {
        const project = projects[projectKey];
        if (!project) return;
        const link = document.createElement("a");
        link.href = project.href;
        link.textContent = project.label;
        if (project.external) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        } else if (project.href.startsWith("#project-")) {
          link.addEventListener("click", (event) => {
            const target = $(project.href);
            if (!target) return;
            event.preventDefault();
            $("[data-project-filter=\"all\"]")?.click();
            requestAnimationFrame(() => {
              target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
              window.history.replaceState(null, "", project.href);
            });
          });
        }
        projectLinks.append(link);
      });
    };

    const setActiveCard = (card) => {
      if (!card) return;
      activeCard = card;
      activeKey = card.dataset.skillCard || "Data";
      const tool = card.dataset.tool || card.getAttribute("aria-label") || "Selected tool";
      const detail = evidence[tool] || {
        text: nodeByKey(activeKey)?.text || "A practical part of the working stack.",
        projects: ["github"],
      };
      cards.forEach((item) => {
        item.classList.toggle("is-skill-active", item === card);
        item.setAttribute("aria-pressed", String(item === pinnedCard));
      });
      if (activeName) activeName.textContent = tool;
      if (selectionState) selectionState.textContent = pinnedCard === card ? "Pinned" : "Preview";
      if (status) status.textContent = detail.text;
      renderProjectLinks(detail.projects);
      draw(performance.now());
    };

    function draw(time) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(rect.width, 260);
      const h = Math.max(rect.height, 170);
      if (canvas.width !== Math.round(w * dpr)) canvas.width = Math.round(w * dpr);
      if (canvas.height !== Math.round(h * dpr)) canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(5, 8, 12, 0.72)";
      ctx.fillRect(0, 0, w, h);

      const pulse = reduceMotion ? 0 : Math.sin(time * 0.003) * 0.35 + 0.65;
      links.forEach(([from, to]) => {
        const a = nodeByKey(from);
        const b = nodeByKey(to);
        const active = from === activeKey || to === activeKey;
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.strokeStyle = active ? `rgba(126, 231, 214, ${0.22 + pulse * 0.28})` : "rgba(148, 163, 184, 0.12)";
        ctx.lineWidth = active ? 1.8 : 1;
        ctx.stroke();
      });

      nodes.forEach((node) => {
        const x = node.x * w;
        const y = node.y * h;
        const active = node.key === activeKey;
        ctx.beginPath();
        ctx.fillStyle = active ? hexToRgba(node.color, 0.24) : "rgba(148, 163, 184, 0.08)";
        ctx.arc(x, y, active ? 20 + pulse * 3 : 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(x, y, active ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = active ? "#f4f7fb" : "#9aa7b1";
        ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.label, x, y + 32);
      });
    }

    const loop = (time) => {
      draw(time);
      rafId = requestAnimationFrame(loop);
    };

    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => setActiveCard(card));
      card.addEventListener("pointerleave", () => {
        if (pinnedCard) setActiveCard(pinnedCard);
      });
      card.addEventListener("focusin", () => setActiveCard(card));
      card.addEventListener("click", () => {
        pinnedCard = pinnedCard === card ? null : card;
        setActiveCard(card);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !pinnedCard) return;
      pinnedCard = null;
      setActiveCard(activeCard || cards[0]);
    });
    window.addEventListener("resize", () => draw(performance.now()));
    setActiveCard(cards[0]);
    if (!reduceMotion) rafId = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else if (!reduceMotion) rafId = requestAnimationFrame(loop);
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

  function initIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  /* ---------- Kinetic marquee ---------- */
  function initMarquee() {
    const track = $("[data-marquee] .marquee-track");
    const group = track && $(".marquee-group", track);
    if (!track || !group) return;
    // Duplicate the group so a -50% translate loops seamlessly.
    track.appendChild(group.cloneNode(true));
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    const strength = 0.24;
    $$("[data-magnetic]").forEach((el) => {
      const inner = $(".magnetic-inner", el);
      el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect();
        const mx = event.clientX - (rect.left + rect.width / 2);
        const my = event.clientY - (rect.top + rect.height / 2);
        // Integer translate3d keeps composited text crisp (no subpixel blur).
        const tx = Math.round(mx * strength);
        const ty = Math.round(my * strength);
        el.style.transition = "transform 0s";
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        if (inner) inner.style.transform = `translate3d(${Math.round(tx * 0.4)}px, ${Math.round(ty * 0.4)}px, 0)`;
      });
      const reset = () => {
        el.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "";
        if (inner) inner.style.transform = "";
      };
      el.addEventListener("pointerleave", reset);
      el.addEventListener("blur", reset);
    });
  }

  /* ---------- boot ---------- */
  initIcons();
  initMarquee();
  initMagnetic();
  initHashPosition();
  initProjectFilters();
  initLifecycleTabs();
  initScrollSync();
  initHeroSpotlight();
  initScrollReveal();
  initCardGlow();
  initCommandPalette();
  initProjectInspector();
  initSkillMap();
  initKnn();
})();
