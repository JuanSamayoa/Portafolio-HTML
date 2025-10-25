// Header behaviors: mobile menu, smooth scroll, active link highlighting, theme toggle
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenuButton?.addEventListener("click", function () {
    mobileMenu?.classList.toggle("hidden");
  });

  // Theme toggle (simple, stores preference in localStorage)
  (function () {
    const btn = document.getElementById("themeToggle");
    const root = document.documentElement;
    function setDark(d) {
      if (d) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.removeItem("theme");
      }
    }
    try {
      const saved = localStorage.getItem("theme");
      if (
        saved === "dark" ||
        (!saved &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        setDark(true);
      }
    } catch (e) {
      // ignore
    }
    btn?.addEventListener("click", function () {
      const isDark = root.classList.contains("dark");
      setDark(!isDark);
    });
  })();

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      const mobileMenuEl = document.getElementById("mobile-menu");
      if (mobileMenuEl && !mobileMenuEl.classList.contains("hidden")) {
        mobileMenuEl.classList.add("hidden");
      }

      var targetId = anchor.getAttribute("href");
      var targetElement = targetId ? document.querySelector(targetId) : null;
      if (targetElement) {
        var header = document.querySelector("header");
        var headerHeight = header ? header.offsetHeight : 0;
        var elementPosition = targetElement.getBoundingClientRect().top;
        var offsetPosition =
          elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        try {
          history.pushState(null, "", targetId);
        } catch (e) {}

        document.querySelectorAll(".nav-link").forEach(function (link) {
          link.classList.remove("active");
        });
        anchor.classList.add("active");
      }
    });
  });

  // Highlight nav link on scroll
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");
  function highlightNavLink() {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute("id");
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }
  window.addEventListener("scroll", highlightNavLink);
  highlightNavLink();
});
