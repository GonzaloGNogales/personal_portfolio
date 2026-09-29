// Trial sequence for one participant. Everything is deterministic given the
// participant's design cell (assigned by the server), so the order is counterbalanced
// across participants rather than random.
//
// Two Latin squares are combined:
//   - scenario (block) order: row `cell % 4` of a balanced 4x4 Latin square;
//   - variation sequence:     row `floor(cell / 4)` of a cyclic 5x5 Latin square.
// That gives 20 design cells; the server hands them out so they fill evenly.
//
// Inside a block the trials run in N rounds of 4 (one trial per condition). The
// condition order of each round is again a row of the 4x4 square. Over a block every
// condition is shown with each of the participant's N variations exactly once, and two
// consecutive trials never share the same condition or the same crowd (variation).

export const SCENARIOS = ['BOT', 'BIF', 'CTG', 'PUG'];
export const CONDITIONS = ['BASE', 'CS', 'NOFF', 'FULL'];
export const VARIATIONS = [1, 2, 3, 4, 5];
export const DEMO_CLIPS = ['DEMO_BASE.mp4', 'DEMO_CS.mp4', 'DEMO_NOFF.mp4', 'DEMO_FULL.mp4'];

// Balanced (Williams) Latin square: every item appears once per position, and every
// item is directly followed by every other item exactly once across the rows. Taking
// consecutive rows (r, r + 1) never repeats an item across the row boundary.
export const WILLIAMS_4 = [
  [0, 1, 3, 2],
  [1, 2, 0, 3],
  [2, 3, 1, 0],
  [3, 0, 2, 1]
];

export const DESIGN_CELLS = WILLIAMS_4.length * VARIATIONS.length;

export function clipName(scenario, condition, variation) {
  return `${scenario}_${condition}_${variation}.mp4`;
}

function scoredTrial(scenario, conditionIndex, variation, blockIndex, round) {
  const condition = CONDITIONS[conditionIndex];
  return {
    type: 'scored',
    scenario,
    condition,
    variation,
    blockIndex,
    round,
    clip: clipName(scenario, condition, variation)
  };
}

export function buildDesign(cell, nVariations) {
  const scenarioRow = cell % WILLIAMS_4.length;
  const variationRow = Math.floor(cell / WILLIAMS_4.length) % VARIATIONS.length;

  const scenarioOrder = WILLIAMS_4[scenarioRow].map(i => SCENARIOS[i]);
  const variationSequence = VARIATIONS.map((_, i) => VARIATIONS[(variationRow + i) % VARIATIONS.length]);
  const used = variationSequence.slice(0, nVariations);
  const spare = variationSequence.slice(nVariations);

  let index = 0;
  const blocks = scenarioOrder.map((scenario, blockIndex) => {
    const slots = [];
    for (let round = 0; round < nVariations; round += 1) {
      WILLIAMS_4[(scenarioRow + blockIndex + round) % WILLIAMS_4.length]
        .forEach(conditionIndex => slots.push({ conditionIndex, round }));
    }
    const variations = assignVariations(slots, used);
    const trials = slots.map((slot, i) => ({
      ...scoredTrial(scenario, slot.conditionIndex, variations[i], blockIndex, slot.round),
      index: index++
    }));
    return { scenario, blockIndex, trials };
  });

  return {
    cell,
    scenarioRow,
    variationRow,
    scenarioOrder,
    variationSequence,
    usedVariations: used,
    practice: buildPractice(scenarioOrder, scenarioRow, spare, used),
    anchoring: WILLIAMS_4[scenarioRow].map(i => DEMO_CLIPS[i]),
    blocks,
    totalTrials: index
  };
}

// Gives every (condition, round) slot a variation so that each condition sees each used
// variation exactly once and two consecutive trials never show the same crowd.
// Depth-first search; the first choice for slot (round j, condition c) is
// used[(j - c) mod N], a Latin square that already works for N = 4 and 5. With N = 3
// (4 conditions, 3 crowds per round) the search moves the repeated crowd of each round
// onto two non-adjacent trials.
function assignVariations(slots, used) {
  const n = used.length;
  const result = new Array(slots.length);
  const remaining = CONDITIONS.map(() => new Set(used));

  function place(i) {
    if (i === slots.length) return true;
    const { conditionIndex: c, round: j } = slots[i];
    const preferred = (((j - c) % n) + n) % n;
    for (let k = 0; k < n; k += 1) {
      const variation = used[(preferred + k) % n];
      if (!remaining[c].has(variation) || (i > 0 && result[i - 1] === variation)) continue;
      remaining[c].delete(variation);
      result[i] = variation;
      if (place(i + 1)) return true;
      remaining[c].add(variation);
    }
    return false;
  }

  if (!place(0)) throw new Error(`No valid variation assignment for N = ${n}`);
  return result;
}

// Practice uses the participant's spare variation(s), which never appear in their
// scored trials. With N = 5 there is no spare, so the first used variation is reused.
function buildPractice(scenarioOrder, scenarioRow, spare, used) {
  const pool = spare.length ? spare : used;
  const picks = [
    { scenario: scenarioOrder[3], conditionIndex: scenarioRow % 4 },
    { scenario: scenarioOrder[2], conditionIndex: (scenarioRow + 2) % 4 }
  ];
  return picks.map(({ scenario, conditionIndex }, i) => ({
    ...scoredTrial(scenario, conditionIndex, pool[i % pool.length], null, null),
    type: 'practice'
  }));
}

// Sanity checks (run from the browser console); returns a list of problems (empty = ok).
export function validateDesign(design) {
  const problems = [];
  design.blocks.forEach(block => {
    CONDITIONS.forEach(condition => {
      const vars = block.trials.filter(t => t.condition === condition).map(t => t.variation).sort();
      const expected = [...design.usedVariations].sort();
      if (JSON.stringify(vars) !== JSON.stringify(expected)) {
        problems.push(`${block.scenario}/${condition}: variations ${vars} instead of ${expected}`);
      }
    });
    for (let i = 1; i < block.trials.length; i += 1) {
      const a = block.trials[i - 1];
      const b = block.trials[i];
      if (a.condition === b.condition) problems.push(`${block.scenario} #${i}: condition ${a.condition} twice in a row`);
      if (a.variation === b.variation) problems.push(`${block.scenario} #${i}: variation ${a.variation} twice in a row`);
    }
  });
  const expectedTotal = SCENARIOS.length * CONDITIONS.length * design.usedVariations.length;
  if (design.totalTrials !== expectedTotal) problems.push(`total ${design.totalTrials} instead of ${expectedTotal}`);
  return problems;
}
