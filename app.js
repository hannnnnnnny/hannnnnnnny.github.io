(() => {
  if (!window.Vue) {
    return;
  }

  const mountTarget = document.querySelector("#portfolio-app");
  if (!mountTarget) {
    return;
  }

  const { createApp } = window.Vue;
  const ui = {};

  createApp({
    data() {
      return {
        activeFilter: "all",
        activeLifecycle: "frame",
        activeSection: "top",
        kValue: 5,
        scrollProgress: 0,
        cleanup: [],
        knnPoints: [],
        knnProbe: { x: 0.55, y: 0.45 },
      };
    },
    render() {
      return null;
    },
    mounted() {
      document.documentElement.classList.add("js-enabled");
      this.cacheInterface();
      this.bindProjectFilters();
      this.bindLifecycleTabs();
      this.bindKnnControl();
      this.observeSections();
      this.updateScrollProgress();
      this.updateProjectFilter();
      this.updateLifecycle();
      this.updateNavigation();
      this.prepareKnnSketch();

      const onScroll = () => this.updateScrollProgress();
      window.addEventListener("scroll", onScroll, { passive: true });
      this.cleanup.push(() => window.removeEventListener("scroll", onScroll));
    },
    beforeUnmount() {
      this.cleanup.forEach((dispose) => dispose());
    },
    methods: {
      cacheInterface() {
        ui.progress = document.querySelector(".scroll-progress");
        ui.projectButtons = Array.from(document.querySelectorAll("[data-project-filter]"));
        ui.projectCards = Array.from(document.querySelectorAll("[data-project-groups]"));
        ui.lifecycleButtons = Array.from(document.querySelectorAll("[data-lifecycle-target]"));
        ui.lifecyclePanels = Array.from(document.querySelectorAll("[data-lifecycle-panel]"));
        ui.navLinks = Array.from(document.querySelectorAll("[data-section-link]"));
        ui.kInput = document.querySelector("#knn-k");
        ui.kOutput = document.querySelector("#knn-k-output");
      },
      bindProjectFilters() {
        ui.projectButtons.forEach((button) => {
          const onClick = () => {
            this.activeFilter = button.dataset.projectFilter || "all";
          };
          button.addEventListener("click", onClick);
          this.cleanup.push(() => button.removeEventListener("click", onClick));
        });
      },
      bindLifecycleTabs() {
        ui.lifecycleButtons.forEach((button) => {
          const onClick = () => {
            this.activeLifecycle = button.dataset.lifecycleTarget || "frame";
          };
          button.addEventListener("click", onClick);
          this.cleanup.push(() => button.removeEventListener("click", onClick));
        });
      },
      bindKnnControl() {
        if (!ui.kInput) {
          return;
        }

        this.kValue = Number(ui.kInput.value);
        const onInput = () => {
          this.kValue = Number(ui.kInput.value);
        };
        ui.kInput.addEventListener("input", onInput);
        this.cleanup.push(() => ui.kInput.removeEventListener("input", onInput));
        this.updateKnnOutput();
      },
      updateProjectFilter() {
        ui.projectButtons.forEach((button) => {
          const isActive = button.dataset.projectFilter === this.activeFilter;
          button.classList.toggle("active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });

        ui.projectCards.forEach((card) => {
          const groups = (card.dataset.projectGroups || "").split(" ");
          const isVisible = this.activeFilter === "all" || groups.includes(this.activeFilter);
          card.hidden = !isVisible;
        });
      },
      updateLifecycle() {
        ui.lifecycleButtons.forEach((button) => {
          const isActive = button.dataset.lifecycleTarget === this.activeLifecycle;
          button.classList.toggle("active", isActive);
          button.setAttribute("aria-selected", String(isActive));
        });

        ui.lifecyclePanels.forEach((panel) => {
          const isActive = panel.dataset.lifecyclePanel === this.activeLifecycle;
          panel.classList.toggle("active", isActive);
          panel.hidden = !isActive;
        });
      },
      updateNavigation() {
        ui.navLinks.forEach((link) => {
          const isActive = link.dataset.sectionLink === this.activeSection;
          link.classList.toggle("active", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      updateScrollProgress() {
        const page = document.documentElement;
        const maxScroll = page.scrollHeight - window.innerHeight;
        this.scrollProgress = maxScroll > 0 ? Math.min(page.scrollTop / maxScroll, 1) : 0;

        if (ui.progress) {
          ui.progress.style.transform = `scaleX(${this.scrollProgress})`;
        }
      },
      observeSections() {
        const sections = Array.from(document.querySelectorAll("main section[id]"));

        if (!("IntersectionObserver" in window) || sections.length === 0) {
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.activeSection = entry.target.id;
              }
            });
          },
          {
            rootMargin: "-38% 0px -48% 0px",
            threshold: 0.02,
          },
        );

        sections.forEach((section) => observer.observe(section));
        this.cleanup.push(() => observer.disconnect());
      },
      updateKnnOutput() {
        if (ui.kOutput) {
          ui.kOutput.textContent = `k = ${this.kValue}`;
        }
      },
      prepareKnnSketch() {
        ui.canvas = document.querySelector("#model-canvas");
        if (!ui.canvas) {
          return;
        }

        this.knnPoints = [
          { x: 0.18, y: 0.28, label: "A" },
          { x: 0.23, y: 0.38, label: "A" },
          { x: 0.31, y: 0.23, label: "A" },
          { x: 0.35, y: 0.36, label: "A" },
          { x: 0.42, y: 0.31, label: "A" },
          { x: 0.62, y: 0.24, label: "B" },
          { x: 0.72, y: 0.34, label: "B" },
          { x: 0.78, y: 0.23, label: "B" },
          { x: 0.83, y: 0.42, label: "B" },
          { x: 0.68, y: 0.48, label: "B" },
          { x: 0.25, y: 0.72, label: "C" },
          { x: 0.36, y: 0.64, label: "C" },
          { x: 0.45, y: 0.78, label: "C" },
          { x: 0.54, y: 0.68, label: "C" },
          { x: 0.58, y: 0.82, label: "C" },
        ];

        const onResize = () => this.drawModelSketch();
        window.addEventListener("resize", onResize);
        this.cleanup.push(() => window.removeEventListener("resize", onResize));
        this.drawModelSketch();
      },
      drawModelSketch() {
        const canvas = ui.canvas;
        if (!canvas || this.knnPoints.length === 0) {
          return;
        }

        const ctx = canvas.getContext("2d");
        const bounds = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(bounds.width, 260);
        const height = Math.max(bounds.height, 180);

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const palette = {
          A: "#f48fb1",
          B: "#7dd3fc",
          C: "#7ee7d6",
        };
        const padding = 22;
        const plotWidth = width - padding * 2;
        const plotHeight = height - padding * 2;
        const pointToScreen = (point) => ({
          x: padding + point.x * plotWidth,
          y: padding + point.y * plotHeight,
        });
        const probe = pointToScreen(this.knnProbe);
        const neighbours = this.knnPoints
          .map((point) => {
            const screen = pointToScreen(point);
            const distance = Math.hypot(screen.x - probe.x, screen.y - probe.y);
            return { point, screen, distance };
          })
          .sort((left, right) => left.distance - right.distance)
          .slice(0, Number(this.kValue));

        ctx.fillStyle = "#0b0f14";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.16)";
        ctx.lineWidth = 1;

        for (let x = padding; x <= width - padding; x += plotWidth / 4) {
          ctx.beginPath();
          ctx.moveTo(x, padding);
          ctx.lineTo(x, height - padding);
          ctx.stroke();
        }

        for (let y = padding; y <= height - padding; y += plotHeight / 3) {
          ctx.beginPath();
          ctx.moveTo(padding, y);
          ctx.lineTo(width - padding, y);
          ctx.stroke();
        }

        neighbours.forEach(({ screen, point }) => {
          ctx.beginPath();
          ctx.strokeStyle = `${palette[point.label]}99`;
          ctx.lineWidth = 1.4;
          ctx.moveTo(probe.x, probe.y);
          ctx.lineTo(screen.x, screen.y);
          ctx.stroke();
        });

        this.knnPoints.forEach((point) => {
          const screen = pointToScreen(point);
          ctx.beginPath();
          ctx.fillStyle = palette[point.label];
          ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
          ctx.lineWidth = 2;
          ctx.arc(screen.x, screen.y, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });

        ctx.beginPath();
        ctx.fillStyle = "#f2c879";
        ctx.strokeStyle = "rgba(242, 200, 121, 0.45)";
        ctx.lineWidth = 6;
        ctx.arc(probe.x, probe.y, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = "rgba(244, 247, 251, 0.74)";
        ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.fillText("probe", probe.x + 12, probe.y - 8);
      },
    },
    watch: {
      activeFilter() {
        this.updateProjectFilter();
      },
      activeLifecycle() {
        this.updateLifecycle();
      },
      activeSection() {
        this.updateNavigation();
      },
      kValue() {
        this.updateKnnOutput();
        this.drawModelSketch();
      },
    },
  }).mount(mountTarget);
})();
