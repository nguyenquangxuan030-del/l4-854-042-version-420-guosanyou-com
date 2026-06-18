(function () {
    'use strict';

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHeroSlider() {
        var sliders = document.querySelectorAll('[data-hero-slider]');
        sliders.forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
            var buttons = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-to]'));
            if (slides.length < 2) {
                return;
            }
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === current);
                });
                buttons.forEach(function (item, buttonIndex) {
                    item.classList.toggle('is-active', buttonIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var index = parseInt(button.getAttribute('data-slide-to'), 10);
                    show(index);
                    start();
                });
            });

            slider.addEventListener('mouseenter', stop);
            slider.addEventListener('mouseleave', start);
            start();
        });
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupFilters() {
        var scopes = document.querySelectorAll('[data-filter-scope]');
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-input]');
            var yearFilter = scope.querySelector('[data-year-filter]');
            var categoryFilter = scope.querySelector('[data-category-filter]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
            var empty = scope.querySelector('[data-empty-state]');
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get('q') || '';

            if (input && initialQuery) {
                input.value = initialQuery;
            }

            function apply() {
                var query = input ? normalize(input.value) : '';
                var year = yearFilter ? normalize(yearFilter.value) : '';
                var category = categoryFilter ? normalize(categoryFilter.value) : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute('data-search-text'));
                    var cardYear = normalize(card.getAttribute('data-year'));
                    var cardCategory = normalize(card.getAttribute('data-category'));
                    var matched = true;

                    if (query && haystack.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (year && cardYear !== year) {
                        matched = false;
                    }
                    if (category && cardCategory !== category) {
                        matched = false;
                    }

                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }
            if (yearFilter) {
                yearFilter.addEventListener('change', apply);
            }
            if (categoryFilter) {
                categoryFilter.addEventListener('change', apply);
            }
            apply();
        });
    }

    function setupPlayers() {
        var players = document.querySelectorAll('[data-player]');
        players.forEach(function (player) {
            var video = player.querySelector('video');
            var overlay = player.querySelector('[data-player-overlay]');
            var playButton = player.querySelector('[data-play-button]');
            var streamUrl = player.getAttribute('data-src');
            var hls = null;
            var loaded = false;

            if (!video || !overlay || !playButton || !streamUrl) {
                return;
            }

            function attachStream() {
                if (loaded) {
                    return;
                }
                loaded = true;

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = streamUrl;
                    video.load();
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    return;
                }

                video.src = streamUrl;
                video.load();
            }

            function play(event) {
                if (event) {
                    event.preventDefault();
                }
                attachStream();
                overlay.classList.add('is-hidden');
                var request = video.play();
                if (request && typeof request.catch === 'function') {
                    request.catch(function () {
                        overlay.classList.remove('is-hidden');
                    });
                }
            }

            playButton.addEventListener('click', play);
            overlay.addEventListener('click', play);
            video.addEventListener('play', function () {
                overlay.classList.add('is-hidden');
            });
            video.addEventListener('ended', function () {
                overlay.classList.remove('is-hidden');
            });
            window.addEventListener('beforeunload', function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHeroSlider();
        setupFilters();
        setupPlayers();
    });
})();
