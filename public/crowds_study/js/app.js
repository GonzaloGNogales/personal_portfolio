import { CONFIG } from './config.js';
import { TEXT, LANGUAGE_NAMES, fill } from './i18n.js';
import { buildDesign, SCENARIOS } from './design.js';
import { createBackend } from './backend.js';
import { detectDevice } from './device.js';

// URL parameters for testing. They only work when the page is opened from this computer
// (localhost), so participants on the public site cannot use them:
//   ?offline=1  do not use Supabase even if it is configured
//   ?cell=N     force design cell N (offline mode only)
//   ?quick=1    unlock the ratings after 1 s instead of a full viewing
//   ?debug=1    expose the design as window.__study
const LOCAL_TEST = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const params = LOCAL_TEST ? new URLSearchParams(location.search) : new URLSearchParams();
const QUICK = params.has('quick');
const STATEMENTS = ['s1', 's2', 's3'];
const SCALE = [1, 2, 3, 4, 5, 6];
const LETTERS = ['A', 'B', 'C', 'D'];

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let lang = CONFIG.LANGUAGES[0];
let backend = null;
let design = null;
let steps = [];
let stepIndex = -1;
let savedCount = 0;
let studyRunning = false;

const text = () => TEXT[lang];

// ---------------------------------------------------------------------------
// Clips are downloaded completely (as blobs) before they are shown, so playback
// never stalls mid-clip. The next few clips are fetched in the background.

class ClipCache {
  constructor(base) {
    this.base = new URL(base, document.baseURI);
    this.entries = new Map();
  }

  get(name) {
    if (!this.entries.has(name)) this.entries.set(name, this.fetchWithRetry(name));
    return this.entries.get(name);
  }

  async fetchWithRetry(name, attempts = 4) {
    let lastError;
    for (let i = 0; i < attempts; i += 1) {
      try {
        const response = await fetch(new URL(name, this.base));
        if (!response.ok) throw new Error(`${response.status} ${name}`);
        return URL.createObjectURL(await response.blob());
      } catch (error) {
        lastError = error;
        await sleep(1000 * (i + 1));
      }
    }
    this.entries.delete(name);
    throw lastError;
  }

  // Frees every clip that is not in `keep`.
  retain(keep) {
    for (const [name, promise] of this.entries) {
      if (keep.has(name)) continue;
      this.entries.delete(name);
      promise.then(url => URL.revokeObjectURL(url)).catch(() => {});
    }
  }
}

const clips = new ClipCache(CONFIG.VIDEO_BASE);

async function getClipUntilLoaded(name, isCurrent, onError) {
  for (;;) {
    try {
      return await clips.get(name);
    } catch (error) {
      console.error(error);
      if (!isCurrent()) return null;
      onError();
      await sleep(3000);
    }
  }
}

function prefetchAround() {
  const keep = new Set();
  const current = steps[stepIndex];
  if (current?.kind === 'anchor') design.anchoring.forEach(c => keep.add(c));
  if (current?.kind === 'trial') keep.add(current.trial.clip);
  let upcoming = 0;
  for (let i = stepIndex + 1; i < steps.length && upcoming < 3; i += 1) {
    if (steps[i].kind !== 'trial') continue;
    keep.add(steps[i].trial.clip);
    upcoming += 1;
  }
  clips.retain(keep);
  keep.forEach(name => clips.get(name).catch(() => {}));
}

// ---------------------------------------------------------------------------
// Loop tracking. With the `loop` attribute no `ended` event fires, so a completed
// viewing is detected when currentTime jumps back to the start.

function trackLoop(video, state, onLoop) {
  if (!video.duration) return;
  const now = video.currentTime;
  if (now + 0.25 < state.lastTime) {
    state.loops += 1;
    onLoop();
  }
  state.lastTime = now;
}

// ---------------------------------------------------------------------------
// Language and static text

function totalVideos() {
  return SCENARIOS.length * 4 * CONFIG.N_VARIATIONS;
}

// Protocol §10.1: ~30 s per trial with a 10 s clip (BOT, BIF, CTG), ~20 s with a 5 s clip
// (PUG), plus practice, the examples and ~3 minutes of reading. Shown as a 5-minute range,
// e.g. N = 3 -> 27 min -> "25–30".
function estimateMinutes() {
  // Word joiners (U+2060) keep "15–20" from breaking across lines.
  if (CONFIG.DISPLAYED_MINUTES) return CONFIG.DISPLAYED_MINUTES.replace('–', '⁠–⁠');
  const n = CONFIG.N_VARIATIONS;
  const seconds = 12 * n * 30 + 4 * n * 20 + CONFIG.N_PRACTICE * 30 + 60 + 180;
  const minutes = seconds / 60;
  const low = Math.max(5, Math.floor(minutes / 5) * 5);
  const high = Math.ceil(minutes / 5) * 5;
  return low === high ? String(low) : `${low}⁠–⁠${high}`;
}

function renderLanguageButtons() {
  const container = $('language-buttons');
  container.innerHTML = '';
  CONFIG.LANGUAGES.forEach(code => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-btn';
    button.dataset.lang = code;
    button.textContent = LANGUAGE_NAMES[code];
    button.addEventListener('click', () => setLanguage(code));
    container.appendChild(button);
  });
}

function setLanguage(code) {
  lang = code;
  const t = text();
  document.documentElement.lang = code === 'zh' ? 'zh-CN' : code;
  document.title = t.pageTitle;
  document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t[el.dataset.t]; });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('selected', b.dataset.lang === code));
  $('start-subtitle').textContent = fill(t.startSubtitle, { minutes: estimateMinutes() });
  $('instructions-content').innerHTML = fill(t.instructionsHtml, {
    s1: t.s1,
    s2: t.s2,
    s3: t.s3,
    practice: CONFIG.N_PRACTICE,
    parts: SCENARIOS.length,
    total: totalVideos(),
    minutes: estimateMinutes(),
    counterExample: fill(t.counter, { n: 5, total: totalVideos() })
  });
  renderRatingText();
  fitStage();
}

// The grid structure is built once; changing language only replaces the text in it.
function buildRatingGrid() {
  const head = $('rating-head');
  const statementHead = document.createElement('div');
  statementHead.className = 'statement-head';
  head.appendChild(statementHead);
  SCALE.forEach(value => {
    const cell = document.createElement('div');
    cell.dataset.value = value;
    head.appendChild(cell);
  });

  const body = $('rating-body');
  STATEMENTS.forEach(key => {
    const row = document.createElement('div');
    row.className = 'rating-row';
    row.dataset.key = key;
    const statement = document.createElement('div');
    statement.className = 'statement';
    row.appendChild(statement);
    SCALE.forEach(value => {
      const option = document.createElement('label');
      option.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = key;
      input.value = value;
      input.disabled = true;
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = value;
      option.append(input, pill);
      row.appendChild(option);
    });
    body.appendChild(row);
  });
}

function renderRatingText() {
  const t = text();
  const head = $('rating-head');
  head.querySelector('.statement-head').textContent = t.statementHeader;
  head.querySelectorAll('[data-value]').forEach(cell => { cell.textContent = t.scale[cell.dataset.value]; });
  $('legend-low').textContent = `1 = ${t.scale[1]}`;
  $('legend-high').textContent = `6 = ${t.scale[6]}`;
  document.querySelectorAll('#rating-body .rating-row').forEach(row => {
    const key = row.dataset.key;
    row.querySelector('.statement').textContent = t[key];
    row.querySelectorAll('input').forEach(input => {
      input.setAttribute('aria-label', `${t[key]}: ${input.value}, ${t.scale[input.value]}`);
    });
  });
}

// ---------------------------------------------------------------------------
// Screens and steps

function show(id) {
  document.querySelectorAll('.screen').forEach(screen => { screen.hidden = screen.id !== id; });
  const scroll = document.querySelector(`#${id} .instructions-scroll`);
  if (scroll) scroll.scrollTop = 0;
}

function buildSteps() {
  const list = [{ kind: 'anchor' }];
  const practice = design.practice.slice(0, CONFIG.N_PRACTICE);
  if (practice.length) {
    list.push({ kind: 'practice-intro' });
    practice.forEach((trial, i) => list.push({ kind: 'trial', trial, practice: true, n: i + 1, total: practice.length }));
  }
  design.blocks.forEach((block, b) => {
    list.push({ kind: 'block', block, n: b + 1 });
    block.trials.forEach(trial => {
      list.push({ kind: 'trial', trial, practice: false, n: trial.index + 1, total: design.totalTrials });
    });
  });
  list.push({ kind: 'end' });
  return list;
}

function next() {
  stepIndex += 1;
  const step = steps[stepIndex];
  prefetchAround();
  if (step.kind === 'anchor') showAnchor();
  else if (step.kind === 'practice-intro') showPracticeIntro();
  else if (step.kind === 'block') showBlockIntro(step);
  else if (step.kind === 'trial') showTrial(step);
  else showEnd();
}

function showMessage(title, html, buttonLabel) {
  show('screen-message');
  $('message-title').textContent = title;
  $('message-text').innerHTML = html;
  $('message-continue').textContent = buttonLabel;
}

function escapeHtml(value) {
  const span = document.createElement('span');
  span.textContent = value;
  return span.innerHTML;
}

function paragraph(content) {
  return `<p>${escapeHtml(content)}</p>`;
}

function showPracticeIntro() {
  const t = text();
  showMessage(t.practiceIntroTitle, paragraph(fill(t.practiceIntroText, { practice: CONFIG.N_PRACTICE })), t.continueBtn);
}

function showBlockIntro(step) {
  const t = text();
  const scenario = t.scenarios[step.block.scenario];
  const title = fill(t.blockTitle, { n: step.n, parts: design.blocks.length, scenario: scenario.name });
  let html = '';
  if (step.n === 1) html += paragraph(fill(t.mainIntroText, { parts: design.blocks.length }));
  html += `<p><strong>${escapeHtml(scenario.description)}</strong></p>`;
  showMessage(title, html, t.blockStartBtn);
}

// ---------------------------------------------------------------------------
// Anchoring: the four DEMO clips play together; continue unlocks after one full loop.

let anchorTiles = [];

async function showAnchor() {
  const t = text();
  show('screen-anchor');
  const grid = $('anchor-grid');
  grid.innerHTML = '';
  $('anchor-continue').disabled = true;
  const myStep = stepIndex;

  anchorTiles = design.anchoring.map((clip, i) => {
    const tile = document.createElement('div');
    tile.className = 'anchor-tile';
    const frame = document.createElement('div');
    frame.className = 'video-frame';
    const video = document.createElement('video');
    Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', disablePictureInPicture: true });
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    overlay.textContent = t.loading;
    frame.append(video, overlay);
    const bar = document.createElement('div');
    bar.className = 'progress';
    const fillEl = document.createElement('div');
    fillEl.className = 'progress-fill';
    bar.appendChild(fillEl);
    const label = document.createElement('span');
    label.textContent = fill(t.anchorLabel, { letter: LETTERS[i] });
    tile.append(frame, bar, label);
    grid.appendChild(tile);
    return { clip, video, overlay, fill: fillEl, loops: 0, lastTime: 0 };
  });

  const urls = await Promise.all(anchorTiles.map(tile =>
    getClipUntilLoaded(tile.clip, () => stepIndex === myStep, () => { tile.overlay.textContent = t.loadError; })
  ));
  if (stepIndex !== myStep) return;
  anchorTiles.forEach((tile, i) => { tile.video.src = urls[i]; });
  await Promise.all(anchorTiles.map(tile => tile.video.play().catch(() => {})));
  anchorTiles.forEach(tile => { tile.overlay.hidden = true; });
  if (QUICK) setTimeout(() => { $('anchor-continue').disabled = false; }, 1000);
}

function tickAnchor() {
  if (steps[stepIndex]?.kind !== 'anchor') return;
  anchorTiles.forEach(tile => {
    trackLoop(tile.video, tile, () => {});
    if (tile.video.duration) tile.fill.style.width = `${(tile.video.currentTime / tile.video.duration) * 100}%`;
  });
  if (anchorTiles.length && anchorTiles.every(tile => tile.loops >= 1)) $('anchor-continue').disabled = false;
}

// ---------------------------------------------------------------------------
// Trials

const trial = {
  step: null,
  token: 0,
  loops: 0,
  lastTime: 0,
  unlocked: false,
  startedAt: null,
  unlockedAt: null,
  saving: false
};

function answers() {
  const result = {};
  STATEMENTS.forEach(key => {
    const checked = document.querySelector(`input[name="${key}"]:checked`);
    result[key] = checked ? Number(checked.value) : null;
  });
  return result;
}

function allAnswered() {
  return Object.values(answers()).every(v => v !== null);
}

function updateNextButton() {
  $('trial-next').disabled = !(trial.unlocked && allAnswered()) || trial.saving;
}

function setLocked(locked) {
  $('rating').classList.toggle('locked', locked);
  document.querySelectorAll('#rating-body input').forEach(input => { input.disabled = locked; });
  const prompt = $('trial-prompt');
  prompt.textContent = locked ? text().watchPrompt : text().ratePrompt;
  prompt.classList.toggle('ready', !locked);
}

function unlockRatings() {
  if (trial.unlocked) return;
  trial.unlocked = true;
  trial.unlockedAt = performance.now();
  setLocked(false);
  updateNextButton();
}

async function showTrial(step) {
  const t = text();
  const token = ++trial.token;
  Object.assign(trial, { step, loops: 0, lastTime: 0, unlocked: false, startedAt: null, unlockedAt: null, saving: false });

  show('screen-trial');
  const counter = $('trial-counter');
  counter.textContent = step.practice
    ? fill(t.practiceBadge, { n: step.n, total: step.total })
    : fill(t.counter, { n: step.n, total: step.total });
  counter.classList.toggle('practice', step.practice);
  $('trial-description').textContent = t.scenarios[step.trial.scenario].description;
  document.querySelectorAll('#rating-body input').forEach(input => { input.checked = false; });
  document.querySelectorAll('#rating-body .rating-row').forEach(row => row.classList.remove('answered'));
  setLocked(true);
  updateNextButton();
  $('trial-status').textContent = '';
  $('trial-progress').style.width = '0';

  const video = $('trial-video');
  const loading = $('trial-loading');
  video.pause();
  video.removeAttribute('src');
  video.load();
  $('trial-play').hidden = true;
  loading.hidden = false;
  loading.textContent = t.loading;

  const url = await getClipUntilLoaded(step.trial.clip, () => token === trial.token, () => { loading.textContent = t.loadError; });
  if (token !== trial.token || !url) return;
  video.src = url;
  try {
    await video.play();
  } catch (error) {
    // Autoplay refused (rare for muted video): let the participant start it.
    loading.hidden = true;
    $('trial-play').hidden = false;
  }
}

function tickTrial() {
  if (steps[stepIndex]?.kind !== 'trial' || !trial.startedAt) return;
  const video = $('trial-video');
  trackLoop(video, trial, unlockRatings);
  if (video.duration) $('trial-progress').style.width = `${(video.currentTime / video.duration) * 100}%`;
  if (QUICK && performance.now() - trial.startedAt > 1000) unlockRatings();
}

async function onNext() {
  if (!trial.unlocked || !allAnswered() || trial.saving) return;
  trial.saving = true;
  updateNextButton();
  $('trial-status').textContent = '';

  const step = trial.step;
  // Practice answers are not recorded (participants are told so).
  if (!step.practice) {
    const a = answers();
    const now = performance.now();
    const t = step.trial;
    const response = {
      trialIndex: t.index,
      trialType: t.type,
      blockIndex: t.blockIndex,
      scenario: t.scenario,
      condition: t.condition,
      variation: t.variation,
      clip: t.clip,
      s1: a.s1,
      s2: a.s2,
      s3: a.s3,
      loops: trial.loops,
      unlockMs: Math.round(trial.unlockedAt - trial.startedAt),
      responseMs: Math.round(now - trial.startedAt),
      videoPx: Math.round($('trial-video').getBoundingClientRect().width)
    };
    try {
      await backend.saveResponse(response);
      savedCount += 1;
    } catch (error) {
      console.error(error);
      $('trial-status').textContent = text().saveError;
      trial.saving = false;
      updateNextButton();
      return;
    }
  }
  trial.step = null;
  next();
}

// ---------------------------------------------------------------------------
// Session start and end

function clientInfo() {
  return {
    screen: { w: screen.width, h: screen.height },
    viewport: { w: innerWidth, h: innerHeight },
    dpr: devicePixelRatio,
    layout,
    stageScale: Number(stageScale.toFixed(3)),
    touchPoints: navigator.maxTouchPoints || 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

async function beginStudy() {
  const button = $('instructions-begin');
  const status = $('instructions-status');
  button.disabled = true;
  status.classList.add('info');
  status.textContent = text().creatingSession;
  try {
    backend = backend || createBackend(params);
    const { designCell } = await backend.createSession({
      language: lang,
      client: clientInfo(),
      device: detectDevice(),
      layout
    });
    design = buildDesign(designCell, CONFIG.N_VARIATIONS);
    await backend.saveDesign(design);
    if (params.has('debug')) {
      window.__study = {
        design,
        get steps() { return steps; },
        backend,
        // Simulates a finished first viewing (for automated tests in a background tab).
        forceUnlock() { trial.startedAt ??= performance.now(); unlockRatings(); }
      };
    }
    steps = buildSteps();
    stepIndex = -1;
    savedCount = 0;
    studyRunning = true;
    status.textContent = '';
    next();
  } catch (error) {
    console.error(error);
    status.classList.remove('info');
    status.textContent = error.message || String(error);
  } finally {
    button.disabled = false;
  }
}

async function showEnd() {
  studyRunning = false;
  show('screen-end');
  clips.retain(new Set());
  try {
    await backend.finish(savedCount);
  } catch (error) {
    console.error(error);
    $('end-status').textContent = text().finishError;
  }
  $('end-offline').hidden = !backend.offline;
}

function downloadOfflineResponses() {
  const blob = new Blob([backend.exportJson()], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `crowds_study_offline_cell${design.cell}_${Date.now()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// Picks the desktop (wide) or mobile (tall) canvas, scales it to fill the window while
// keeping its proportions, and centres it. Desktop and laptop windows are landscape, so
// they always get the desktop canvas.
let stageScale = 1;
let layout = 'desktop';
function fitStage() {
  const portrait = innerHeight > innerWidth;
  layout = portrait && innerWidth < CONFIG.MOBILE_MAX_WIDTH ? 'mobile' : 'desktop';
  const w = layout === 'mobile' ? CONFIG.MOBILE_STAGE_WIDTH : CONFIG.STAGE_WIDTH;
  const h = layout === 'mobile' ? CONFIG.MOBILE_STAGE_HEIGHT : CONFIG.STAGE_HEIGHT;
  const stage = $('stage');
  stage.classList.toggle('mobile', layout === 'mobile');
  stage.style.width = `${w}px`;
  stage.style.height = `${h}px`;
  stageScale = Math.min(innerWidth / w, innerHeight / h);
  const x = (innerWidth - w * stageScale) / 2;
  const y = (innerHeight - h * stageScale) / 2;
  stage.style.transform = `translate(${x}px, ${y}px) scale(${stageScale})`;

  const tooSmall = stageScale < CONFIG.MIN_SCALE;
  const sidewaysPhone = !portrait && matchMedia('(pointer: coarse)').matches;
  $('size-warning').hidden = !tooSmall;
  $('size-warning-text').textContent = sidewaysPhone ? text().rotatePhone : text().smallWindow;
}

function frame() {
  tickAnchor();
  tickTrial();
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------------------
// Wiring

function init() {
  renderLanguageButtons();
  buildRatingGrid();
  setLanguage(lang);

  $('start-continue').addEventListener('click', () => show('screen-instructions'));
  $('instructions-back').addEventListener('click', () => show('screen-start'));
  $('instructions-begin').addEventListener('click', beginStudy);
  $('anchor-continue').addEventListener('click', () => {
    anchorTiles.forEach(tile => tile.video.pause());
    next();
  });
  $('message-continue').addEventListener('click', next);
  $('trial-next').addEventListener('click', onNext);
  $('end-download').addEventListener('click', downloadOfflineResponses);

  const video = $('trial-video');
  video.addEventListener('playing', () => {
    $('trial-loading').hidden = true;
    $('trial-play').hidden = true;
    if (trial.step && !trial.startedAt) trial.startedAt = performance.now();
  });
  // timeupdate keeps loop tracking going when animation frames are throttled.
  video.addEventListener('timeupdate', () => { if (trial.startedAt) trackLoop(video, trial, unlockRatings); });
  video.addEventListener('contextmenu', e => e.preventDefault());
  $('trial-play').addEventListener('click', () => video.play().catch(() => {}));

  $('rating-body').addEventListener('change', event => {
    event.target.closest('.rating-row')?.classList.add('answered');
    updateNextButton();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (trial.step && video.src && video.paused) video.play().catch(() => {});
    if (steps[stepIndex]?.kind === 'anchor') anchorTiles.forEach(tile => tile.video.play().catch(() => {}));
  });

  window.addEventListener('resize', fitStage);
  window.addEventListener('beforeunload', event => {
    if (!studyRunning) return;
    event.preventDefault();
    event.returnValue = text().leaveWarning;
  });

  requestAnimationFrame(frame);
}

init();
