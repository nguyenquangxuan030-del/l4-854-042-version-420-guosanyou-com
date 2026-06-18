(function () {
  function bindStream(video, streamUrl) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return null;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
        hls.loadSource(streamUrl);
      });
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return hls;
    }

    video.src = streamUrl;
    return null;
  }

  window.initMoviePlayer = function (streamUrl) {
    const video = document.getElementById("movie-player");
    const cover = document.getElementById("player-cover");
    if (!video || !cover || !streamUrl) {
      return;
    }

    let started = false;
    let hls = null;

    function start() {
      if (!started) {
        hls = bindStream(video, streamUrl);
        started = true;
      }
      cover.classList.add("is-hidden");
      video.controls = true;
      video.play().catch(function () {
        if (!video.paused) {
          return;
        }
      });
    }

    cover.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (!started) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };
})();
