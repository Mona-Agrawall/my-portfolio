/* Mona Agrawal — portfolio interactions.
   Everything here is progressive: the page reads fine without it. */
(function () {
  "use strict";

  window.monaMain = true;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- Page-load sequence: wait briefly for fonts so lines reveal once ---- */
  function ready() {
    requestAnimationFrame(function () {
      root.classList.add("is-ready");
    });
  }

  if (document.fonts && document.fonts.ready) {
    Promise.race([
      document.fonts.ready,
      new Promise(function (resolve) { setTimeout(resolve, 600); })
    ]).then(ready);
  } else {
    ready();
  }

  /* ---- Scroll reveals (once per element) ---- */
  var revealables = document.querySelectorAll("[data-reveal]");

  // Stagger siblings that reveal together, e.g. rows in a list.
  revealables.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.hasAttribute("data-reveal");
    });
    var index = siblings.indexOf(el);
    if (siblings.length > 2 && index > 0) el.style.setProperty("--i", String(index % 6));
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Smooth scrolling (desktop, motion allowed) ---- */
  var lenis = null;
  if (!reduceMotion && finePointer && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    var raf = function (time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // In-page anchors: smooth scroll, then move focus for keyboard and screen-reader users.
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -96, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
    if (target.tabIndex < 0 && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
      target.setAttribute("tabindex", "-1");
    }
    target.focus({ preventScroll: true });
    history.replaceState(null, "", "#" + id);
  });

  /* ---- Copy email ---- */
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    if (!navigator.clipboard || !window.isSecureContext) return;
    button.hidden = false;
    var label = button.querySelector("[data-copy-label]");
    var timer;
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(button.getAttribute("data-copy")).then(function () {
        button.classList.add("is-done");
        label.textContent = "Copied";
        clearTimeout(timer);
        timer = setTimeout(function () {
          button.classList.remove("is-done");
          label.textContent = "Copy";
        }, 2000);
      });
    });
    label.setAttribute("aria-live", "polite");
  });

  /* ---- Contact form: Netlify Forms, submitted with fetch so the page stays put.
     Without JS the form still posts natively and uses browser validation. ---- */
  var form = document.querySelector("[data-contact]");
  if (form) {
    var messages = {
      name: { valueMissing: "Please enter your name." },
      email: {
        valueMissing: "Please enter your email address.",
        typeMismatch: "That email address doesn’t look right."
      },
      message: {
        valueMissing: "Please write a message.",
        tooShort: "A little more detail, please (10 characters or more)."
      }
    };
    var fields = Array.prototype.slice.call(form.querySelectorAll(".field__input"));
    var submit = form.querySelector("[data-submit]");
    var submitLabel = form.querySelector("[data-submit-label]");
    var status = form.querySelector("[data-form-status]");
    var success = document.querySelector("[data-form-success]");

    form.noValidate = true;

    // Checked by hand: whitespace-only input should fail, and validity.tooShort
    // only reports after user edits in some browsers.
    var check = function (input) {
      var set = messages[input.name];
      var value = input.value.trim();
      var text = "";
      if (!value) {
        text = set.valueMissing;
      } else if (input.validity.typeMismatch) {
        text = set.typeMismatch;
      } else if (value.length < input.minLength) {
        text = set.tooShort;
      }
      document.getElementById(input.getAttribute("aria-describedby")).textContent = text;
      if (text) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
      return !text;
    };

    fields.forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.value) check(input);
      });
      input.addEventListener("input", function () {
        if (input.hasAttribute("aria-invalid")) check(input);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var invalid = fields.filter(function (input) { return !check(input); });
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      submit.disabled = true;
      submitLabel.textContent = "Sending…";
      status.textContent = "";

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        form.reset();
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }).catch(function () {
        status.textContent = "Sorry, your message didn’t send. Please email me at mona.mk.agrawal@gmail.com instead.";
      }).then(function () {
        submit.disabled = false;
        submitLabel.textContent = "Send message";
      });
    });
  }

  /* ---- Cursor label over project rows (fine pointers only) ---- */
  var cursor = document.querySelector(".cursor");
  var targets = document.querySelectorAll("[data-cursor]");
  if (cursor && targets.length && finePointer && !reduceMotion) {
    var x = 0, y = 0, cx = 0, cy = 0, running = false;
    var loop = function () {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = "translate3d(" + (cx + 14) + "px," + (cy + 14) + "px,0)";
      if (Math.abs(x - cx) > 0.1 || Math.abs(y - cy) > 0.1) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };
    window.addEventListener("pointermove", function (event) {
      x = event.clientX;
      y = event.clientY;
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    }, { passive: true });
    targets.forEach(function (el) {
      el.addEventListener("pointerenter", function () {
        cursor.textContent = el.getAttribute("data-cursor");
        cursor.classList.add("is-on");
      });
      el.addEventListener("pointerleave", function () {
        cursor.classList.remove("is-on");
      });
    });
  }

  /* ---- Footer: year and local time in Chennai ---- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var clock = document.querySelector("[data-clock]");
  if (clock && window.Intl) {
    var time = clock.querySelector("time");
    var format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    var tick = function () { time.textContent = format.format(new Date()); };
    tick();
    clock.hidden = false;
    setInterval(tick, 30000);
  }
})();
