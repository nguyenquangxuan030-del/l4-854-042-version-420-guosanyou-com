(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll(".js-player-video"));
        players.forEach(function (video) {
            var shell = video.closest(".player-shell");
            var cover = shell ? shell.querySelector(".js-player-cover") : null;
            var hls = null;
            var stream = video.getAttribute("data-stream");

            function load(playNow) {
                if (!stream) {
                    return;
                }
                if (video.getAttribute("data-ready") === "1") {
                    if (playNow) {
                        video.play().catch(function () {});
                    }
                    return;
                }
                video.setAttribute("data-ready", "1");
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    if (playNow) {
                        video.play().catch(function () {});
                    }
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
                        hls.loadSource(stream);
                    });
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        if (playNow) {
                            video.play().catch(function () {});
                        }
                    });
                }
            }

            function start() {
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                load(true);
            }

            if (cover) {
                cover.addEventListener("click", start);
            }
            video.addEventListener("play", function () {
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                load(false);
            });
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    });
}());
