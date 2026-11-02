import { resolveAsset } from '@unctad-infovis/general-tools/helpers/BasePath.js';
import './ReportCard.css';

export default function ReportCard({ cover_url, report_url }) {
  return (
    <section className="report_card" aria-labelledby="report_card_title">
      {cover_url && <img className="report_card_cover" src={resolveAsset(cover_url)} alt="Cover of the Review of Maritime Transport 2026" width="540" height="764" loading="lazy" />}
      <div className="report_card_content">
        <div className="report_card_label">FULL REPORT</div>
        <h3 id="report_card_title">Review of Maritime Transport 2026</h3>
        {report_url && (
          <a className="report_card_download" href={report_url} target="_blank" rel="noreferrer">
            Download the report
          </a>
        )}
      </div>
    </section>
  );
}
