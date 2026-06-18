(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function createCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return "" +
            "<article class=\"movie-card\">" +
                "<a href=\"./" + escapeHtml(movie.file) + "\" class=\"movie-card-link\">" +
                    "<div class=\"poster-frame\">" +
                        "<img src=\"./" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
                        "<span class=\"poster-badge\">" + escapeHtml(movie.category) + "</span>" +
                        "<span class=\"poster-play\">▶</span>" +
                    "</div>" +
                    "<div class=\"movie-card-body\">" +
                        "<h3>" + escapeHtml(movie.title) + "</h3>" +
                        "<p>" + escapeHtml(movie.oneLine || "") + "</p>" +
                        "<div class=\"movie-meta\">" +
                            "<span>" + escapeHtml(movie.year || "") + "</span>" +
                            "<span>" + escapeHtml(movie.region || "") + "</span>" +
                            "<span>" + escapeHtml(movie.rating || "") + "分</span>" +
                        "</div>" +
                        "<div class=\"tag-row\">" + tags + "</div>" +
                    "</div>" +
                "</a>" +
            "</article>";
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    ready(function () {
        var menuToggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (menuToggle && nav) {
            menuToggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;
            var show = function (index) {
                current = index;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
                });
            };
            var start = function () {
                if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    timer = window.setInterval(function () {
                        show((current + 1) % slides.length);
                    }, 5200);
                }
            };
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    if (timer) {
                        window.clearInterval(timer);
                    }
                    show(index);
                    start();
                });
            });
            start();
        }

        var filterInput = document.getElementById("page-filter");
        var yearFilter = document.getElementById("year-filter");
        var filterList = document.querySelector("[data-filter-list]");
        var emptyState = document.querySelector("[data-empty-state]");
        if (filterList && (filterInput || yearFilter)) {
            var cards = Array.prototype.slice.call(filterList.querySelectorAll("[data-card]"));
            var filterCards = function () {
                var term = normalize(filterInput ? filterInput.value : "");
                var year = yearFilter ? yearFilter.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute("data-search"));
                    var cardYear = card.getAttribute("data-year") || "";
                    var ok = (!term || text.indexOf(term) >= 0) && (!year || cardYear === year);
                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        visible += 1;
                    }
                });
                if (emptyState) {
                    emptyState.classList.toggle("is-visible", visible === 0);
                }
            };
            if (filterInput) {
                filterInput.addEventListener("input", filterCards);
            }
            if (yearFilter) {
                yearFilter.addEventListener("change", filterCards);
            }
        }

        var globalSearch = document.getElementById("global-search");
        var globalCategory = document.getElementById("global-category");
        var globalYear = document.getElementById("global-year");
        var globalResults = document.getElementById("global-results");
        var summary = document.querySelector("[data-search-summary]");
        if (globalSearch && globalResults && typeof MOVIE_INDEX !== "undefined") {
            var params = new URLSearchParams(window.location.search);
            var initial = params.get("q") || "";
            globalSearch.value = initial;
            var render = function () {
                var term = normalize(globalSearch.value);
                var category = globalCategory ? globalCategory.value : "";
                var year = globalYear ? globalYear.value : "";
                var results = MOVIE_INDEX.filter(function (movie) {
                    var text = normalize([movie.title, movie.region, movie.type, movie.genre, movie.category, (movie.tags || []).join(" ")].join(" "));
                    return (!term || text.indexOf(term) >= 0) && (!category || movie.category === category) && (!year || String(movie.year).indexOf(year) >= 0);
                }).slice(0, 120);
                globalResults.innerHTML = results.map(createCard).join("");
                if (summary) {
                    summary.textContent = results.length ? "已显示匹配影片" : "未找到匹配内容";
                }
            };
            globalSearch.addEventListener("input", render);
            if (globalCategory) {
                globalCategory.addEventListener("change", render);
            }
            if (globalYear) {
                globalYear.addEventListener("input", render);
            }
            render();
        }
    });
}());
