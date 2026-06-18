(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = document.querySelector("[data-mobile-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }

    var current = 0;
    var timer = null;

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
      }, 5000);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(index);
        start();
      });
    });

    show(0);
    start();
  }

  function filterList(input) {
    var targetId = input.getAttribute("data-filter-target");
    var list = document.getElementById(targetId);
    if (!list) {
      return;
    }

    var keyword = normalize(input.value);
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    var visibleCount = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-year"),
        card.getAttribute("data-category"),
        card.getAttribute("data-tags")
      ].join(" "));
      var visible = !keyword || haystack.indexOf(keyword) !== -1;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    var emptyState = document.querySelector("[data-empty-state]");
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  function setupFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".filter-input"));
    inputs.forEach(function (input) {
      var queryKey = input.getAttribute("data-read-query");
      if (queryKey) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get(queryKey);
        if (query) {
          input.value = query;
        }
      }
      input.addEventListener("input", function () {
        filterList(input);
      });
      filterList(input);
    });
  }

  function setupSorting() {
    var selects = Array.prototype.slice.call(document.querySelectorAll(".sort-select"));
    selects.forEach(function (select) {
      select.addEventListener("change", function () {
        var targetId = select.getAttribute("data-sort-target");
        var list = document.getElementById(targetId);
        if (!list) {
          return;
        }

        var mode = select.value;
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
        cards.sort(function (a, b) {
          if (mode === "views") {
            return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
          }
          if (mode === "rating") {
            return Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0);
          }
          if (mode === "year") {
            return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
          }
          if (mode === "title") {
            return (a.dataset.title || "").localeCompare(b.dataset.title || "", "zh-Hans-CN");
          }
          return 0;
        });
        cards.forEach(function (card) {
          list.appendChild(card);
        });
      });
    });
  }

  function setupViewButtons() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-view]"));
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var targetId = button.getAttribute("data-view-target");
        var list = document.getElementById(targetId);
        if (!list) {
          return;
        }

        var group = Array.prototype.slice.call(button.parentElement.querySelectorAll("[data-view]"));
        group.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });

        list.classList.toggle("is-list-view", button.getAttribute("data-view") === "list");
      });
    });
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
    setupSorting();
    setupViewButtons();
  });
})();
