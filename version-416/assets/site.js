(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function setHero(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setHero(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        setHero((current + 1) % slides.length);
      }, 5000);
    }
  }

  var toolbar = document.querySelector('[data-filter-toolbar]');
  var container = document.querySelector('[data-card-container]');

  if (toolbar && container) {
    var searchInput = toolbar.querySelector('[data-card-search]');
    var sortSelect = toolbar.querySelector('[data-card-sort]');
    var viewButtons = Array.prototype.slice.call(toolbar.querySelectorAll('[data-view]'));
    var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));

    function textOf(card) {
      return [
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        card.hidden = query && textOf(card).indexOf(query) === -1;
      });
    }

    function applySort() {
      var mode = sortSelect ? sortSelect.value : 'default';
      var sorted = cards.slice();
      if (mode === 'views') {
        sorted.sort(function (a, b) {
          return Number(b.dataset.views) - Number(a.dataset.views);
        });
      } else if (mode === 'rating') {
        sorted.sort(function (a, b) {
          return Number(b.dataset.rating) - Number(a.dataset.rating);
        });
      } else if (mode === 'year') {
        sorted.sort(function (a, b) {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        });
      } else {
        sorted.sort(function (a, b) {
          return cards.indexOf(a) - cards.indexOf(b);
        });
      }
      sorted.forEach(function (card) {
        container.appendChild(card);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        applySort();
        applyFilter();
      });
    }

    viewButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        viewButtons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        container.classList.toggle('is-list', button.dataset.view === 'list');
      });
    });
  }
})();
