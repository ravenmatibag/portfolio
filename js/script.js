/* =========================================================
   Alex Rivera — Portfolio (editorial redesign)
   Vanilla JS: nav, reveal, typing, marquee, project preview, form
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Force light editorial theme regardless of stored value */
  document.documentElement.setAttribute("data-theme", "light");

  /* ==========================================================
     NAVIGATION
  ========================================================== */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  const navLinks = $("#navLinks");

  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 16);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (navLinks) {
    $$(".nav-link", navLinks).forEach((link) => {
      link.addEventListener("click", () => {
        navMenu && navMenu.classList.remove("open");
        navToggle && navToggle.classList.remove("open");
        navToggle && navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Smooth scroll ---------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- Scrollspy ---------- */
  const sections = $$("main section[id]");
  if (sections.length) {
    const linkMap = new Map();
    $$(".nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) linkMap.set(href.slice(1), link);
    });

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $$(".nav-link").forEach((l) => l.classList.remove("active"));
          const active = linkMap.get(entry.target.id);
          if (active) active.classList.add("active");
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ==========================================================
     REVEAL ON SCROLL
  ========================================================== */
  const revealEls = $$(".reveal, .fade-in");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          // Small stagger for sibling reveals
          entry.target.style.transitionDelay = `${Math.min(i * 40, 200)}ms`;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ==========================================================
     TYPING ANIMATION
  ========================================================== */
  const typedEl = $("#typed");
  if (typedEl) {
    const roles = [
      "Computer Engineer",
      "Software Developer",
      "IT Support Specialist",
      "Creative Technologist",
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;

    const tick = () => {
      const current = roles[roleIdx];
      if (!deleting) {
        typedEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          return setTimeout(tick, 1800);
        }
        return setTimeout(tick, 80);
      }
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        return setTimeout(tick, 350);
      }
      setTimeout(tick, 38);
    };
    tick();
  }

  /* ==========================================================
     BACK TO TOP
  ========================================================== */
  const backToTop = $("#backToTop");
  if (backToTop) {
    const toggleBtt = () => {
      if (window.scrollY > 600) {
        backToTop.hidden = false;
        requestAnimationFrame(() => backToTop.classList.add("visible"));
      } else {
        backToTop.classList.remove("visible");
        setTimeout(() => { if (window.scrollY <= 600) backToTop.hidden = true; }, 300);
      }
    };
    toggleBtt();
    window.addEventListener("scroll", toggleBtt, { passive: true });
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ==========================================================
     FLOATING PROJECT PREVIEW (cursor-follow)
  ========================================================== */
  const preview = $("#projectPreview");
  const previewInner = $("#projectPreviewInner");
  const projectRows = $$(".project-row");

  if (
    preview && previewInner && projectRows.length &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf = null;
    let active = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      preview.style.transform =
        `translate(${currentX}px, ${currentY}px) translate(-50%, -50%) scale(${active ? 1 : 0.94})`;
      if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) {
        raf = requestAnimationFrame(render);
      } else {
        raf = null;
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

    projectRows.forEach((row) => {
      row.addEventListener("mouseenter", (e) => {
        const key = row.getAttribute("data-preview");
        previewInner.setAttribute("data-project", key);
        active = true;
        targetX = e.clientX;
        targetY = e.clientY;
        currentX = targetX;
        currentY = targetY;
        preview.classList.add("is-visible");
        schedule();
      });
      row.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (active) schedule();
      });
      row.addEventListener("mouseleave", () => {
        active = false;
        preview.classList.remove("is-visible");
        schedule();
      });
    });
  }

  /* ==========================================================
     SEAMLESS MARQUEE
  ========================================================== */
  function initMarquees() {
    $$(".tech-track").forEach((track) => {
      const container = track.parentElement;
      track.style.animation = "none";
      $$('[aria-hidden="true"]', track).forEach((el) => el.remove());
      const origItems = Array.from(track.children);
      if (!origItems.length) { track.style.animation = ""; return; }

      const origWidth = track.scrollWidth;
      const containerW = container.clientWidth;

      let guard = 0;
      while (track.scrollWidth < containerW * 2.5 && guard < 12) {
        origItems.forEach((item) => {
          const clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          track.appendChild(clone);
        });
        guard++;
      }
      track.style.setProperty("--marquee-w", `-${origWidth}px`);
      track.style.animation = "";
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initMarquees);
  } else {
    window.addEventListener("load", initMarquees);
  }
  window.addEventListener("resize", () => {
    clearTimeout(window.__marqueeT);
    window.__marqueeT = setTimeout(initMarquees, 180);
  });

  /* ==========================================================
     CONTACT FORM VALIDATION
  ========================================================== */
  const form = $("#contactForm");
  const successMsg = $("#formSuccess");

  const showError = (field, msg) => {
    const wrap = field.closest(".field");
    wrap.classList.add("invalid");
    const err = wrap.querySelector(".error");
    if (err) err.textContent = msg;
  };
  const clearError = (field) => {
    const wrap = field.closest(".field");
    wrap.classList.remove("invalid");
    const err = wrap.querySelector(".error");
    if (err) err.textContent = "";
  };

  const validators = {
    name:    (v) => v.trim().length >= 2  || "Please enter your name (2+ characters).",
    email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email address.",
    subject: (v) => v.trim().length >= 3  || "Please add a subject.",
    message: (v) => v.trim().length >= 10 || "Message should be at least 10 characters.",
  };

  const validateField = (field) => {
    const result = validators[field.name] ? validators[field.name](field.value) : true;
    if (result === true) { clearError(field); return true; }
    showError(field, result);
    return false;
  };

  if (form) {
    const fields = $$("input, textarea", form);
    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".field").classList.contains("invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach((f) => { if (!validateField(f)) valid = false; });
      if (!valid) {
        const first = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (first) first.focus();
        return;
      }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          if (successMsg) successMsg.hidden = false;
          form.reset();
          fields.forEach(clearError);
          setTimeout(() => { if (successMsg) successMsg.hidden = true; }, 4000);
        } else {
          alert("Something went wrong — please try again or email me directly.");
        }
      })
      .catch(() => {
        alert("Something went wrong — please try again or email me directly.");
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }
})();
