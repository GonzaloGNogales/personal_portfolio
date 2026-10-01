// Informed consent: the participant code, the on-screen document and the signed PDF.
//
// The PDF is built in the browser with pdf-lib. Latin text uses the standard Helvetica
// fonts; Chinese uses fonts/zh_consent.otf, a subset of Noto Sans SC holding exactly the
// characters of the Chinese consent text (embedded whole, which keeps it small and avoids
// pdf-lib's broken subsetting of CFF fonts). Whatever the participant types (name, place,
// represented person) is drawn as an image with the device's own fonts, so any script or
// alphabet works, exactly like the drawn signature.

import { CONSENT, CONSENT_VERSION, RESEARCHER_NAME, CONTACT_EMAIL } from './consent_text.js';
import { fill } from './i18n.js';

const PDF_LIB_URL = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const FONTKIT_URL = 'https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js';
const ZH_FONT_URL = 'fonts/zh_consent.otf';
const LOGO_URL = 'img/urjc_logo.png';

const PAGE = { w: 595.28, h: 841.89 };
const MARGIN = { left: 62, right: 62, top: 46, bottom: 58 };
const CONTENT_W = PAGE.w - MARGIN.left - MARGIN.right;
const TEXT_COLOR = [0.1, 0.1, 0.12];
const GREY = [0.42, 0.44, 0.48];
const DEVICE_FONTS = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';

// ---------------------------------------------------------------------------
// Participant code: random, alphanumeric, no look-alike characters (0/O, 1/I).

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function newParticipantCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = [...bytes].map(b => CODE_ALPHABET[b % CODE_ALPHABET.length]);
  return `${chars.slice(0, 4).join('')}-${chars.slice(4).join('')}`;
}

// ---------------------------------------------------------------------------
// On-screen version of the information sheet.

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function richHtml(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function consentHtml(lang) {
  const c = CONSENT[lang];
  const parts = [
    `<img class="consent-logo" src="${LOGO_URL}" alt="Universidad Rey Juan Carlos">`,
    `<h3 class="consent-title">${escapeHtml(c.title)}</h3>`,
    `<p class="consent-project"><strong>${escapeHtml(c.project)}</strong></p>`,
    `<p class="consent-project"><strong>${escapeHtml(c.pi)}</strong></p>`
  ];
  c.blocks.forEach(block => {
    if (block.h) parts.push(`<h4>${escapeHtml(block.h)}</h4>`);
    else if (block.sub) parts.push(`<h5>${escapeHtml(block.sub)}</h5>`);
    else if (block.p) parts.push(`<p>${richHtml(block.p)}</p>`);
    else if (block.ul) parts.push(`<ul>${block.ul.map(item => `<li>${richHtml(item)}</li>`).join('')}</ul>`);
    else if (block.contacts) parts.push(`<p class="consent-contacts">${block.contacts.map(escapeHtml).join('<br>')}</p>`);
  });
  return parts.join('');
}

// ---------------------------------------------------------------------------
// Libraries (loaded only when a PDF is needed).

let libsPromise = null;
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(script);
  });
}

export function loadPdfLibs() {
  libsPromise ??= loadScript(PDF_LIB_URL).then(() => loadScript(FONTKIT_URL));
  libsPromise.catch(() => { libsPromise = null; });
  return libsPromise;
}

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.arrayBuffer();
}

// ---------------------------------------------------------------------------
// Typed values -> image (device fonts, so every alphabet renders).

function textToPng(text, { px = 44, color = '#141418', italic = false } = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `${italic ? 'italic ' : ''}${px}px ${DEVICE_FONTS}`;
  ctx.font = font;
  const width = Math.max(1, Math.ceil(ctx.measureText(text).width) + 6);
  const height = Math.ceil(px * 1.35);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 3, height / 2);
  return { dataUrl: canvas.toDataURL('image/png'), width, height };
}

function dataUrlToBytes(dataUrl) {
  const binary = atob(dataUrl.split(',')[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ---------------------------------------------------------------------------
// A small flowing-text layout engine on top of pdf-lib.

const CJK = '⺀-鿿　-〿＀-￯';
const TOKEN_RE = new RegExp(`(\\s+)|([${CJK}])|([^\\s${CJK}]+)`, 'g');
// Chinese typesetting never starts a line with closing punctuation.
const NO_LINE_START = /^[，。、；：！？）》」』】〕”’·]$/;

function parseRuns(text) {
  const runs = [];
  text.split(/(\*\*.+?\*\*)/g).forEach(part => {
    if (!part) return;
    if (part.startsWith('**') && part.endsWith('**')) runs.push({ text: part.slice(2, -2), bold: true });
    else runs.push({ text: part, bold: false });
  });
  return runs;
}

class Writer {
  constructor(doc, fonts, logo) {
    this.doc = doc;
    this.fonts = fonts;
    this.logo = logo;
    this.pages = [];
    this.newPage();
  }

  newPage() {
    this.page = this.doc.addPage([PAGE.w, PAGE.h]);
    this.pages.push(this.page);
    const logoH = 40;
    const logoW = logoH * (this.logo.width / this.logo.height);
    this.page.drawImage(this.logo, { x: MARGIN.left - 4, y: PAGE.h - MARGIN.top - logoH, width: logoW, height: logoH });
    this.y = PAGE.h - MARGIN.top - logoH - 22;
  }

  ensure(height) {
    if (this.y - height < MARGIN.bottom) this.newPage();
  }

  font(bold) {
    return bold ? this.fonts.bold : this.fonts.regular;
  }

  width(text, bold, size) {
    return this.font(bold).widthOfTextAtSize(text, size);
  }

  drawWord(text, x, y, size, bold, color = TEXT_COLOR) {
    const { rgb } = window.PDFLib;
    const options = { x, y, size, font: this.font(bold), color: rgb(...color) };
    this.page.drawText(text, options);
    // Fonts without a bold face (Chinese) get a slightly offset second pass.
    if (bold && this.fonts.fauxBold) this.page.drawText(text, { ...options, x: x + size * 0.035 });
  }

  // Lays out rich text (runs of { text, bold }) inside [x, x + width], wrapping words
  // (Latin) or characters (CJK). Returns the lines as lists of positioned tokens.
  layout(runs, size, width) {
    const lines = [[]];
    let lineWidth = 0;
    runs.forEach(run => {
      for (const match of run.text.matchAll(TOKEN_RE)) {
        const token = match[0];
        const isSpace = Boolean(match[1]);
        const w = this.width(isSpace ? ' ' : token, run.bold, size);
        const line = lines[lines.length - 1];
        if (isSpace) {
          if (line.length) { line.push({ text: ' ', bold: run.bold, w, space: true }); lineWidth += w; }
          continue;
        }
        if (lineWidth + w > width && line.length && !NO_LINE_START.test(token)) {
          while (line.length && line[line.length - 1].space) lineWidth -= line.pop().w;
          lines.push([]);
          lineWidth = 0;
        }
        lines[lines.length - 1].push({ text: token, bold: run.bold, w });
        lineWidth += w;
      }
    });
    return lines.filter(line => line.length);
  }

  paragraph(text, { size = 10, bold = false, x = MARGIN.left, width = CONTENT_W, align = 'left', after = 6, lineHeight = 1.38, color = TEXT_COLOR } = {}) {
    const runs = typeof text === 'string' ? parseRuns(text).map(r => ({ ...r, bold: r.bold || bold })) : text;
    const lines = this.layout(runs, size, width);
    const step = size * lineHeight;
    lines.forEach(line => {
      this.ensure(step);
      const total = line.reduce((sum, token) => sum + token.w, 0);
      let cursor = align === 'center' ? x + (width - total) / 2 : x;
      this.y -= size;
      // Draw runs of same-weight tokens as one string (spaces included), so copying text
      // out of the PDF keeps the spaces between words.
      let segment = null;
      const flush = () => {
        if (segment) this.drawWord(segment.text, segment.x, this.y, size, segment.bold, color);
        segment = null;
      };
      line.forEach(token => {
        if (!segment || segment.bold !== token.bold) { flush(); segment = { text: '', x: cursor, bold: token.bold }; }
        segment.text += token.text;
        cursor += token.w;
      });
      flush();
      this.y -= step - size;
    });
    this.y -= after;
  }

  bullets(items, { size = 10 } = {}) {
    const indent = 14;
    items.forEach(item => {
      this.ensure(size * 1.4);
      const top = this.y;
      this.drawWord('•', MARGIN.left + 4, top - size, size, false);
      this.paragraph(item, { size, x: MARGIN.left + indent, width: CONTENT_W - indent, after: 2 });
    });
    this.y -= 4;
  }

  image(img, { x, y, width, height }) {
    this.page.drawImage(img, { x, y, width, height });
  }

  // A typed value as an image, at most `maxWidth` wide, standing on the baseline y.
  async typedValue(text, { x, y, height = 13, maxWidth = CONTENT_W, italic = false }) {
    if (!text) return 0;
    const png = textToPng(text, { italic });
    const img = await this.doc.embedPng(dataUrlToBytes(png.dataUrl));
    let w = height * 1.35 * (png.width / png.height);
    let h = height * 1.35;
    if (w > maxWidth) { h *= maxWidth / w; w = maxWidth; }
    this.page.drawImage(img, { x, y: y - h * 0.26, width: w, height: h });
    return w;
  }

  checkbox(label, checked, { size = 10 } = {}) {
    const { rgb } = window.PDFLib;
    this.ensure(size * 1.8);
    const box = 9;
    const bx = MARGIN.left + 4;
    const by = this.y - size - 1;
    this.page.drawRectangle({ x: bx, y: by, width: box, height: box, borderColor: rgb(...TEXT_COLOR), borderWidth: 0.8 });
    if (checked) {
      this.page.drawLine({ start: { x: bx + 1.8, y: by + 1.8 }, end: { x: bx + box - 1.8, y: by + box - 1.8 }, thickness: 1.2, color: rgb(...TEXT_COLOR) });
      this.page.drawLine({ start: { x: bx + 1.8, y: by + box - 1.8 }, end: { x: bx + box - 1.8, y: by + 1.8 }, thickness: 1.2, color: rgb(...TEXT_COLOR) });
    }
    this.paragraph(label, { size, x: bx + box + 8, width: CONTENT_W - box - 12, after: 4 });
  }

  rule(x, y, width) {
    const { rgb } = window.PDFLib;
    this.page.drawLine({ start: { x, y }, end: { x: x + width, y }, thickness: 0.6, color: rgb(...GREY) });
  }

  box(x, y, width, height) {
    const { rgb } = window.PDFLib;
    this.page.drawRectangle({ x, y, width, height, borderColor: rgb(...TEXT_COLOR), borderWidth: 0.7 });
  }
}

// ---------------------------------------------------------------------------
// The document.

function pad(n) {
  return String(n).padStart(2, '0');
}

function timezoneLabel(date) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return `UTC${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
}

// Two-column signature table (participant | researcher), drawn below the current y.
async function signatureTable(w, form, { participantName, signature, researcher }) {
  const nameRowH = 50;
  const signRowH = 74;
  w.ensure(nameRowH + signRowH + 10);
  const colW = CONTENT_W / 2;
  const top = w.y;
  const left = MARGIN.left;
  w.box(left, top - nameRowH, colW, nameRowH);
  w.box(left + colW, top - nameRowH, colW, nameRowH);
  w.box(left, top - nameRowH - signRowH, colW, signRowH);
  w.box(left + colW, top - nameRowH - signRowH, colW, signRowH);

  const labelSize = 8.5;
  const labelWidth = colW - 12;
  const drawLabel = (text, x, y) => {
    const saved = w.y;
    w.y = y;
    w.paragraph(text, { size: labelSize, bold: true, x, width: labelWidth, after: 0, lineHeight: 1.25 });
    w.y = saved;
  };
  drawLabel(form.participantCol, left + 6, top - 4);
  drawLabel(form.researcherCol, left + colW + 6, top - 4);
  w.drawWord(form.signature, left + 6, top - nameRowH - signRowH + 6, labelSize, true);
  w.drawWord(form.signature, left + colW + 6, top - nameRowH - signRowH + 6, labelSize, true);

  if (participantName) await w.typedValue(participantName, { x: left + 8, y: top - nameRowH + 10, height: 11, maxWidth: colW - 16 });
  if (researcher) {
    await w.typedValue(researcher, { x: left + colW + 8, y: top - nameRowH + 10, height: 11, maxWidth: colW - 16 });
    await w.typedValue(researcher, { x: left + colW + 10, y: top - nameRowH - signRowH / 2, height: 15, maxWidth: colW - 20, italic: true });
  }
  if (signature) {
    const img = await w.doc.embedPng(signature);
    const maxW = colW - 20;
    const maxH = signRowH - 22;
    const scale = Math.min(maxW / img.width, maxH / img.height);
    w.image(img, { x: left + 10, y: top - nameRowH - signRowH + 16, width: img.width * scale, height: img.height * scale });
  }
  w.y = top - nameRowH - signRowH - 12;
}

// details: { lang, code, fullName, onBehalf, representedName, place, signedAt (Date), signaturePng (Uint8Array) }
export async function buildConsentPdf(details) {
  await loadPdfLibs();
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
  const c = CONSENT[details.lang];
  const doc = await PDFDocument.create();
  doc.setTitle(`${c.form.title} — ${details.code}`);
  doc.setSubject(c.project);
  doc.setAuthor(RESEARCHER_NAME);
  doc.setCreator('Crowd Motion Study');

  let fonts;
  if (details.lang === 'zh') {
    doc.registerFontkit(window.fontkit);
    const zh = await doc.embedFont(await fetchBytes(ZH_FONT_URL), { subset: false });
    fonts = { regular: zh, bold: zh, fauxBold: true };
  } else {
    fonts = {
      regular: await doc.embedFont(StandardFonts.Helvetica),
      bold: await doc.embedFont(StandardFonts.HelveticaBold),
      fauxBold: false
    };
  }
  const logo = await doc.embedPng(await fetchBytes(LOGO_URL));
  const w = new Writer(doc, fonts, logo);

  // 1. Information sheet.
  w.paragraph(c.title, { size: 11.5, bold: true, align: 'center', after: 10 });
  w.paragraph(c.project, { size: 10.5, bold: true, after: 6 });
  w.paragraph(c.pi, { size: 10.5, bold: true, after: 10 });
  c.blocks.forEach(block => {
    if (block.h) { w.ensure(40); w.paragraph(block.h, { size: 10.5, bold: true, after: 4 }); }
    else if (block.sub) { w.ensure(36); w.paragraph(block.sub, { size: 10, bold: true, after: 2 }); }
    else if (block.p) w.paragraph(block.p, { size: 10 });
    else if (block.ul) w.bullets(block.ul);
    else if (block.contacts) block.contacts.forEach((line, i, all) => w.paragraph(line, { size: 10, x: MARGIN.left + 14, after: i === all.length - 1 ? 8 : 1 }));
  });

  // 2. Signed informed consent.
  w.newPage();
  const f = c.form;
  w.paragraph(f.title, { size: 12, bold: true, align: 'center', after: 12 });
  w.paragraph(f.iAm, { size: 10, bold: true, after: 2 });
  w.ensure(22);
  await w.typedValue(details.fullName, { x: MARGIN.left + 14, y: w.y - 12, height: 12 });
  w.rule(MARGIN.left + 12, w.y - 16, CONTENT_W - 12);
  w.y -= 26;
  w.checkbox(f.ownName, !details.onBehalf);
  w.checkbox(f.onBehalf, details.onBehalf);
  w.paragraph(f.representedName, { size: 10, x: MARGIN.left + 21, width: CONTENT_W - 21, after: 2 });
  w.ensure(22);
  if (details.onBehalf) await w.typedValue(details.representedName, { x: MARGIN.left + 24, y: w.y - 12, height: 12 });
  w.rule(MARGIN.left + 21, w.y - 16, CONTENT_W - 21);
  w.y -= 28;
  w.paragraph(f.wishes, { size: 10, after: 8 });
  w.paragraph(f.statement, { size: 10, after: 14 });

  // "In <place>, on <date>": the place is a typed value (image) inside the sentence.
  const d = details.signedAt;
  const sentence = fill(f.placeDate, { day: d.getDate(), month: f.months[d.getMonth()], year: d.getFullYear() });
  const [before, after] = sentence.split('{place}');
  w.ensure(24);
  const baseline = w.y - 11;
  const beforeW = w.width(before, false, 10.5);
  const placePng = textToPng(details.place);
  const placeH = 12 * 1.35;
  const placeW = Math.min(180, placeH * (placePng.width / placePng.height));
  const afterW = w.width(after, false, 10.5);
  let x = MARGIN.left + (CONTENT_W - (beforeW + placeW + afterW)) / 2;
  w.drawWord(before, x, baseline, 10.5, false);
  x += beforeW;
  await w.typedValue(details.place, { x, y: baseline, height: 12, maxWidth: 180 });
  w.rule(x, baseline - 3, placeW);
  x += placeW;
  w.drawWord(after, x, baseline, 10.5, false);
  w.y -= 34;

  await signatureTable(w, f, { participantName: details.fullName, signature: details.signaturePng, researcher: RESEARCHER_NAME });
  const m = c.meta;
  const signedLine = fill(m.signed, { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())} (${timezoneLabel(d)})` });
  w.paragraph(`${m.code}: ${details.code}`, { size: 9, bold: true, color: GREY, after: 1 });
  w.paragraph(signedLine, { size: 8.5, color: GREY, after: 1 });
  w.paragraph(`${m.version}: ${CONSENT_VERSION}`, { size: 8.5, color: GREY, after: 0 });

  // 3. Blank revocation form, with instructions to send it back.
  w.newPage();
  const r = c.revocation;
  w.paragraph(r.title, { size: 12, bold: true, align: 'center', after: 2 });
  w.paragraph(r.subtitle, { size: 9.5, align: 'center', color: GREY, after: 14 });

  const noteText = fill(r.instructions, { email: CONTACT_EMAIL, code: details.code });
  const noteLines = w.layout(parseRuns(noteText), 10, CONTENT_W - 20).length;
  const noteH = noteLines * 10 * 1.38 + 16;
  w.page.drawRectangle({ x: MARGIN.left, y: w.y - noteH, width: CONTENT_W, height: noteH, color: rgb(1, 0.96, 0.84), borderColor: rgb(0.91, 0.77, 0.4), borderWidth: 0.8 });
  w.y -= 8;
  w.paragraph(noteText, { size: 10, x: MARGIN.left + 10, width: CONTENT_W - 20, after: 0 });
  w.y -= 18;

  w.paragraph(r.iAm, { size: 10, bold: true, after: 2 });
  w.rule(MARGIN.left + 12, w.y - 16, CONTENT_W - 12);
  w.y -= 26;
  w.checkbox(r.ownName, false);
  w.checkbox(r.onBehalf, false);
  w.paragraph(r.representedName, { size: 10, x: MARGIN.left + 21, width: CONTENT_W - 21, after: 2 });
  w.rule(MARGIN.left + 21, w.y - 16, CONTENT_W - 21);
  w.y -= 28;
  w.paragraph(r.wishes, { size: 10, after: 8 });
  w.paragraph(r.statement, { size: 10, after: 16 });
  await signatureTable(w, f, {});
  w.paragraph(`${m.code}: ${details.code}`, { size: 9, bold: true, color: GREY, after: 0 });

  // Footer on every page.
  w.pages.forEach((page, i) => {
    const footer = `${fill(m.page, { n: i + 1, total: w.pages.length })}  ·  ${m.code}: ${details.code}`;
    const size = 8;
    const width = fonts.regular.widthOfTextAtSize(footer, size);
    page.drawText(footer, { x: (PAGE.w - width) / 2, y: MARGIN.bottom - 26, size, font: fonts.regular, color: rgb(...GREY) });
  });

  return doc.save();
}
