// Trial sequence for one participant.
//
// Counterbalanced: the order of the four scenario blocks is row `cell % 4` of a balanced
// 4x4 Latin square (the server hands out design cells so the rows fill evenly).
//
// Random (new draw for every participant):
//   - which N of the 5 recorded variations are used (the others go to practice);
//   - the order of the 4N trials inside each block (every condition is shown with each
//     used variation exactly once), so no video is tied to always following another;
//   - the order of the four example clips.
// With AVOID_CONSECUTIVE_REPEATS the shuffle is redrawn until no two consecutive trials
// share the same condition or the same crowd (variation); the order is still random.

import { CONFIG } from './config.js';

export const SCENARIOS = ['BOT', 'BIF', 'CTG', 'PUG'];
export const CONDITIONS = ['BASE', 'CS', 'NOFF', 'FULL'];
export const VARIATIONS = [1, 2, 3, 4, 5];
export const DEMO_CLIPS = ['DEMO_BASE.mp4', 'DEMO_CS.mp4', 'DEMO_NOFF.mp4', 'DEMO_FULL.mp4'];

// Balanced (Williams) Latin square: every scenario appears once per block position, and
// every scenario is directly followed by every other one exactly once across the rows.
export const WILLIAMS_4 = [
  [0, 1, 3, 2],
  [1, 2, 0, 3],
  [2, 3, 1, 0],
  [3, 0, 2, 1]
];

export const DESIGN_CELLS = 20; // server-side counter; only cell % 4 is used

export function clipName(scenario, condition, variation) {
  return `${scenario}_${condition}_${variation}.mp4`;
}

function shuffle(items, random) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hasConsecutiveRepeat(trials) {
  for (let i = 1; i < trials.length; i += 1) {
    if (trials[i].condition === trials[i - 1].condition) return true;
    if (trials[i].variation === trials[i - 1].variation) return true;
  }
  return false;
}

function shuffleBlock(pairs, random) {
  if (!CONFIG.AVOID_CONSECUTIVE_REPEATS) return shuffle(pairs, random);
  for (let attempt = 0; attempt < 20000; attempt += 1) {
    const order = shuffle(pairs, random);
    if (!hasConsecutiveRepeat(order)) return order;
  }
  return shuffle(pairs, random); // practically unreachable
}

export function buildDesign(cell, nVariations, random = Math.random) {
  const scenarioRow = cell % WILLIAMS_4.length;
  const scenarioOrder = WILLIAMS_4[scenarioRow].map(i => SCENARIOS[i]);
  const variationSequence = shuffle(VARIATIONS, random);
  const used = variationSequence.slice(0, nVariations);
  const spare = variationSequence.slice(nVariations);

  let index = 0;
  const blocks = scenarioOrder.map((scenario, blockIndex) => {
    const pairs = [];
    CONDITIONS.forEach(condition => used.forEach(variation => pairs.push({ condition, variation })));
    const trials = shuffleBlock(pairs, random).map(({ condition, variation }) => ({
      type: 'scored',
      scenario,
      condition,
      variation,
      blockIndex,
      clip: clipName(scenario, condition, variation),
      index: index++
    }));
    return { scenario, blockIndex, trials };
  });

  return {
    cell,
    scenarioRow,
    scenarioOrder,
    variationSequence,
    usedVariations: used,
    practice: buildPractice(scenarioOrder, spare, used, random),
    anchoring: shuffle(DEMO_CLIPS, random),
    blocks,
    totalTrials: index
  };
}

// Practice: two different random conditions, on the last two scenarios of the block order,
// using the participant's spare variations (never shown in the scored trials). With N = 5
// there is no spare, so a used variation is reused.
function buildPractice(scenarioOrder, spare, used, random) {
  const pool = spare.length ? spare : used;
  const [first, second] = shuffle(CONDITIONS, random);
  return [
    { scenario: scenarioOrder[3], condition: first, variation: pool[0] },
    { scenario: scenarioOrder[2], condition: second, variation: pool[1 % pool.length] }
  ].map(t => ({ ...t, type: 'practice', blockIndex: null, clip: clipName(t.scenario, t.condition, t.variation) }));
}

// The planned sequence in compact form, saved with the participant for reproducibility.
export function trialOrderSummary(design) {
  return design.blocks.map(block => ({
    scenario: block.scenario,
    trials: block.trials.map(t => `${t.condition}_${t.variation}`)
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
    if (CONFIG.AVOID_CONSECUTIVE_REPEATS && hasConsecutiveRepeat(block.trials)) {
      problems.push(`${block.scenario}: consecutive repeat`);
    }
  });
  const expectedTotal = SCENARIOS.length * CONDITIONS.length * design.usedVariations.length;
  if (design.totalTrials !== expectedTotal) problems.push(`total ${design.totalTrials} instead of ${expectedTotal}`);
  return problems;
}
