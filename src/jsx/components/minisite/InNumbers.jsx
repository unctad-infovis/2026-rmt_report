import CircleFlag from '@unctad-infovis/general-tools/components/CircleFlag.jsx';
import RollingNumber from '@unctad-infovis/general-tools/components/RollingNumber.jsx';
import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';

import './InNumbers.css';

const ICONS = {
  chip: (
    <>
      <rect height="12" rx="1.5" width="12" x="6" y="6" />
      <rect height="4" width="4" x="10" y="10" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </>
  ),
  drop: <path d="M12 3c3.5 4.6 6 8.2 6 11.2A6 6 0 0 1 6 14.2C6 11.2 8.5 7.6 12 3Z" />,
  gem: <path d="M6 3h12l4 6-10 12L2 9l4-6ZM2 9h20M9 3 7.5 9 12 21l4.5-12L15 3" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.7 5.7 3.7 9s-1.2 6.3-3.7 9c-2.5-2.7-3.7-5.7-3.7-9S9.5 5.7 12 3Z" />
    </>
  ),
  mountain: <path d="m2 20 6-14 4 8 3-4 7 10H2Z" />,
  pulse: <path d="M2 13h4l3-8 4 15 3-9 2 2h4" />,
  route: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 6H17a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h8.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  trend_down: <path d="m3 7 6 6 4-4 8 8m0-6v6h-6" />
};

const Icon = ({ className, name }) =>
  ICONS[name] ? (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      {ICONS[name]}
    </svg>
  ) : null;

const Bars = ({ bars, caption }) => {
  const maxBar = Math.max(...bars.map(b => b.value));
  return (
    <figure className="in_numbers_visual in_numbers_bars">
      <ul aria-label={caption}>
        {bars.map(bar => (
          <li className={bar.highlight ? 'highlight' : undefined} key={bar.label}>
            <span className="bar_value">{bar.value.toFixed(1)}</span>
            <span className="bar" style={{ '--bar-height': `${(bar.value / maxBar) * 100}%` }} />
            <span className="bar_label">{bar.label}</span>
          </li>
        ))}
      </ul>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

const FlagPair = ({ from, label, to }) => (
  <figure aria-label={label} className="in_numbers_visual in_numbers_pair" role="img">
    <div className="pair_flags">
      <CircleFlag className="pair_flag" countryCode={from} height={88} />
      <span className="pair_link" />
      <CircleFlag className="pair_flag" countryCode={to} height={88} />
    </div>
    <Icon className="pair_trend" name="trend_down" />
  </figure>
);

const Share = ({ caption, icon, label, value }) => (
  <figure className="in_numbers_visual in_numbers_share">
    <p className="share_name">
      {label}
      <Icon className="share_icon" name={icon} />
    </p>
    <div className="share_track">
      <span className="share_bar" style={{ '--share': `${value}%` }}>
        <span className="share_value">{`${value}%`}</span>
      </span>
    </div>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

const InNumbers = ({ bars, barsCaption, facts = [], headline, headlineDecimals = 0, headlineLabel, headlinePrefix = '', headlineText, headlineUnit = '', pair, share, title = 'In numbers' }) => {
  const [setNode, isVisible] = useIsVisible(0.3);

  return (
    <section className={`in_numbers${isVisible ? ' visible' : ''}`} ref={setNode}>
      <h3 className="in_numbers_title">
        <span className="in_numbers_arrow" aria-hidden="true" />
        {title}
      </h3>
      <div className="in_numbers_main">
        <div className="in_numbers_headline">
          <p className="in_numbers_value">
            <span className="visually_hidden">{headlineLabel ?? `${headlinePrefix}${headline}${headlineUnit}`}</span>
            <span aria-hidden="true">
              {headlinePrefix}
              <RollingNumber decimals={headlineDecimals} inView={isVisible} target={headline} />
              {headlineUnit && <span className="in_numbers_unit">{headlineUnit}</span>}
            </span>
          </p>
          <p className="in_numbers_text">{headlineText}</p>
        </div>
        {bars?.length > 0 && <Bars bars={bars} caption={barsCaption} />}
        {pair && <FlagPair {...pair} />}
        {share && <Share {...share} />}
      </div>
      {facts.length > 0 && (
        <ul className="in_numbers_facts">
          {facts.map(fact => (
            <li className="fact" key={fact.text}>
              <Icon className="fact_icon" name={fact.icon} />
              <p className="fact_value">
                {fact.from ? (
                  <>
                    {fact.from}
                    <span className="fact_arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="visually_hidden"> to </span>
                    {fact.to}
                  </>
                ) : (
                  fact.value
                )}
              </p>
              <p className="fact_text">{fact.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default InNumbers;
