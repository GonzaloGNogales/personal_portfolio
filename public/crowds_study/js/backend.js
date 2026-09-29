// Response storage. SupabaseBackend talks to the RPC functions in supabase/schema.sql;
// OfflineBackend keeps everything in memory (used until Supabase is configured, or
// with ?offline=1) so the study can be tested locally.

import { CONFIG, STUDY_VERSION } from './config.js';
import { DESIGN_CELLS } from './design.js';

export function isSupabaseConfigured() {
  return !CONFIG.SUPABASE_URL.startsWith('REPLACE_') && !CONFIG.SUPABASE_PUBLISHABLE_KEY.startsWith('REPLACE_');
}

export function createBackend(params) {
  if (params.has('offline') || !isSupabaseConfigured()) return new OfflineBackend(params);
  return new SupabaseBackend();
}

class SupabaseBackend {
  constructor() {
    if (typeof window.supabase === 'undefined') throw new Error('Supabase library failed to load.');
    this.client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    this.offline = false;
    this.token = null;
  }

  async createSession({ language, client, device, layout }) {
    const { data, error } = await this.client.rpc('create_participant_session', {
      p_language: language,
      p_user_agent: navigator.userAgent,
      p_client: client,
      p_study_version: STUDY_VERSION,
      p_n_variations: CONFIG.N_VARIATIONS,
      p_os: device.os,
      p_device_type: device.deviceType,
      p_browser: device.browser,
      p_layout: layout
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || !row.session_token) throw new Error('Participant session could not be created.');
    this.token = row.session_token;
    return { participantNumber: row.participant_number, designCell: row.design_cell };
  }

  async saveDesign(design) {
    const { error } = await this.client.rpc('set_participant_design', {
      p_session_token: this.token,
      p_scenario_order: design.scenarioOrder,
      p_variation_sequence: design.variationSequence,
      p_used_variations: design.usedVariations
    });
    if (error) throw error;
  }

  async saveResponse(r) {
    const { error } = await this.client.rpc('save_response', {
      p_session_token: this.token,
      p_trial_index: r.trialIndex,
      p_trial_type: r.trialType,
      p_block_index: r.blockIndex,
      p_scenario: r.scenario,
      p_condition: r.condition,
      p_variation: r.variation,
      p_clip: r.clip,
      p_s1: r.s1,
      p_s2: r.s2,
      p_s3: r.s3,
      p_loops: r.loops,
      p_unlock_ms: r.unlockMs,
      p_response_ms: r.responseMs,
      p_video_px: r.videoPx
    });
    if (error) throw error;
  }

  async finish(totalResponses) {
    const { error } = await this.client.rpc('finish_participant_session', {
      p_session_token: this.token,
      p_total_responses: totalResponses
    });
    if (error) throw error;
  }
}

class OfflineBackend {
  constructor(params) {
    this.offline = true;
    this.params = params;
    this.session = null;
    this.responses = [];
  }

  async createSession({ language, client, device, layout }) {
    const requested = Number.parseInt(this.params.get('cell'), 10);
    const designCell = Number.isInteger(requested)
      ? ((requested % DESIGN_CELLS) + DESIGN_CELLS) % DESIGN_CELLS
      : Math.floor(Math.random() * DESIGN_CELLS);
    this.session = {
      participantNumber: 0,
      designCell,
      language,
      ...device,
      layout,
      userAgent: navigator.userAgent,
      client,
      studyVersion: STUDY_VERSION,
      nVariations: CONFIG.N_VARIATIONS,
      startedAt: new Date().toISOString()
    };
    return { participantNumber: 0, designCell };
  }

  async saveDesign(design) {
    this.session.scenarioOrder = design.scenarioOrder;
    this.session.variationSequence = design.variationSequence;
    this.session.usedVariations = design.usedVariations;
  }

  async saveResponse(r) {
    this.responses = this.responses.filter(x => !(x.trialType === r.trialType && x.trialIndex === r.trialIndex));
    this.responses.push({ ...r, savedAt: new Date().toISOString() });
    console.info('[offline] saved', r);
  }

  async finish(totalResponses) {
    this.session.completedAt = new Date().toISOString();
    this.session.totalResponses = totalResponses;
  }

  exportJson() {
    return JSON.stringify({ session: this.session, responses: this.responses }, null, 2);
  }
}
