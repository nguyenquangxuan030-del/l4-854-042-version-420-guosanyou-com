(function() {
  function initPlayer(root) {
    var video = root.querySelector('video');
    var button = root.querySelector('[data-play-button]');
    var stream = root.getAttribute('data-stream');
    var started = false;

    function attach() {
      if (started || !video || !stream) {
        return;
      }
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        root._hls = hls;
      } else {
        video.src = stream;
      }
    }

    function play() {
      attach();
      root.classList.add('playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function() {
          root.classList.remove('playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('play', function() {
      root.classList.add('playing');
    });

    video.addEventListener('pause', function() {
      if (!video.ended) {
        root.classList.add('playing');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
  });
})();
