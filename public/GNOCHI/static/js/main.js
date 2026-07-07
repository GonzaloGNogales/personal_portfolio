/* ==================================================================
   GNOCHI paper website
   ==================================================================
   LINKS: set a URL string to activate a button; leave null to show it
   in its "coming soon" state.
=================================================================== */
const LINKS = {
  paper: null,     // e.g. "https://doi.org/10.1111/cgf.XXXXX"
  code: "https://github.com/GonzaloGNogales/gnochi",      // e.g. "https://github.com/USER/gnochi"
  dataset: null,   // e.g. "https://huggingface.co/datasets/USER/gnochi"
};

const ICONS = {
  paper: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>',
  code: '<svg viewBox="0 0 24 24"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.57A12 12 0 0 0 12 .3z"/></svg>',
};

const HF = '<span class="hf-emoji" aria-hidden="true">\u{1F917}</span>';

const BUTTONS = [
  { key: "paper", label: "Paper", icon: ICONS.paper },
  { key: "code", label: "Code", icon: ICONS.code },
  { key: "dataset", label: "Dataset", icon: HF },
];

function buildLinkButtons() {
  const nav = document.getElementById("link-buttons");
  BUTTONS.forEach((b) => {
    const url = LINKS[b.key];
    if (url) {
      const a = document.createElement("a");
      a.className = "btn";
      a.innerHTML = `${b.icon}<span>${b.label}</span>`;
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      nav.appendChild(a);
    } else {
      const s = document.createElement("span");
      s.className = "btn soon";
      s.title = "Link available soon";
      s.innerHTML = `${b.icon}<span>${b.label}</span><span class="soon-tag">soon</span>`;
      nav.appendChild(s);
    }
  });
}

/* ------------------------------------------------- hero video swap
   The teaser (2.62:1) is the video cover. On click we grow the box
   to the video's 16:9 aspect while fading the video in, so there is
   no jump in size or aspect ratio. */
let videoStarted = false;

function startVideo() {
  if (videoStarted) return;
  videoStarted = true;
  const box = document.getElementById("video-box");
  const posterH = box.offsetHeight;

  const video = document.createElement("video");
  video.className = "hero-video";
  video.controls = true;
  video.playsInline = true;
  video.preload = "auto";
  const source = document.createElement("source");
  source.src = "static/videos/gnochi-video.mp4";
  source.type = "video/mp4";
  video.appendChild(source);

  box.style.height = `${posterH}px`;
  box.appendChild(video);
  box.classList.add("video-started");
  box.removeAttribute("role");
  box.removeAttribute("tabindex");

  const targetH = Math.round(box.clientWidth * 9 / 16);
  void box.offsetHeight; // commit the start height so the transition animates
  box.style.height = `${targetH}px`;
  video.classList.add("visible");

  video.play().catch(() => {});

  setTimeout(() => {
    box.querySelector(".poster")?.remove();
    box.querySelector(".play-btn")?.remove();
    box.querySelector(".watch-hint")?.remove();
    box.style.height = "";
    box.classList.add("video-settled");
  }, 700);
}

function initVideo() {
  const box = document.getElementById("video-box");
  box.addEventListener("click", () => { if (!videoStarted) startVideo(); });
  box.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && !videoStarted) {
      e.preventDefault();
      startVideo();
    }
  });
}

/* --------------------------------------------- ours vs BUDDI tabs */
const COMPARE = {
  basketball: { name: "Basketball", ours: [10, 16, 24, 26], buddi: [2, 29, 32, 40] },
  highfive: { name: "High five", ours: [7, 12, 20, 38], buddi: [1, 3, 22, 25] },
  dance: { name: "Dance", ours: [7, 9, 16, 21], buddi: [0, 9, 10, 26] },
};

function renderCompare(scene) {
  const content = document.getElementById("compare-content");
  const data = COMPARE[scene];
  let html = "";
  [["ours", "GNOCHI (ours)"], ["buddi", "BUDDI"]].forEach(([method, label]) => {
    html += `<div class="method-row"><span class="method-label ${method}">${label}</span><div class="compare-grid">`;
    data[method].forEach((f) => {
      const base = `static/images/sampling/${scene}/${method}/frame${f}`;
      html +=
        `<div class="pair">` +
        `<img src="${base}.jpg" alt="${label} sample for ${data.name}, front view" loading="lazy">` +
        `<img src="${base}-side.jpg" alt="${label} sample for ${data.name}, side view" loading="lazy">` +
        `</div>`;
    });
    html += "</div></div>";
  });
  content.innerHTML = html;
}

function initCompare() {
  const tabs = document.getElementById("compare-tabs");
  Object.keys(COMPARE).forEach((scene, i) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (i === 0 ? " active" : "");
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.textContent = COMPARE[scene].name;
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      renderCompare(scene);
    });
    tabs.appendChild(btn);
  });
  renderCompare("basketball");
}

/* ------------------------------------------- before/after slider
   Pointer-based: press or drag anywhere on the image to move the
   divider. Arrow keys work when the slider is focused. */
const CONTROLNET_EXAMPLES = [
  "dance000", "dance300", "dance500", "dance600",
  "hug000", "hug200", "hug400", "hug600",
  "fight76", "fight486", "fight828", "fight919",
  "patient26", "patient87", "patient265", "patient793",
];

let baPct = 50;

function setBAPosition(pct) {
  baPct = Math.max(0, Math.min(100, pct));
  document.getElementById("ba-over").style.clipPath = `inset(0 ${100 - baPct}% 0 0)`;
  document.getElementById("ba-divider").style.left = `${baPct}%`;
  document.getElementById("ba-wrap").setAttribute("aria-valuenow", Math.round(baPct));
}

function setBAExample(base) {
  document.getElementById("ba-under").src = `static/images/controlnet/${base}-gen.jpg`;
  document.getElementById("ba-over").src = `static/images/controlnet/${base}.jpg`;
  document.querySelectorAll("#controlnet-thumbs button").forEach((b) => {
    b.classList.toggle("active", b.dataset.base === base);
  });
}

function initBA() {
  const wrap = document.getElementById("ba-wrap");

  const pctFromEvent = (e) => {
    const rect = wrap.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };

  wrap.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    wrap.setPointerCapture(e.pointerId);
    setBAPosition(pctFromEvent(e));
  });
  wrap.addEventListener("pointermove", (e) => {
    if (e.buttons || wrap.hasPointerCapture?.(e.pointerId)) {
      if (e.buttons) setBAPosition(pctFromEvent(e));
    }
  });
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); setBAPosition(baPct - 4); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setBAPosition(baPct + 4); }
  });

  const thumbs = document.getElementById("controlnet-thumbs");
  CONTROLNET_EXAMPLES.forEach((base, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.base = base;
    btn.className = i === 0 ? "active" : "";
    btn.setAttribute("aria-label", `Show example ${base}`);
    btn.innerHTML = `<img src="static/images/controlnet/${base}-gen.jpg" alt="" loading="lazy">`;
    btn.addEventListener("click", () => setBAExample(base));
    thumbs.appendChild(btn);
  });
  setBAPosition(50);
}

/* ------------------------------------------------------ bibtex copy */
function initBibtex() {
  document.getElementById("copy-bibtex").addEventListener("click", () => {
    const text = document.getElementById("bibtex-text").textContent;
    const done = () => {
      const label = document.getElementById("copy-label");
      label.textContent = "Copied!";
      setTimeout(() => { label.textContent = "Copy"; }, 1800);
    };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* noop */ }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
  });
}

/* -------------------------------------------------------------- go */
document.addEventListener("DOMContentLoaded", () => {
  buildLinkButtons();
  initVideo();
  initCompare();
  initBA();
  initBibtex();
});
