export const AML_NODES = [
  // Start node
  { id: 'start', type: 'systemNode', position: { x: 0, y: 300 }, data: { label: 'Start' } },

  // A. Wire transparency & travel rule
  {
    id: 'wire',
    type: 'systemNode',
    position: { x: 300, y: -50 },
    data: {
      label: 'Wire transparency & travel rule',
      items: [
        { id: 'TR-001', name: 'Travel Rule breach – missing originator info (MAS 626 §9.4)' },
        { id: 'TR-002', name: 'Incomplete SWIFT :50/:59 originator/beneficiary data' },
        { id: 'TR-003', name: 'Cover payment missing end-to-end originator data (HKMA/BIS)' },
        { id: 'TR-004', name: 'Beneficiary-bank accepted incomplete originator data' },
      ],
    },
  },

  // G. FX reasonableness & fair dealing
  {
    id: 'fx',
    type: 'systemNode',
    position: { x: 300, y: 10 },
    data: {
      label: 'FX reasonableness & fair dealing',
      items: [
        { id: 'FX-017', name: 'FX spread exceeds policy threshold (e.g. >150 bps)' },
        { id: 'FX-018', name: 'Advised FX trade missing suitability assessment' },
      ],
    },
  },

  // M. Pricing & conflicts
  {
    id: 'pricing',
    type: 'systemNode',
    position: { x: 300, y: 70 },
    data: {
      label: 'Pricing & conflicts',
      items: [
        { id: 'PRC-033', name: 'Affiliate pricing worse than market threshold' },
        { id: 'PRC-034', name: 'OUR charges pattern may conceal deductions' },
      ],
    },
  },

  // D. Sanctions & geography
  {
    id: 'sanctions',
    type: 'systemNode',
    position: { x: 300, y: 110 },
    data: {
      label: 'Sanctions & geography',
      items: [
        { id: 'SAN-011', name: 'Counterparty in sanctioned country/list (SECO/UN/EU)' },
        { id: 'SAN-012', name: 'High-risk corridor with vague purpose – evasion risk' },
      ],
    },
  },

  // B. CDD / KYC freshness & EDD
  {
    id: 'cdd',
    type: 'systemNode',
    position: { x: 300, y: 150 },
    data: {
      label: 'CDD / KYC freshness & EDD',
      items: [
        { id: 'CDD-005', name: 'KYC overdue beyond due date (MAS/AMLA)' },
        { id: 'CDD-006', name: 'PEP without required EDD' },
        { id: 'CDD-007', name: 'High-risk customer overdue periodic review' },
        { id: 'CDD-008', name: 'Missing SOW for PEP or high-risk entity' },
      ],
    },
  },

  // H. Suitability / appropriateness
  {
    id: 'suitability',
    type: 'systemNode',
    position: { x: 300, y: 210 },
    data: {
      label: 'Suitability / appropriateness',
      items: [
        { id: 'SUIT-019', name: 'Advised trade without suitability assessment' },
        { id: 'SUIT-020', name: 'Mismatch overridden without justification' },
        { id: 'SUIT-021', name: 'Complex product sold to low-risk client' },
        { id: 'SUIT-022', name: 'VA exposure missing risk disclosure' },
        { id: 'SUIT-023', name: 'Multiple trades imply PBA process missing' },
      ],
    },
  },

  // N. Behavioral / patterning
  {
    id: 'behavioral',
    type: 'systemNode',
    position: { x: 300, y: 270 },
    data: {
      label: 'Behavioral / patterning',
      items: [
        { id: 'PAT-035', name: 'Rapid fund in/out – layering typology' },
        { id: 'PAT-036', name: 'Round-tripping of funds via FX' },
        { id: 'PAT-037', name: 'Dormant customer sudden large SWIFT wires' },
      ],
    },
  },

  // E. Cash structuring & identification
  {
    id: 'cash',
    type: 'systemNode',
    position: { x: 300, y: 310 },
    data: {
      label: 'Cash structuring & ID',
      items: [
        { id: 'CASH-013', name: 'Missing ID verification for cash transaction' },
        { id: 'CASH-014', name: 'Structuring pattern below reporting thresholds' },
      ],
    },
  },

  // C. STR / Suspicion handling
  {
    id: 'str',
    type: 'systemNode',
    position: { x: 300, y: 350 },
    data: {
      label: 'STR / Suspicion handling',
      items: [
        { id: 'STR-009', name: 'Late STR filing beyond SLA' },
        { id: 'STR-010', name: 'Sanctions potential hit executed without clearance' },
      ],
    },
  },

  // I. Virtual assets
  {
    id: 'virtual',
    type: 'systemNode',
    position: { x: 300, y: 390 },
    data: {
      label: 'Virtual assets (VA / DPT)',
      items: [
        { id: 'VA-024', name: 'Counterparty VASP unlicensed/unauthorised' },
        { id: 'VA-025', name: 'VA transfer missing originator/beneficiary info' },
      ],
    },
  },

  // J. Channel & field consistency
  {
    id: 'channel',
    type: 'systemNode',
    position: { x: 300, y: 430 },
    data: {
      label: 'Channel & field consistency',
      items: [
        { id: 'CON-026', name: 'SWIFT missing ordering/beneficiary BICs' },
        { id: 'CON-027', name: 'RTGS delayed settlement (value date mismatch)' },
        { id: 'CON-028', name: 'FAST/FPS used cross-border – invalid jurisdiction' },
      ],
    },
  },

  // K. Counterparty & correspondent banking
  {
    id: 'counterparty',
    type: 'systemNode',
    position: { x: 300, y: 490 },
    data: {
      label: 'Counterparty & correspondent banking',
      items: [
        { id: 'COR-029', name: 'Shell / unsupervised correspondent detected' },
        { id: 'COR-030', name: 'Payable-through without respondent CDD assurance' },
      ],
    },
  },

  // L. Record-keeping & reconstruction
  {
    id: 'record',
    type: 'systemNode',
    position: { x: 300, y: 550 },
    data: {
      label: 'Record-keeping & reconstruction',
      items: [
        { id: 'REC-031', name: 'Missing reconstruction fields (date, amount, details)' },
        { id: 'REC-032', name: 'STR transactions not retained ≥5 years' },
      ],
    },
  },

  // O. Data quality
  {
    id: 'dataquality',
    type: 'systemNode',
    position: { x: 300, y: 610 },
    data: {
      label: 'Data quality',
      items: [
        { id: 'DQ-038', name: 'Invalid account number format (IBAN/BIC)' },
        { id: 'DQ-039', name: 'Beneficiary type mismatch (company vs. retail)' },
        { id: 'DQ-040', name: 'Originator=Beneficiary with conflicting purpose' },
      ],
    },
  },

  // AI Advisor
  { id: 'ai', type: 'aiNode', position: { x: 600, y: 250 }, data: { label: 'AI Advisor' } },

  // Outcomes
  {
    id: "flagged",
    type: "reviewNode",
    position: { x: 900, y: 150 },
    data: { label: "Flagged for Review" },
  },
  {
    id: "transaction_passed",
    type: "transactionPassedNode",
    position: { x: 900, y: 350 },
    data: { label: "Transaction Passed" },
  },
]

export const AML_EDGES = [
  // Start → all modules
  ...[
    'wire', 'fx', 'pricing', 'sanctions', 'cdd', 'suitability', 'behavioral', 'cash',
    'str', 'virtual', 'dataquality', 'channel', 'counterparty', 'record'
  ].map(id => ({
    id: `start-${id}`,
    source: 'start',
    sourceHandle: 'b',
    target: id,
    targetHandle: 'a',
    type: 'floating',
    className: 'customDash',
    style: { strokeWidth: 2, strokeDasharray: '7 13' },
    viaJarvis: true,
  })),

  // Modules → AI Advisor
  ...[
    'wire', 'fx', 'pricing', 'sanctions', 'cdd', 'suitability', 'behavioral', 'cash',
    'str', 'virtual', 'dataquality', 'channel', 'counterparty', 'record'
  ].map(id => ({
    id: `${id}-ai`,
    source: id,
    sourceHandle: 'b',
    target: 'ai',
    targetHandle: 'a',
    type: 'floating',
    className: 'customDash',
    style: { strokeWidth: 2, strokeDasharray: '7 13' },
    viaJarvis: true,
  })),

  // AI Advisor → Outcomes
  {
    id: 'ai-flagged',
    source: 'ai',
    sourceHandle: 'b',
    target: 'flagged',
    targetHandle: 'a',
    type: 'floating',
    className: 'customDash',
    style: { strokeWidth: 2, strokeDasharray: '7 13' },
    viaJarvis: true,
  },
  {
    id: 'ai-transaction-passed',
    source: 'ai',
    sourceHandle: 'b',
    target: 'transaction_passed',
    targetHandle: 'a',
    type: 'floating',
    className: 'customDash',
    style: { strokeWidth: 2, strokeDasharray: '7 13' },
    viaJarvis: true,
  },
]
