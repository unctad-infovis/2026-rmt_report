import { resolveAsset } from '@unctad-infovis/general-tools/helpers/BasePath.js';
import { useEffect, useRef, useState } from 'react';
import './IntroVideo.css';

export default function IntroVideo({ url, title, poster_url, languages = [] }) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    if (playing || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [playing]);
  const links = languages.filter(link => link.label && link.url);
  const playerUrl = new URL(url);
  playerUrl.searchParams.set('autoplay', '1');
  playerUrl.searchParams.set('muted', '1');
  playerUrl.searchParams.set('playsinline', '1');
  return (
    <div className="intro_video_panel">
      <div className="intro_video_frame" ref={frameRef}>
        {playing ? (
          <iframe src={playerUrl.toString()} title={title || 'Review of Maritime Transport 2026 video'} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        ) : (
          <button className="intro_video_play" type="button" aria-label="Play Review of Maritime Transport 2026 video" onClick={() => setPlaying(true)}>
            <img src={resolveAsset(poster_url)} alt="" width="2000" height="1045" />
            <span className="intro_video_play_icon" aria-hidden="true">
              ▶
            </span>
          </button>
        )}
      </div>
      {links.length > 0 && (
        <p className="intro_video_languages">
          Also in{' '}
          {links.map((link, index) => (
            <span key={link.label}>
              {index > 0 && ' · '}
              <a href={link.url} lang={link.lang} dir={link.dir} target="_blank" rel="noreferrer">
                <bdi>{link.label}</bdi>
              </a>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
