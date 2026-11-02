import ButtonAnchor from '@unctad-infovis/general-tools/components/ButtonAnchor.jsx';
import ButtonShare from '@unctad-infovis/general-tools/components/ButtonShare.jsx';
import { resolveAsset } from '@unctad-infovis/general-tools/helpers/BasePath.js';

import './Header.css';

function Header({ bg_image_url, chapters, full_report_url, has_press, has_videos, overview_image_url, overview_title, overview_url, subtitle, title, year }) {
  const scrollTo = selector => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.appRef.current.querySelector(selector)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  };
  const overviewTitle = overview_title || subtitle;
  return (
    <div className="container_header_wrapper" style={bg_image_url ? { backgroundImage: `url(${resolveAsset(bg_image_url)})` } : undefined}>
      <div className="container_header">
        <div className="header_top">
          <h2>
            <div className="name">{title}</div>
            <div className="year">{year}</div>
          </h2>
        </div>
        <div className="header_bottom">
          <h3>
            <div>{subtitle}</div>
            <ButtonShare url={window.location.href} defaultOpen position="static" iconBg="rgba(0,0,0,0.45)" iconColor="#fff" size={36} />
          </h3>
          <div className="download_buttons_container">
            {full_report_url && <ButtonAnchor className="full_report" url={full_report_url} text="Full report" />}
            {has_videos && <ButtonAnchor url={'.anchor_videos'} text="Videos" />}
            {has_press && <ButtonAnchor url={'.anchor_press'} text="Press" />}
          </div>
          <div className="container_chapters_navigation">
            <div className="chapter_card overview_card">
              <a className="chapter_card_action" href={overview_url} target="_blank" rel="noreferrer" aria-label={`Open Overview PDF: ${overviewTitle}`} />
              <div className="chapter_navigation">
                <div className="chapter_title">
                  <h3>{overviewTitle}</h3>
                </div>
                <div className="chapter_image">
                  <div style={overview_image_url ? { backgroundImage: `url(${resolveAsset(overview_image_url)})` } : undefined} />
                </div>
                <div className="chapter_meta">
                  <div className="chapter_label">OVERVIEW</div>
                  <a href={overview_url} target="_blank" className="chapter_download_button" aria-label="Download Overview" rel="noreferrer">
                    Download Overview
                  </a>
                </div>
              </div>
            </div>
            {chapters.map((chapter, i) => (
              <div className="chapter_card" key={chapter.title}>
                <button className="chapter_card_action" onClick={() => scrollTo(`.container_chapter_${i + 1}`)} type="button" aria-label={`Go to chapter ${i + 1}: ${chapter.title}`} />
                <div className={`chapter_navigation chapter_navigation_${i + 1}`}>
                  <div className="chapter_title">
                    <h3>{chapter.title}</h3>
                  </div>
                  <div className="chapter_image">
                    <div style={chapter.card_image_url ? { backgroundImage: `url(${resolveAsset(chapter.card_image_url)})` } : undefined} />
                  </div>
                  <div className="chapter_meta">
                    <div className="chapter_label">CHAPTER {i + 1}</div>
                    {chapter.pdf_url && (
                      <a href={chapter.pdf_url} target="_blank" className="chapter_download_button" aria-label={`Download chapter ${i + 1}`} rel="noreferrer">
                        Download chapter {i + 1}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
