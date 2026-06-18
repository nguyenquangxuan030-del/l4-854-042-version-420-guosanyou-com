(function () {
  function initMoviePlayer(options) {
    if (!options) {
      return;
    }
    var video = document.getElementById(options.videoId);
    var trigger = document.getElementById(options.triggerId);
    var source = options.source;
    if (!video || !source) {
      return;
    }
    var loaded = false;
    var hls = null;

    function loadSource() {
      if (loaded) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
      loaded = true;
    }

    function hideTrigger() {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    }

    function showTrigger() {
      if (trigger && video.paused) {
        trigger.classList.remove("is-hidden");
      }
    }

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      loadSource();
      video.controls = true;
      hideTrigger();
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          showTrigger();
        });
      }
    }

    if (trigger) {
      trigger.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        start();
      }
    });
    video.addEventListener("play", hideTrigger);
    video.addEventListener("pause", showTrigger);
    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
