// Study configuration. Edit these values; everything else derives from them.

export const CONFIG = {
  // Supabase project (see README.md, "Supabase setup"). While these still start with
  // REPLACE_, the study runs in offline mode: nothing is sent anywhere and the
  // responses can be downloaded as JSON on the end screen.
  SUPABASE_URL: 'https://huuafcsaxeiqimdvjkor.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_MBwdJSsOqSMy1gAWbiuczQ_FJ4bMbC9',

  // Folder with the clips, relative to index.html.
  VIDEO_BASE: 'videos/',

  // Variations shown per scenario x condition cell (protocol: 3, 4 or 5). 3 gives
  // 48 scored videos (about 25-30 minutes in total).
  N_VARIATIONS: 3,

  // Duration shown to participants (minutes). Set to null to show the estimate computed
  // from the protocol timings instead (about 25-30 minutes for N = 3).
  DISPLAYED_MINUTES: '15–20',

  // Inside each block the trial order is random for every participant. When true, the
  // shuffle is redrawn until no two consecutive videos share the same condition or the
  // same crowd (so the same crowd is never seen twice in a row with different methods).
  AVOID_CONSECUTIVE_REPEATS: true,

  // Practice trials (not analysed) before the scored blocks.
  N_PRACTICE: 2,

  // Languages in the order the buttons appear; the first one is the default.
  LANGUAGES: ['en', 'fr', 'es', 'zh'],

  // Every screen is laid out on a fixed STAGE_WIDTH x STAGE_HEIGHT canvas that is scaled
  // to fit the window, so all elements keep the same proportions on every display and
  // in every language. Below MIN_SCALE the "please enlarge your window" warning appears.
  STAGE_WIDTH: 1200,
  STAGE_HEIGHT: 880,
  MIN_SCALE: 0.55,

  // Portrait screens narrower than this (phones, tablets held upright) use the tall
  // mobile canvas instead, with everything stacked vertically. Phones held sideways
  // are asked to rotate.
  MOBILE_MAX_WIDTH: 900,
  MOBILE_STAGE_WIDTH: 420,
  MOBILE_STAGE_HEIGHT: 920
};

export const STUDY_VERSION = 'v1-2026-09-29';
