import { scaleLinear } from 'd3';
import { useEffect, useRef, useState } from 'react';
import FocusChartStory from '../shared/FocusChartStory.jsx';
import { BENCHMARK, CSV, GROUPS, NOTE } from './data.js';

import './ChartFocusFuel.css';

const TITLE_START = 'Fuel costs';
const TITLE_ACCENT = 'add up';
const TITLE_END = 'across voyages';
const TITLE = `${TITLE_START} ${TITLE_ACCENT} ${TITLE_END}`;
const DESCRIPTION = 'Estimated ship fuel costs on the final voyage and across all voyages, by economy group, percentage of imported goods value, 1 January–27 February 2026 and 28 February–30 June 2026';
const STAGES = [
  {
    key: 'final_before',
    headline: 'LDCs already paid more for fuel',
    body: 'Before the Hormuz disruption, fuel for the final voyage into a country cost the equivalent of 0.8% of the value of the goods carried, on average worldwide. For LDCs, it was nearly double, at 1.5%.',
    view: { increase: false, finalLine: false, finalOpacity: 1, wholeBars: 0, wholeLine: false, note: null, benchmark: false }
  },
  {
    key: 'final_after',
    headline: 'Higher fuel prices add to the bill',
    body: 'After the disruption, fuel costs on the final voyage reached 1.3% of goods value worldwide, 1.2% for SIDS – still slightly below average – and 2.6% for LDCs.',
    view: { increase: true, finalLine: true, finalOpacity: 1, wholeBars: 0, wholeLine: false, note: 'final_sids', benchmark: false }
  },
  {
    key: 'whole_world',
    headline: 'What about the whole journey?',
    body: 'Many goods travel on more than one ship. Counting every voyage, fuel costs reach 3.2% of goods value worldwide, more than twice the final-voyage figure.',
    view: { increase: true, finalLine: false, finalOpacity: 0.35, wholeBars: 1, wholeLine: true, note: null, benchmark: false }
  },
  {
    key: 'whole_sids',
    headline: 'SIDS move above the average',
    body: 'Their imports often switch ships at hub ports, so counting every voyage pushes their fuel costs to 3.5% of goods value, above the world average.',
    view: { increase: true, finalLine: false, finalOpacity: 0.35, wholeBars: 2, wholeLine: true, note: 'whole_sids', benchmark: false }
  },
  {
    key: 'whole_ldcs',
    headline: 'LDCs still pay the most',
    body: 'At 4.8% of goods value, their fuel costs are about one and a half times the world average.',
    view: { increase: true, finalLine: false, finalOpacity: 0.35, wholeBars: 3, wholeLine: true, note: 'whole_ldcs', benchmark: false }
  },
  {
    key: 'benchmark',
    headline: 'Fuel pushes up the total cost of shipping',
    body: 'Shipping goods by sea cost about 11.1% of their value in 2021, the latest estimate. Higher fuel prices would add 1.4 percentage points, raising that to about 12.5%.',
    view: { increase: true, finalLine: false, finalOpacity: 0, wholeBars: 0, wholeLine: false, note: null, benchmark: true }
  }
];
const NOTES = {
  final_sids: { group: 0, bar: 1, text: 'Below average' },
  whole_sids: { group: 1, bar: 1, text: 'Above average' },
  whole_ldcs: { group: 1, bar: 2, text: 'Highest' }
};
const SLOTS = 7;
const format = value => `${value.toFixed(1)}%`;
const WORLD = GROUPS.map(group => group.bars[0].total);

const FuelChart = ({ step }) => {
  const figureRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(figureRef.current);
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const view = STAGES[step].view;
  const chartWidth = Math.max(240, width - 32);
  const height = Math.max(260, Math.min(400, viewportHeight - 330));
  const plotLeft = 40;
  const plotRight = chartWidth - 8;
  const plotTop = 22;
  const plotBottom = height - 62;
  const slotWidth = (plotRight - plotLeft) / SLOTS;
  const barWidth = Math.min(64, slotWidth * 0.72);
  const slotX = slot => plotLeft + slotWidth * (slot + 0.5) - barWidth / 2;
  const y = scaleLinear().domain([0, 5.6]).range([plotBottom, plotTop]);
  const yBenchmark = scaleLinear().domain([0, 14]).range([plotBottom, plotTop]);
  const yTicks = [0, 1, 2, 3, 4, 5];
  const benchmarkTicks = [0, 5, 10];
  const benchmarkX = plotLeft + (plotRight - plotLeft) / 2 - barWidth * 0.8;
  const benchmarkWidth = barWidth * 1.6;
  const benchmarkTotal = BENCHMARK.base + BENCHMARK.increase;

  const bars = GROUPS.flatMap((group, groupIndex) =>
    group.bars.map((bar, barIndex) => {
      const visible = groupIndex === 0 ? true : barIndex < view.wholeBars;
      const dimmed = groupIndex === 0 ? view.finalOpacity : 1;
      const slot = groupIndex * 4 + barIndex;
      return { ...bar, groupIndex, barIndex, slot, opacity: view.benchmark || !visible ? 0 : dimmed, x: slotX(slot) };
    })
  );
  const activeNote = view.note ? NOTES[view.note] : null;

  return (
    <figure className="fuel_chart" ref={figureRef} data-chart-state={step}>
      <div className="fuel_header">
        <svg viewBox="0 0 288.8 289.6" aria-hidden="true">
          <path d="M11.4,289c-2.6,0-5.2-0.4-9.6-0.7c51.3-48.9,101.1-96.5,151.6-144.7C103.8,96.4,54.7,49.5,5.5,2.6C5.7,2.1,6,1.5,6.2,1C7.8,1,9.4,1,11,1C51,1,91,1.1,131,0.9c5.8,0,9.9,1.7,14,5.7c27.5,26.4,55.2,52.7,82.8,79c20.1,19.2,40.2,38.5,60.3,57.7c-0.7,1.1-1,1.9-1.6,2.4c-48.5,46.3-97.1,92.6-145.6,139c-3.5,3.4-7.2,4.5-11.9,4.5C89.8,289,50.6,289.1,11.4,289" />
        </svg>
        <h3 aria-label={TITLE}>
          {TITLE_START} <span className="fuel_accent">{TITLE_ACCENT}</span> {TITLE_END}
        </h3>
      </div>
      <p className="fuel_description">{DESCRIPTION}</p>
      <ul className="fuel_legend">
        <li className="before">
          <span />
          Before the Hormuz disruption
        </li>
        <li className="increase">
          <span />
          Added after the disruption
        </li>
        <li className="world">
          <span />
          World average
        </li>
      </ul>
      <svg
        className="fuel_plot"
        width={chartWidth}
        height={height}
        viewBox={`0 0 ${chartWidth} ${height}`}
        role="img"
        aria-label="Stacked bar chart of ship fuel costs as a share of imported goods value, per cent. Final voyage before and after the Hormuz disruption: world 0.8 to 1.3, small island developing states 0.7 to 1.2, least developed countries 1.5 to 2.6. Whole journey: world 1.9 to 3.2, small island developing states 2.0 to 3.5, least developed countries 2.8 to 4.8. Total maritime transport cost in 2021 was about 11.1% of goods value; higher fuel prices would add 1.4 percentage points."
      >
        <g className={`fuel_grid${view.benchmark ? '' : ' visible'}`}>
          {yTicks.map(value => (
            <g key={value} className={value === 0 ? 'baseline' : ''}>
              <line x1={plotLeft} x2={plotRight} y1={y(value)} y2={y(value)} />
              <text x={plotLeft - 6} y={y(value) + 4} textAnchor="end">
                {value.toFixed(1)}
              </text>
            </g>
          ))}
        </g>
        <g className={`fuel_grid${view.benchmark ? ' visible' : ''}`}>
          {benchmarkTicks.map(value => (
            <g key={value} className={value === 0 ? 'baseline' : ''}>
              <line x1={plotLeft} x2={plotRight} y1={yBenchmark(value)} y2={yBenchmark(value)} />
              <text x={plotLeft - 6} y={yBenchmark(value) + 4} textAnchor="end">
                {value.toFixed(1)}
              </text>
            </g>
          ))}
        </g>
        <g className={`fuel_groups${view.benchmark ? '' : ' visible'}`}>
          {GROUPS.map((group, index) => (
            <text key={group.key} className="fuel_group_label" x={plotLeft + slotWidth * (index * 4 + 1.5)} y={height - 8} textAnchor="middle" style={{ opacity: index === 0 ? view.finalOpacity || 0 : view.wholeBars > 0 ? 1 : 0 }}>
              {group.label}
            </text>
          ))}
          <line className="fuel_divider" x1={plotLeft + slotWidth * 3.5} x2={plotLeft + slotWidth * 3.5} y1={plotBottom} y2={height - 2} />
        </g>
        {WORLD.map((value, index) => {
          const shown = index === 0 ? view.finalLine : view.wholeLine;
          return <line key={GROUPS[index].key} className={`fuel_world_line${shown ? ' visible' : ''}`} x1={plotLeft + slotWidth * (index * 4)} x2={plotLeft + slotWidth * (index * 4 + 3)} y1={y(value)} y2={y(value)} />;
        })}
        {bars.map(bar => {
          const showIncrease = view.increase;
          const topValue = showIncrease ? bar.total : bar.before;
          return (
            <g key={`${bar.groupIndex}-${bar.key}`} className="fuel_bar" style={{ '--bar-opacity': bar.opacity }}>
              <rect className="fuel_before" x={bar.x} y={y(bar.before)} width={barWidth} height={y(0) - y(bar.before)} />
              <rect className={`fuel_increase${showIncrease ? ' visible' : ''}`} x={bar.x} y={y(bar.total)} width={barWidth} height={y(bar.before) - y(bar.total)} />
              <text className="fuel_value" x={bar.x + barWidth / 2} y={y(topValue) - 6} textAnchor="middle">
                {format(topValue)}
              </text>
              <text className="fuel_category" x={bar.x + barWidth / 2} y={plotBottom + 16} textAnchor="middle">
                {bar.label}
              </text>
            </g>
          );
        })}
        {Object.entries(NOTES).map(([key, note]) => {
          const bar = GROUPS[note.group].bars[note.bar];
          const slot = note.group * 4 + note.bar;
          return (
            <text key={key} className={`fuel_note${activeNote === note ? ' visible' : ''}`} x={slotX(slot) + barWidth / 2} y={y(bar.total) - 24} textAnchor="middle">
              {note.text}
            </text>
          );
        })}
        <g className={`fuel_benchmark${view.benchmark ? ' visible' : ''}`}>
          <rect className="fuel_before" x={benchmarkX} y={yBenchmark(BENCHMARK.base)} width={benchmarkWidth} height={yBenchmark(0) - yBenchmark(BENCHMARK.base)} />
          <rect className="fuel_increase visible" x={benchmarkX} y={yBenchmark(benchmarkTotal)} width={benchmarkWidth} height={yBenchmark(BENCHMARK.base) - yBenchmark(benchmarkTotal)} />
          <text className="fuel_value" x={benchmarkX + benchmarkWidth / 2} y={yBenchmark(benchmarkTotal) - 6} textAnchor="middle">
            About {format(benchmarkTotal)}
          </text>
          <text className="fuel_inside" x={benchmarkX + benchmarkWidth / 2} y={yBenchmark(BENCHMARK.base / 2) + 4} textAnchor="middle">
            {format(BENCHMARK.base)}
          </text>
          <text className="fuel_inside dark" x={benchmarkX + benchmarkWidth + 8} y={yBenchmark(BENCHMARK.base + BENCHMARK.increase / 2) + 4}>
            +{BENCHMARK.increase.toFixed(1)} points
          </text>
          <text className="fuel_category" x={benchmarkX + benchmarkWidth / 2} y={plotBottom + 16} textAnchor="middle">
            Total maritime transport cost, 2021
          </text>
        </g>
      </svg>
      <div className="fuel_meta">
        <div>
          <em>Source:</em> UN Trade and Development (UNCTAD) calculations, based on AIS-derived voyage data provided by Marine Benchmark; IMO (2020); Clarksons Research Shipping Intelligence Network; UNCTAD seaborne trade data; and UNCTAD trade and transport data.
        </div>
        <div>
          <em>Note:</em> {NOTE}
        </div>
        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV)}`} download="rmt2026_figure_III_11.csv">
          Get the data
        </a>
      </div>
    </figure>
  );
};

const ChartFocusFuel = () => <FocusChartStory className="fuel_focus_story" label={TITLE} stages={STAGES} renderChart={step => <FuelChart step={step} />} />;

export default ChartFocusFuel;
