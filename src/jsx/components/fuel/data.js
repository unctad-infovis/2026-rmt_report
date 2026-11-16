// Figure III.11: estimated ship fuel costs as a share of the value of imported goods, per cent.
// `before` covers 1 January–27 February 2026, `total` covers 28 February–30 June 2026 (before plus the increase).
// TODO: the values are rounded report figures. Unrounded values are pending from the authors, so the
// stacked segments may not add up exactly to the totals.
export const GROUPS = [
  {
    key: 'final',
    label: 'Final voyage',
    bars: [
      { key: 'world', label: 'World', before: 0.8, total: 1.3 },
      { key: 'sids', label: 'SIDS', before: 0.7, total: 1.2 },
      { key: 'ldcs', label: 'LDCs', before: 1.5, total: 2.6 }
    ]
  },
  {
    key: 'whole',
    label: 'Whole journey',
    bars: [
      { key: 'world', label: 'World', before: 1.9, total: 3.2 },
      { key: 'sids', label: 'SIDS', before: 2.0, total: 3.5 },
      { key: 'ldcs', label: 'LDCs', before: 2.8, total: 4.8 }
    ]
  }
];

// Total maritime transport cost as a share of goods value in 2021 (UNCTAD estimate) and the added fuel effect.
export const BENCHMARK = { base: 11.1, increase: 1.4 };

export const NOTE = 'Final voyage: the voyage into the importing country. Whole journey: every voyage from the country of origin. Total maritime transport costs (last step) are a 2021 UNCTAD estimate. SIDS: small island developing states. LDCs: least developed countries.';

export const CSV = ['Voyage,Economy group,Before the disruption,After the disruption', ...GROUPS.flatMap(group => group.bars.map(bar => [group.label, bar.label, bar.before, bar.total].join(',')))].join('\n');
