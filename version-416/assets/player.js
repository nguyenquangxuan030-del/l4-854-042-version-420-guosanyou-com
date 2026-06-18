import { H as Hls } from './hls.js';

(function () {
  var video = document.getElementById('movie-player');
  var startButton = document.querySelector('[data-player-start]');

  if (!video || !startButton) {
    return;
  }

  var source = video.dataset.videoSrc;
  var hasStarted = false;
  var hlsInstance = null;

  function showMessage(text) {
    var oldMessage = document.querySelector('.player-message');
    if (oldMessage) {
      oldMessage.remove();
    }
    var message = document.createElement('div');
    message.className = 'player-message';
    message.textContent = text;
    video.parentElement.appendChild(message);
  }

  function playVideo() {
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  function startPlayer() {
    if (!source || hasStarted) {
      playVideo();
      return;
    }

    hasStarted = true;
    startButton.classList.add('is-hidden');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', playVideo, { once: true });
      video.load();
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, playVideo);
      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showMessage('当前视频加载失败，请稍后重试。');
        }
      });
      return;
    }

    showMessage('当前浏览器暂时无法播放此视频。');
  }

  startButton.addEventListener('click', startPlayer);
  video.addEventListener('click', startPlayer, { once: true });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
