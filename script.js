/* =========================================================
   TPS+i — Interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav: shrink on scroll + progress bar + floating CTA ---- */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");
  var floatingCta = document.getElementById("floatingCta");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 30);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (floatingCta) floatingCta.classList.toggle("show", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  function closeMenu() {
    if (toggle) {
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    if (links) links.classList.remove("open");
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Reveal on scroll + stagger siblings ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    // stagger items inside common grids
    document
      .querySelectorAll(".pain-grid,.pillars,.cards3,.plans,.steps,.ihops,.acc")
      .forEach(function (group) {
        var i = 0;
        group.querySelectorAll(".reveal").forEach(function (el) {
          if (i > 0 && i <= 4) el.classList.add("d" + i);
          i++;
        });
      });
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll(".count");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var dur = 1400;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) {
      cio.observe(c);
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".acc__item").forEach(function (item) {
    var q = item.querySelector(".acc__q");
    var a = item.querySelector(".acc__a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close others
      document.querySelectorAll(".acc__item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".acc__a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---- Contact form (mailto fallback, no backend) ---- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var company = form.company.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!name || !email) {
        note.textContent = "お名前とメールアドレスをご入力ください。";
        note.className = "form__note err";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.textContent = "メールアドレスの形式をご確認ください。";
        note.className = "form__note err";
        return;
      }

      var subject = encodeURIComponent("【無料簡易診断のお申し込み】" + (company || name));
      var body = encodeURIComponent(
        "お名前: " + name + "\n" +
        "会社名: " + company + "\n" +
        "メール: " + email + "\n\n" +
        "ご相談内容:\n" + message + "\n"
      );
      note.textContent = "メールソフトを起動します。送信ボタンで完了です。";
      note.className = "form__note ok";
      window.location.href =
        "mailto:saito@kip-consulting.com?subject=" + subject + "&body=" + body;
    });
  }
})();
