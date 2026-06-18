(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function initNavigation() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const links = document.querySelector("[data-nav-links]");
    if (!toggle || !links) {
      return;
    }
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
  }

  function initHero() {
    const root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(root.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    let current = 0;
    let timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        restart();
      });
    });

    root.addEventListener("mouseenter", function () {
      if (timer) {
        window.clearInterval(timer);
      }
    });

    root.addEventListener("mouseleave", restart);
    start();
  }

  function initFilters() {
    const scopes = Array.from(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      const input = scope.querySelector("[data-search-input]");
      const chips = Array.from(scope.querySelectorAll("[data-filter-chip]"));
      const cards = Array.from(scope.querySelectorAll("[data-card]"));
      const empty = scope.querySelector("[data-no-result]");
      let chipValue = "";

      function apply() {
        const query = input ? input.value.trim().toLowerCase() : "";
        let visible = 0;
        cards.forEach(function (card) {
          const text = (card.getAttribute("data-text") || "").toLowerCase();
          const matchedQuery = !query || text.indexOf(query) !== -1;
          const matchedChip = !chipValue || text.indexOf(chipValue.toLowerCase()) !== -1;
          const shown = matchedQuery && matchedChip;
          card.hidden = !shown;
          if (shown) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (item) {
            item.classList.remove("is-active");
          });
          chip.classList.add("is-active");
          chipValue = chip.getAttribute("data-filter-chip") || "";
          apply();
        });
      });
    });
  }

  ready(function () {
    initNavigation();
    initHero();
    initFilters();
  });
})();
