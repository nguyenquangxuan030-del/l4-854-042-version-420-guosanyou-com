(function () {
    var mobileButton = document.querySelector('[data-mobile-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-search-input]');
    var categorySelect = document.querySelector('[data-filter-category]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    if (searchInput && cards.length) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query) {
            searchInput.value = query;
        }

        function applyFilters() {
            var keyword = (searchInput.value || '').trim().toLowerCase();
            var category = categorySelect ? categorySelect.value : '';
            var year = yearSelect ? Number(yearSelect.value || 0) : 0;
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var cardCategory = card.getAttribute('data-category') || '';
                var cardYear = Number(card.getAttribute('data-year') || 0);
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (category && cardCategory !== category) {
                    matched = false;
                }

                if (year && cardYear < year) {
                    matched = false;
                }

                card.classList.toggle('hidden-card', !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        searchInput.addEventListener('input', applyFilters);

        if (categorySelect) {
            categorySelect.addEventListener('change', applyFilters);
        }

        if (yearSelect) {
            yearSelect.addEventListener('change', applyFilters);
        }

        applyFilters();
    }
})();
