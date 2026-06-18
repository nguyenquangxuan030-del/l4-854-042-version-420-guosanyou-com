import { H as Hls } from './hls.js';

export function setupPlayer(videoId, coverId, source) {
  const video = document.getElementById(videoId);
  const cover = document.getElementById(coverId);

  if (!video || !source) {
    return;
  }

  let ready = false;

  const load = () => {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  };

  const play = () => {
    load();

    if (cover) {
      cover.classList.add('hidden');
    }

    const started = video.play();

    if (started && typeof started.catch === 'function') {
      started.catch(() => {});
    }
  };

  if (cover) {
    cover.addEventListener('click', play);
  }

  video.addEventListener('click', () => {
    if (!ready) {
      play();
    }
  });

  video.addEventListener('play', () => {
    if (cover) {
      cover.classList.add('hidden');
    }
  });
}
