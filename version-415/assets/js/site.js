(function() {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function() {
        panel.classList.toggle('open');
      });
    }

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
      var index = 0;
      var show = function(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle('active', i === index);
        });
      };
      dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
          show(i);
        });
      });
      window.setInterval(function() {
        show(index + 1);
      }, 6500);
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterYear = document.querySelector('[data-filter-year]');
    var filterCategory = document.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var runFilter = function() {
      var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
      var year = filterYear ? filterYear.value : '';
      var category = filterCategory ? filterCategory.value : '';
      cards.forEach(function(card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        var okQuery = !query || text.indexOf(query) !== -1;
        var okYear = !year || card.getAttribute('data-year') === year;
        var okCategory = !category || card.getAttribute('data-category') === category;
        card.style.display = okQuery && okYear && okCategory ? '' : 'none';
      });
    };
    [filterInput, filterYear, filterCategory].forEach(function(node) {
      if (node) {
        node.addEventListener('input', runFilter);
        node.addEventListener('change', runFilter);
      }
    });

    var searchForm = document.querySelector('[data-search-form]');
    var searchInput = document.querySelector('[data-search-input]');
    var searchResults = document.querySelector('[data-search-results]');
    if (searchForm && searchInput && searchResults && window.SEARCH_INDEX) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';
      searchInput.value = initial;
      var render = function(value) {
        var query = value.trim().toLowerCase();
        if (!query) {
          searchResults.innerHTML = '';
          return;
        }
        var matches = window.SEARCH_INDEX.filter(function(item) {
          return item.text.indexOf(query) !== -1;
        }).slice(0, 60);
        searchResults.innerHTML = matches.map(function(item) {
          return [
            '<a class="search-result-card" href="' + item.url + '">',
            '<img src="' + item.cover + '" alt="' + item.title + '">',
            '<span>',
            '<h2>' + item.title + '</h2>',
            '<p>' + item.meta + '</p>',
            '<p>' + item.desc + '</p>',
            '</span>',
            '</a>'
          ].join('');
        }).join('');
      };
      searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        render(searchInput.value);
      });
      searchInput.addEventListener('input', function() {
        render(searchInput.value);
      });
      render(initial);
    }
  });
})();
