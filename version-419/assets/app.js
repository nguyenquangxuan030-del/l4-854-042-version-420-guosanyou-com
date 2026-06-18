(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5000);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilterPanel(panel) {
    var root = panel.closest('section') || document;
    var list = root.querySelector('[data-filter-list]') || document;
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
    var keywordInput = panel.querySelector('[data-filter-keyword]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var visibleCount = root.querySelector('[data-visible-count]');

    if (yearSelect && yearSelect.options.length === 1) {
      Array.from(new Set(cards.map(function (card) {
        return card.getAttribute('data-year') || '';
      }).filter(Boolean))).sort().reverse().forEach(function (year) {
        var option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }

    if (typeSelect && typeSelect.options.length === 1) {
      Array.from(new Set(cards.map(function (card) {
        return card.getAttribute('data-type') || '';
      }).filter(Boolean))).sort().forEach(function (type) {
        var option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
      });
    }

    function applyFilter() {
      var keyword = normalize(keywordInput ? keywordInput.value : '');
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var count = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (year && card.getAttribute('data-year') !== year) {
          matched = false;
        }

        if (type && card.getAttribute('data-type') !== type) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          count += 1;
        }
      });

      if (visibleCount) {
        visibleCount.textContent = String(count);
      }
    }

    [keywordInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]')).forEach(setupFilterPanel);

  function renderSearchPage() {
    var results = document.querySelector('[data-search-results]');
    var input = document.querySelector('[data-search-input]');
    var status = document.querySelector('[data-search-status]');

    if (!results || !input || !window.MOVIE_SEARCH_INDEX) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    input.value = query;

    function cardTemplate(movie) {
      return [
        '<article class="movie-card">',
        '  <a class="movie-card__poster" href="' + movie.url + '">',
        '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="movie-card__play">▶</span>',
        '    <span class="movie-card__badge">' + escapeHtml(movie.category) + '</span>',
        '  </a>',
        '  <div class="movie-card__body">',
        '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
        '    <p class="movie-card__desc">' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="movie-card__meta">',
        '      <span>' + escapeHtml(movie.year) + '</span>',
        '      <span>' + escapeHtml(movie.region) + '</span>',
        '      <span>' + escapeHtml(movie.type) + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function applySearch() {
      var keyword = normalize(input.value);

      if (!keyword) {
        results.innerHTML = '';
        status.textContent = '请输入关键词开始搜索';
        return;
      }

      var matched = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
        return normalize(movie.keywords).indexOf(keyword) !== -1;
      }).slice(0, 120);

      results.innerHTML = matched.map(cardTemplate).join('');
      status.textContent = matched.length ? '找到 ' + matched.length + ' 条相关内容' : '没有找到相关内容';
    }

    input.addEventListener('input', applySearch);
    applySearch();
  }

  renderSearchPage();
})();
