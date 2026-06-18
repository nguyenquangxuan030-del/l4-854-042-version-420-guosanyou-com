(function () {
  function showMessage(wrapper, text) {
    var message = wrapper.querySelector('[data-player-message]');

    if (!message) {
      return;
    }

    message.textContent = text;
    message.classList.add('is-visible');

    window.setTimeout(function () {
      message.classList.remove('is-visible');
    }, 2800);
  }

  function attachHls(video, source) {
    return new Promise(function (resolve, reject) {
      if (!source) {
        reject(new Error('missing-source'));
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', resolve, { once: true });
        video.addEventListener('error', reject, { once: true });
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        video._hlsInstance = hls;
        hls.on(window.Hls.Events.MANIFEST_PARSED, resolve);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            reject(new Error(data.type || 'hls-error'));
          }
        });
        return;
      }

      reject(new Error('hls-not-supported'));
    });
  }

  function setupPlayer(wrapper) {
    var video = wrapper.querySelector('video');
    var button = wrapper.querySelector('[data-play-button]');

    if (!video || !button) {
      return;
    }

    var loading = false;

    function playVideo() {
      var source = video.getAttribute('data-video-src');

      if (loading) {
        return;
      }

      loading = true;
      showMessage(wrapper, '正在加载播放源');

      var ready = video.dataset.loaded === 'true'
        ? Promise.resolve()
        : attachHls(video, source).then(function () {
            video.dataset.loaded = 'true';
          });

      ready.then(function () {
        return video.play();
      }).then(function () {
        wrapper.classList.add('is-playing');
        showMessage(wrapper, '开始播放');
      }).catch(function () {
        wrapper.classList.remove('is-playing');
        showMessage(wrapper, '播放源暂时无法加载');
      }).finally(function () {
        loading = false;
      });
    }

    button.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
    video.addEventListener('play', function () {
      wrapper.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      wrapper.classList.remove('is-playing');
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
