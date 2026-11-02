import ButtonAnchor from '@unctad-infovis/general-tools/components/ButtonAnchor.jsx';
import Image from '@unctad-infovis/general-tools/components/Image.jsx';

import './HeaderChapter.css';

function HeaderChapter({ chapter_number, pdf_url, image_url, subtitle, title }) {
  const subtitleIndex = subtitle ? (title?.toLowerCase().indexOf(subtitle.toLowerCase()) ?? -1) : -1;
  const showSubtitle = subtitle && subtitleIndex === -1;
  return (
    <div className="container_chapter_header">
      <div>
        <h3>
          {subtitleIndex > 0 ? (
            <>
              {title.slice(0, subtitleIndex).trim()}
              <br />
              {title.slice(subtitleIndex)}
            </>
          ) : (
            title
          )}
        </h3>
        {showSubtitle && <h4>{subtitle}</h4>}
      </div>
      {pdf_url && <ButtonAnchor className="chapter_download" text={`Download chapter ${chapter_number}`} url={pdf_url} />}
      {image_url && (
        <div className="hidden">
          <Image alt={title} image_url={image_url} parallax={false} />
        </div>
      )}
    </div>
  );
}

export default HeaderChapter;
