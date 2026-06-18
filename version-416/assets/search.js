(function () {
  var movies = window.MOVIES || [];
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  var summary = document.querySelector('[data-search-summary]');

  if (!form || !input || !results || !summary) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (item) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[item];
    });
  }

  function formatViews(value) {
    var number = Number(value || 0);
    if (number >= 10000) {
      return (number / 10000).toFixed(1) + '万';
    }
    return String(number);
  }

  function card(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="card-link" href="movie/' + movie.filename + '">',
      '    <div class="poster-wrap">',
      '      <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '      <span class="card-badge">' + escapeHtml(movie.category) + '</span>',
      '      <span class="play-hover">▶</span>',
      '    </div>',
      '    <div class="card-body">',
      '      <h3>' + escapeHtml(movie.title) + '</h3>',
      '      <p>' + escapeHtml(movie.one_line) + '</p>',
      '      <div class="card-meta">',
      '        <span>' + escapeHtml(movie.year) + '</span>',
      '        <span>' + escapeHtml(movie.region) + '</span>',
      '        <span>★ ' + escapeHtml(movie.rating) + '</span>',
      '        <span>' + formatViews(movie.views) + '</span>',
      '      </div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function runSearch(query) {
    var normalized = query.trim().toLowerCase();
    if (!normalized) {
      results.innerHTML = '';
      summary.textContent = '请输入关键词开始搜索。';
      return;
    }

    var matched = movies.filter(function (movie) {
      return [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.category,
        movie.tags,
        movie.one_line
      ].join(' ').toLowerCase().indexOf(normalized) !== -1;
    });

    summary.textContent = '为“' + query + '”找到 ' + matched.length + ' 部内容。';
    results.innerHTML = matched.slice(0, 240).map(card).join('');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var query = input.value.trim();
    var url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
    runSearch(query);
  });

  runSearch(initial);
})();
