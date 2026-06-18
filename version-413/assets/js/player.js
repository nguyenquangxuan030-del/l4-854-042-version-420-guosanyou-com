(function () {
    window.initMoviePlayer = function (streamUrl) {
        var video = document.getElementById('moviePlayer');
        var button = document.getElementById('playButton');
        var hls = null;
        var attached = false;

        if (!video || !button || !streamUrl) {
            return;
        }

        function attachStream() {
            if (attached) {
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
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }

                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else {
                video.src = streamUrl;
            }

            attached = true;
        }

        function startPlayback() {
            attachStream();
            button.classList.add('is-hidden');
            video.controls = true;
            var request = video.play();

            if (request && typeof request.catch === 'function') {
                request.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        }

        button.addEventListener('click', startPlayback);

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
