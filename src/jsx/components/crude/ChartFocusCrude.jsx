import { bisector, curveLinear, line, scaleLinear, scaleUtc, utcFormat, utcMonth } from 'd3';
import { useEffect, useId, useRef, useState } from 'react';
import FocusChartStory from '../shared/FocusChartStory.jsx';
import { AVERAGES, CSV, DATA, DISRUPTION_DATE, NOTE, RECOVERY } from './data.js';

import './ChartFocusCrude.css';

const TITLE = 'Persian Gulf crude oil shipments plunge amid Hormuz disruptions';
const DESCRIPTION = 'Estimated crude oil movements out of the Persian Gulf and east from the Red Sea, millions of tons per day, seven-day moving averages, 2 January 2026–26 July 2026';
const STAGES = [
  {
    key: 'introduction',
    headline: 'The Persian Gulf ships more crude',
    body: 'In early 2026, far more crude oil leaves the Persian Gulf than moves east from the Red Sea.',
    view: { gulfUntil: '2026-02-27', redUntil: '2026-02-27', gulfOpacity: 1, redOpacity: 1, marker: false, averages: false, band: false }
  },
  {
    key: 'disruption',
    headline: 'Disruption hits the Strait of Hormuz',
    body: 'Crude oil shipments from the Persian Gulf plunge after 28 February.',
    view: { gulfUntil: '2026-05-31', redUntil: '2026-02-27', gulfOpacity: 1, redOpacity: 0.3, marker: true, averages: false, band: false }
  },
  {
    key: 'red_sea',
    headline: 'More crude oil moves east from the Red Sea',
    body: 'The daily average rises from about 390,000 tons before 28 February to around 640,000 tons from March to late July.',
    view: { gulfUntil: null, redUntil: null, gulfOpacity: 0.25, redOpacity: 1, marker: true, averages: true, band: false }
  },
  {
    key: 'recovery',
    headline: 'Persian Gulf crude shipments partly recover',
    body: 'Volumes rise in June and early July but stay well below levels before the disruption.',
    view: { gulfUntil: null, redUntil: null, gulfOpacity: 1, redOpacity: 0.35, marker: true, averages: false, band: true }
  },
  {
    key: 'conclusion',
    headline: 'Other routes and suppliers offer limited relief',
    body: 'Extra shipments elsewhere offset only part of the drop in crude oil leaving the Persian Gulf.',
    view: { gulfUntil: null, redUntil: null, gulfOpacity: 1, redOpacity: 1, marker: true, averages: false, band: false }
  }
];
const SERIES = [
  { key: 'gulf', label: 'Persian Gulf outflows', column: 1 },
  { key: 'red_sea', label: 'Eastbound Red Sea', column: 2 }
];

const toDate = value => new Date(`${value}T00:00:00Z`);
const dates = DATA.map(row => toDate(row[0]));
const dayFormat = utcFormat('%-d %B %Y');
const monthFormat = utcFormat('%b');
const dateBisector = bisector(date => date).center;
const lastIndexUntil = until => (until ? Math.max(0, dateBisector(dates, toDate(until))) : dates.length - 1);

const CrudeChart = ({ step }) => {
  const figureRef = useRef(null);
  const tooltipId = useId();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [width, setWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(figureRef.current);
    const onResize = () => {
      setViewportHeight(window.innerHeight);
      setSelectedIndex(null);
    };
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(media.matches);
    window.addEventListener('resize', onResize);
    media.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      media.removeEventListener('change', onMotion);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset interaction when the chart context changes.
  useEffect(() => {
    setSelectedIndex(null);
  }, [step, width, viewportHeight, reducedMotion]);

  const hasData = DATA.length > 0;
  const state = reducedMotion ? STAGES.length - 1 : step;
  const view = STAGES[state].view;
  const chartWidth = Math.max(200, width - 32);
  const height = Math.max(180, Math.min(350, viewportHeight - 360));
  const plotLeft = 36;
  const plotRight = chartWidth - 8;
  const plotTop = 14;
  const plotBottom = height - 46;
  const yMax = hasData ? Math.max(0.5, Math.ceil(Math.max(...DATA.map(row => Math.max(row[1], row[2]))) * 2) / 2) : 2.5;
  const x = scaleUtc()
    .domain(hasData ? [dates[0], dates[dates.length - 1]] : [toDate('2026-01-02'), toDate('2026-07-26')])
    .range([plotLeft, plotRight]);
  const y = scaleLinear().domain([0, yMax]).range([plotBottom, plotTop]);
  const yTicks = y.ticks(5);
  const monthTicks = x.ticks(utcMonth.every(chartWidth < 400 ? 2 : 1));
  const drawnUntil = { gulf: lastIndexUntil(view.gulfUntil), red_sea: lastIndexUntil(view.redUntil) };
  const maxDrawn = Math.max(drawnUntil.gulf, drawnUntil.red_sea);
  const selectedRow = selectedIndex === null ? null : DATA[selectedIndex];
  const tooltipSeries = selectedRow ? SERIES.filter(series => selectedIndex <= drawnUntil[series.key]) : [];
  const disruptionX = x(toDate(DISRUPTION_DATE));
  const tooltipWidth = Math.min(260, chartWidth);

  const selectPointerDate = event => {
    const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    const chartX = ((event.clientX - bounds.left) * chartWidth) / bounds.width;
    setSelectedIndex(Math.max(0, Math.min(maxDrawn, dateBisector(dates, x.invert(chartX)))));
  };
  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      setSelectedIndex(null);
      return;
    }
    const current = selectedIndex ?? 0;
    const next = { ArrowLeft: current - 1, ArrowRight: current + 1, PageDown: current - 7, PageUp: current + 7, Home: 0, End: maxDrawn }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      setSelectedIndex(Math.max(0, Math.min(maxDrawn, next)));
    }
  };

  return (
    <figure className="crude_chart" ref={figureRef} data-chart-state={state}>
      <div className="crude_header">
        <svg viewBox="0 0 288.8 289.6" aria-hidden="true">
          <path d="M11.4,289c-2.6,0-5.2-0.4-9.6-0.7c51.3-48.9,101.1-96.5,151.6-144.7C103.8,96.4,54.7,49.5,5.5,2.6C5.7,2.1,6,1.5,6.2,1C7.8,1,9.4,1,11,1C51,1,91,1.1,131,0.9c5.8,0,9.9,1.7,14,5.7c27.5,26.4,55.2,52.7,82.8,79c20.1,19.2,40.2,38.5,60.3,57.7c-0.7,1.1-1,1.9-1.6,2.4c-48.5,46.3-97.1,92.6-145.6,139c-3.5,3.4-7.2,4.5-11.9,4.5C89.8,289,50.6,289.1,11.4,289" />
        </svg>
        <h3>{TITLE}</h3>
      </div>
      <p className="crude_description">{DESCRIPTION}</p>
      <ul className="crude_legend">
        {SERIES.map(series => (
          <li className={series.key} key={series.key}>
            <span />
            {series.label}
          </li>
        ))}
      </ul>
      <div className="crude_plot_wrap">
        {hasData ? (
          <svg
            className="crude_plot"
            width={chartWidth}
            height={height}
            viewBox={`0 0 ${chartWidth} ${height}`}
            aria-label="Crude oil movements, 2 January to 26 July 2026. Persian Gulf outflows fall sharply after the Strait of Hormuz disruption on 28 February and partly recover in June and early July. Eastbound movements from the Red Sea rise."
          >
            <g className="crude_grid">
              {yTicks.map(value => (
                <g key={value} className={value === 0 ? 'baseline' : ''}>
                  <line x1={plotLeft} x2={plotRight} y1={y(value)} y2={y(value)} />
                  <text x={plotLeft - 6} y={y(value) + 4} textAnchor="end">
                    {value.toFixed(1)}
                  </text>
                </g>
              ))}
            </g>
            <g className="crude_months">
              {monthTicks.map((month, index) => (
                <text key={month.getTime()} x={x(new Date(month.getTime() + 14 * 86400000))} y={height - 26} textAnchor="middle">
                  {monthFormat(month)}
                  {index === 0 && (
                    <tspan className="crude_year" x={x(new Date(month.getTime() + 14 * 86400000))} dy="16">
                      {month.getUTCFullYear()}
                    </tspan>
                  )}
                </text>
              ))}
            </g>
            <rect className={`crude_band${view.band ? ' visible' : ''}`} x={x(toDate(RECOVERY.from))} y={plotTop} width={x(toDate(RECOVERY.to)) - x(toDate(RECOVERY.from))} height={plotBottom - plotTop} />
            <g className={`crude_marker${view.marker ? ' visible' : ''}`}>
              <line x1={disruptionX} x2={disruptionX} y1={plotTop} y2={plotBottom} />
              <text x={disruptionX + 6} y={plotTop + 12}>
                28 February 2026
              </text>
            </g>
            {SERIES.map(series => {
              const points = DATA.map(row => [x(toDate(row[0])), y(row[series.column])]);
              const lengths = points.slice(1).map((point, index) => Math.hypot(point[0] - points[index][0], point[1] - points[index][1]));
              const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
              const drawn = lengths.slice(0, drawnUntil[series.key]).reduce((sum, length) => sum + length, 0);
              const opacity = series.key === 'gulf' ? view.gulfOpacity : view.redOpacity;
              return (
                <g key={series.key} className={`crude_series ${series.key}`} style={{ '--series-opacity': opacity }}>
                  <path className="crude_line" d={line().curve(curveLinear)(points)} pathLength="1" style={{ '--line-offset': 1 - drawn / total }} />
                </g>
              );
            })}
            <g className={`crude_averages${view.averages ? ' visible' : ''}`}>
              <line x1={x(dates[0])} x2={disruptionX} y1={y(AVERAGES.before)} y2={y(AVERAGES.before)} />
              <line x1={disruptionX} x2={x(dates[dates.length - 1])} y1={y(AVERAGES.after)} y2={y(AVERAGES.after)} />
              <text x={plotLeft + 4} y={y(AVERAGES.before) - 8}>
                about 390 000 tons
              </text>
              <text x={plotRight - 4} y={y(AVERAGES.after) - 8} textAnchor="end">
                around 640 000 tons
              </text>
            </g>
            {selectedRow && (
              <g className="crude_tracking">
                <line x1={x(dates[selectedIndex])} x2={x(dates[selectedIndex])} y1={plotTop} y2={plotBottom} />
                {tooltipSeries.map(series => (
                  <circle key={series.key} className={series.key} cx={x(dates[selectedIndex])} cy={y(selectedRow[series.column])} r="5" />
                ))}
              </g>
            )}
            <rect
              className="crude_hit_area"
              x={plotLeft}
              y={plotTop}
              width={plotRight - plotLeft}
              height={plotBottom - plotTop}
              fill="transparent"
              role="slider"
              tabIndex={0}
              aria-label="Explore daily crude oil movements. Use left and right arrow keys to change day, Page Up or Page Down to move a week, Home or End to jump, and Escape to dismiss."
              aria-valuemin={0}
              aria-valuemax={maxDrawn}
              aria-valuenow={selectedIndex ?? 0}
              aria-valuetext={selectedRow ? `${dayFormat(dates[selectedIndex])}. ${tooltipSeries.map(series => `${series.label}: ${selectedRow[series.column].toFixed(2)} million tons per day`).join('. ')}` : dayFormat(dates[0])}
              aria-describedby={selectedRow ? tooltipId : undefined}
              onPointerMove={selectPointerDate}
              onPointerDown={selectPointerDate}
              onPointerLeave={event => {
                if (event.pointerType !== 'touch') setSelectedIndex(null);
              }}
              onPointerCancel={() => setSelectedIndex(null)}
              onFocus={() => setSelectedIndex(index => index ?? 0)}
              onBlur={() => setSelectedIndex(null)}
              onKeyDown={handleKeyDown}
            />
          </svg>
        ) : (
          <p className="crude_pending">Data to be added.</p>
        )}
        {selectedRow && (
          <div className="crude_tooltip" id={tooltipId} role="tooltip" style={{ left: Math.max(0, Math.min(x(dates[selectedIndex]) - tooltipWidth / 2, chartWidth - tooltipWidth)) }}>
            <strong>{dayFormat(dates[selectedIndex])}</strong>
            {tooltipSeries.map(series => (
              <div className={`tooltip_row ${series.key}`} key={series.key}>
                <span className="tooltip_key" />
                <span>{series.label}</span>
                <strong>{selectedRow[series.column].toFixed(2)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="crude_meta">
        <div>
          <em>Source:</em> UN Trade and Development (UNCTAD), based on Marine Benchmark estimates of daily crude quantities calculated from Automatic Identification System drafts associated with tanker movements among sea areas.
        </div>
        <div>
          <em>Note:</em> {NOTE}
        </div>
        {hasData && (
          <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV)}`} download="rmt2026_figures_I_9_I_10.csv">
            Get the data
          </a>
        )}
      </div>
    </figure>
  );
};

const ChartFocusCrude = () => <FocusChartStory className="crude_focus_story" label={TITLE} stages={STAGES} renderChart={step => <CrudeChart step={step} />} />;

export default ChartFocusCrude;
