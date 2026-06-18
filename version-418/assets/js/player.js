import { H as Hls } from "./hls-dru42stk.js";

function initializePlayer(container) {
  var video = container.querySelector("video[data-hls]");
  var button = container.querySelector("[data-player-button]");
  var source = video ? video.getAttribute("data-hls") : "";
  var hls = null;
  var initialized = false;

  if (!video || !source) {
    return;
  }

  function loadSource() {
    if (initialized) {
      return;
    }
    initialized = true;

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          console.warn("HLS fatal error", eventName, data);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else {
      container.classList.add("is-player-unsupported");
      if (button) {
        button.innerHTML = "<strong>当前浏览器不支持 HLS 播放</strong>";
      }
    }
  }

  function playVideo() {
    loadSource();
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        video.controls = true;
      });
    }
  }

  loadSource();

  if (button) {
    button.addEventListener("click", function () {
      button.classList.add("is-hidden");
      playVideo();
    });
  }

  video.addEventListener("play", function () {
    if (button) {
      button.classList.add("is-hidden");
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-player]").forEach(initializePlayer);
});
