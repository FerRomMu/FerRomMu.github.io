/* Fernando Romero — portfolio PoC
   horizontal scroll engine + HUD, hand-written, no libraries */

(() => {
  "use strict";

  const track = document.getElementById("track");
  const posEl = document.getElementById("pos");
  const secEl = document.getElementById("sec");
  const hintEl = document.getElementById("hint");
  const clockEl = document.getElementById("clock");
  const ruler = document.querySelector(".ruler");
  const rulerBox = document.querySelector(".ruler-box");
  const navLinks = [...document.querySelectorAll(".bar-nav a")];
  const sections = [...document.querySelectorAll(".panel")];

  const mqMobile = matchMedia("(max-width: 900px)");
  const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");

  const horizontal = () => !mqMobile.matches;

  /* ---------------- ruler ticks ---------------- */
  const TICKS = 29;
  for (let i = 0; i < TICKS; i++) ruler.appendChild(document.createElement("i"));

  /* ---------------- scroll state ---------------- */
  let pos = 0;
  let target = 0;
  let max = 0;
  let raf = null;
  let currentSec = -1;
  let hintOff = false;

  const clamp = (v) => Math.min(max, Math.max(0, v));

  function measure() {
    if (!horizontal()) return;
    max = Math.max(0, track.scrollWidth - window.innerWidth);
    target = clamp(target);
    pos = clamp(pos);
    apply();
    hud(true);
  }

  function apply() {
    track.style.transform = `translate3d(${-pos}px, 0, 0)`;
  }

  function start() {
    if (raf === null) raf = requestAnimationFrame(step);
  }

  function step() {
    const ease = mqReduce.matches ? 1 : 0.09;
    pos += (target - pos) * ease;
    if (Math.abs(target - pos) < 0.1) pos = target;
    apply();
    hud(false);
    raf = pos !== target ? requestAnimationFrame(step) : null;
  }

  /* ---------------- HUD: pos readout, ruler box, section, nav ---------------- */
  function hud(force) {
    const p = max > 0 ? pos / max : 0;
    posEl.textContent = p.toFixed(3);

    const stripW = ruler.offsetWidth;
    const boxW = Math.max(18, Math.round(stripW * (window.innerWidth / (max + window.innerWidth))));
    rulerBox.style.width = boxW + "px";
    rulerBox.style.transform = `translateX(${p * (stripW - boxW)}px)`;

    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetLeft <= pos + window.innerWidth * 0.45) idx = i;
    }
    if (idx !== currentSec || force) {
      currentSec = idx;
      secEl.textContent = String(idx).padStart(2, "0") + " / " + String(sections.length - 1).padStart(2, "0");
      const id = sections[idx].id;
      navLinks.forEach((a) => {
        const active = a.dataset.goto === id;
        a.classList.toggle("active", active);
        if (active) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
  }

  function hideHint() {
    if (!hintOff && target > 60) {
      hintOff = true;
      hintEl.classList.add("off");
    }
  }

  /* ---------------- input: wheel ---------------- */
  window.addEventListener(
    "wheel",
    (e) => {
      if (!horizontal()) return;
      e.preventDefault();
      const raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const k = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? window.innerWidth : 1;
      target = clamp(target + raw * k);
      start();
      hideHint();
    },
    { passive: false }
  );

  /* ---------------- input: keyboard ---------------- */
  window.addEventListener("keydown", (e) => {
    if (!horizontal()) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t instanceof HTMLElement && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;

    const stepSmall = 180;
    const stepPage = window.innerWidth * 0.85;
    let handled = true;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        target = clamp(target + stepSmall);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        target = clamp(target - stepSmall);
        break;
      case "PageDown":
      case " ":
        target = clamp(target + (e.shiftKey ? -stepPage : stepPage));
        break;
      case "PageUp":
        target = clamp(target - stepPage);
        break;
      case "Home":
        target = 0;
        break;
      case "End":
        target = max;
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
      start();
      hideHint();
    }
  });

  /* ---------------- input: pointer drag ---------------- */
  let dragX0 = 0;
  let dragT0 = 0;
  let dragging = false;
  let dragged = false;

  track.addEventListener("pointerdown", (e) => {
    if (!horizontal() || e.button !== 0) return;
    dragging = true;
    dragged = false;
    dragX0 = e.clientX;
    dragT0 = target;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragX0;
    if (Math.abs(dx) > 6) {
      dragged = true;
      document.body.style.userSelect = "none";
    }
    if (dragged) {
      target = clamp(dragT0 - dx * 1.4);
      start();
      hideHint();
    }
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
    document.body.style.userSelect = "";
  });

  track.addEventListener(
    "click",
    (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    },
    true
  );

  /* ---------------- navigation ---------------- */
  function goTo(id, instant) {
    const sec = document.getElementById(id);
    if (!sec) return;
    if (!horizontal()) {
      sec.scrollIntoView({ behavior: mqReduce.matches ? "auto" : "smooth" });
      return;
    }
    target = clamp(id === "top" ? 0 : sec.offsetLeft);
    if (instant) {
      pos = target;
      apply();
      hud(true);
    }
    start();
    hideHint();
  }

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.dataset.goto;
      goTo(id, false);
      history.replaceState(null, "", "#" + id);
    });
  });

  /* keep focused elements in view (tab navigation) */
  document.addEventListener("focusin", (e) => {
    if (!horizontal() || !(e.target instanceof HTMLElement)) return;
    if (e.target.closest(".bar")) return;
    const r = e.target.getBoundingClientRect();
    if (r.left < 0 || r.right > window.innerWidth) {
      target = clamp(pos + r.left - window.innerWidth * 0.3);
      start();
    }
  });

  /* ---------------- reveals + glitch on scroll-into-view ---------------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        if (entry.target.classList.contains("glitch") && !mqReduce.matches) {
          entry.target.classList.add("play");
        }
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--i", String(i % 6));
    io.observe(el);
  });
  document.querySelectorAll(".sec-title.glitch").forEach((el) => io.observe(el));

  /* ---------------- X/Y readout tracks the cursor ---------------- */
  const mxEl = document.getElementById("mx");
  const myEl = document.getElementById("my");
  window.addEventListener("mousemove", (e) => {
    mxEl.textContent = (e.clientX / window.innerWidth).toFixed(3);
    myEl.textContent = (e.clientY / window.innerHeight).toFixed(3);
  });

  /* ---------------- experience project cards ---------------- */
  const xpStage = document.querySelector(".experience .stage");
  const xpCard = document.getElementById("xp-card");
  if (xpStage && xpCard) {
    const idEl = document.getElementById("xpc-id");
    const metaEl = document.getElementById("xpc-meta");
    const titleEl = document.getElementById("xpc-title");
    const descEl = document.getElementById("xpc-desc");
    const chips = Array.from(xpStage.querySelectorAll(".pr"));
    let activePr = null;

    const showPr = (btn) => {
      if (activePr === btn) return;
      if (activePr) activePr.classList.remove("active");
      activePr = btn;
      btn.classList.add("active");
      idEl.textContent = btn.textContent;
      metaEl.textContent = btn.dataset.meta;
      titleEl.textContent = btn.dataset.title;
      descEl.textContent = btn.dataset.desc;
      xpCard.hidden = false;
      const max = xpStage.clientHeight - xpCard.offsetHeight;
      const rowTop = btn.closest(".xp-row").offsetTop;
      xpCard.style.top = Math.max(0, Math.min(rowTop, max)) + "px";
    };

    chips.forEach((btn) => {
      btn.addEventListener("mouseenter", () => showPr(btn));
      btn.addEventListener("focus", () => showPr(btn));
      btn.addEventListener("click", () => showPr(btn));
    });

    if (chips.length) showPr(chips[0]);
  }

  /* ---------------- clock (Buenos Aires) ---------------- */
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
  const tick = () => (clockEl.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 30000);

  /* ---------------- mode switching ---------------- */
  function setMode() {
    document.body.dataset.mode = horizontal() ? "horizontal" : "vertical";
    if (!horizontal()) {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      pos = target = 0;
      track.style.transform = "";
    } else {
      measure();
    }
  }

  mqMobile.addEventListener("change", setMode);

  let resizeT = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(measure, 120);
  });

  /* ---------------- boot ---------------- */
  function loaded() {
    document.body.classList.add("loaded");
    if (!mqReduce.matches) {
      // hero glitch flicker once everything is visible
      setTimeout(() => {
        document.querySelectorAll(".hero .glitch").forEach((el) => el.classList.add("play"));
      }, 650);
    }
  }

  setMode();
  measure();

  if (location.hash) {
    const id = location.hash.slice(1);
    // wait a frame so layout is final before the instant jump
    requestAnimationFrame(() => goTo(id, true));
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measure();
      if (location.hash) goTo(location.hash.slice(1), true);
    });
  }

  if (document.readyState === "complete") loaded();
  else window.addEventListener("load", loaded);
})();
