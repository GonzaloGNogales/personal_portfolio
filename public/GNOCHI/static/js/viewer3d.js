/* ==================================================================
   Interactive 3D viewers (classic script, no modules).
   1) Sample explorer: ID/OOD result sets, 10 reactions per case.
   2) Latent interpolation: vertex-lerped playback of PC2 keyframes.
   Mesh data ships as .js files with base64 payloads (quantized
   uint16 against a bounding box) loaded via <script> injection, so
   everything works over http(s) AND straight from disk (file://).
   Requires: vendor/three.min.js + vendor/OrbitControls.js (r128).
=================================================================== */
(function () {
  "use strict";

  var COLORS = {
    conditioning: 0x8a56b4,
    reaction: 0x3d9a6e,
    ground: 0xe9e9ee,
  };

  var shared = { faces: null, scripts: {}, geometries: {} };

  /* ------------------------------------------------ data loading */
  function loadScript(url) {
    if (!shared.scripts[url]) {
      shared.scripts[url] = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = url;
        s.onload = function () { resolve(); };
        s.onerror = function () {
          delete shared.scripts[url];
          reject(new Error("Could not load " + url));
        };
        document.head.appendChild(s);
      });
    }
    return shared.scripts[url];
  }

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function dequantize(payload) {
    var u16 = new Uint16Array(b64ToBytes(payload.d).buffer);
    var b = payload.b;
    var out = new Float32Array(u16.length);
    var sx = (b[3] - b[0]) / 65535, sy = (b[4] - b[1]) / 65535, sz = (b[5] - b[2]) / 65535;
    for (var i = 0; i < u16.length; i += 3) {
      out[i] = b[0] + u16[i] * sx;
      out[i + 1] = b[1] + u16[i + 1] * sy;
      out[i + 2] = b[2] + u16[i + 2] * sz;
    }
    return out;
  }

  function getFaces() {
    if (shared.faces) return Promise.resolve(shared.faces);
    return loadScript("static/meshes/faces.js").then(function () {
      var u16 = new Uint16Array(b64ToBytes(window.MESH_FACES).buffer);
      shared.faces = new THREE.Uint16BufferAttribute(u16, 1);
      return shared.faces;
    });
  }

  function getData(key) {
    if (window.MESH_DATA && window.MESH_DATA[key]) {
      return Promise.resolve(window.MESH_DATA[key]);
    }
    return loadScript("static/meshes/" + key + ".js").then(function () {
      return window.MESH_DATA[key];
    });
  }

  function buildGeometry(positions) {
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(shared.faces);
    geo.computeVertexNormals();
    return geo;
  }

  function getGeometry(key, which) {
    var gkey = key + "#" + which;
    if (shared.geometries[gkey]) return Promise.resolve(shared.geometries[gkey]);
    return Promise.all([getData(key), getFaces()]).then(function (r) {
      if (!shared.geometries[gkey]) {
        var payload = which === "cond" ? r[0].cond : r[0].gen[parseInt(which, 10)];
        shared.geometries[gkey] = buildGeometry(dequantize(payload));
      }
      return shared.geometries[gkey];
    });
  }

  /* --------------------------------------------------- UI helpers */
  function overlayCtl(loadingId, hintId) {
    return {
      loading: function (on) {
        var el = document.getElementById(loadingId);
        if (el) el.style.display = on ? "flex" : "none";
      },
      fadeHint: function () {
        var el = document.getElementById(hintId);
        if (el) el.classList.add("fade-out");
      },
    };
  }

  function showError(container, message) {
    var el = document.createElement("div");
    el.className = "viewer-fallback";
    el.textContent = message;
    container.appendChild(el);
  }

  /* ------------------------------------------------ viewer factory */
  function createViewer(container, overlays) {
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 4 / 3, 0.05, 60);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc8c8cf, 0.72));
    var key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(2.5, 4, 3);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xffffff, 0.2);
    fill.position.set(-3, 1.5, -2.5);
    scene.add(fill);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;
    controls.addEventListener("start", function () {
      controls.autoRotate = false;
      overlays.fadeHint();
    });

    var condMesh = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshStandardMaterial({ color: COLORS.conditioning, roughness: 0.82, metalness: 0 })
    );
    var reactMesh = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshStandardMaterial({ color: COLORS.reaction, roughness: 0.82, metalness: 0 })
    );
    scene.add(condMesh);
    scene.add(reactMesh);

    var ground = new THREE.Mesh(
      new THREE.CircleGeometry(1, 56),
      new THREE.MeshBasicMaterial({ color: COLORS.ground })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    function resize() {
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(container);
    window.addEventListener("resize", resize);
    resize();

    var onFrame = null;
    var renderFrame = function () {
      if (onFrame) onFrame();
      controls.update();
      renderer.render(scene, camera);
    };

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        renderer.setAnimationLoop(entries[0].isIntersecting ? renderFrame : null);
      }, { threshold: 0.05 }).observe(container);
    } else {
      renderer.setAnimationLoop(renderFrame);
    }

    var v = {
      renderer: renderer, scene: scene, camera: camera, controls: controls,
      condMesh: condMesh, reactMesh: reactMesh, ground: ground,
      renderFrame: renderFrame,
      setOnFrame: function (fn) { onFrame = fn; },
      frame: function () {
        var box = new THREE.Box3().setFromObject(condMesh);
        box.union(new THREE.Box3().setFromObject(reactMesh));
        var center = box.getCenter(new THREE.Vector3());
        var size = box.getSize(new THREE.Vector3());
        var radius = Math.max(size.x, size.y, size.z) * 0.5;
        ground.position.set(center.x, box.min.y + 0.005, center.z);
        ground.scale.setScalar(radius * 2.4);
        controls.target.copy(center);
        var dist = radius * 3.1;
        camera.position.set(center.x + dist * 0.25, center.y + radius * 0.55, center.z + dist);
        camera.near = dist / 50;
        camera.far = dist * 20;
        camera.updateProjectionMatrix();
        controls.minDistance = radius * 1.3;
        controls.maxDistance = dist * 3;
        controls.update();
      },
    };
    return v;
  }

  /* ================================================ sample explorer */
  var explorer = { viewer: null, mode: null, scene: null, sampleIdx: 0, busy: false };

  function explorerKey() { return explorer.mode + "/" + explorer.scene; }

  function updateSampleLabel() {
    var el = document.getElementById("sample-count");
    var total = window.MESH_MANIFEST.modes[explorer.mode].scenes[explorer.scene].samples;
    el.textContent = "Sample " + (explorer.sampleIdx + 1) + " / " + total;
  }

  function loadCase(overlays) {
    if (explorer.busy) return;
    explorer.busy = true;
    overlays.loading(true);
    var key = explorerKey();
    Promise.all([getGeometry(key, "cond"), getGeometry(key, "0")])
      .then(function (geos) {
        explorer.sampleIdx = 0;
        explorer.viewer.condMesh.geometry = geos[0];
        explorer.viewer.reactMesh.geometry = geos[1];
        explorer.viewer.frame();
        updateSampleLabel();
      })
      .catch(function (err) { console.error("GNOCHI viewer:", err); })
      .then(function () {
        explorer.busy = false;
        overlays.loading(false);
      });
  }

  function resample(overlays) {
    if (explorer.busy || !explorer.scene) return;
    var total = window.MESH_MANIFEST.modes[explorer.mode].scenes[explorer.scene].samples;
    if (total < 2) return;
    var idx = Math.floor(Math.random() * total);
    if (idx === explorer.sampleIdx) idx = (idx + 1) % total;
    explorer.busy = true;
    overlays.loading(true);
    getGeometry(explorerKey(), String(idx))
      .then(function (geo) {
        explorer.sampleIdx = idx;
        explorer.viewer.reactMesh.geometry = geo;
        updateSampleLabel();
      })
      .catch(function (err) { console.error("GNOCHI viewer:", err); })
      .then(function () {
        explorer.busy = false;
        overlays.loading(false);
      });
  }

  function buildSceneChips(overlays) {
    var chips = document.getElementById("scene-chips");
    chips.innerHTML = "";
    var scenes = window.MESH_MANIFEST.modes[explorer.mode].scenes;
    Object.keys(scenes).forEach(function (sceneKey, i) {
      var btn = document.createElement("button");
      btn.className = "chip" + (i === 0 ? " active" : "");
      btn.type = "button";
      btn.textContent = scenes[sceneKey].name;
      btn.addEventListener("click", function () {
        if (explorer.busy || explorer.scene === sceneKey) return;
        chips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        btn.classList.add("active");
        explorer.scene = sceneKey;
        loadCase(overlays);
      });
      chips.appendChild(btn);
    });
    explorer.scene = Object.keys(scenes)[0];
  }

  function initExplorer() {
    var container = document.getElementById("viewer3d");
    if (!container) return;
    var overlays = overlayCtl("viewer-loading", "viewer-hint");
    try {
      explorer.viewer = createViewer(container, overlays);
    } catch (e) {
      console.error("GNOCHI viewer:", e);
      showError(container, "Your browser does not support WebGL, so the interactive 3D viewer cannot be shown.");
      return;
    }

    var toggle = document.getElementById("mode-toggle");
    Object.keys(window.MESH_MANIFEST.modes).forEach(function (mode, i) {
      var btn = document.createElement("button");
      btn.className = "mode-btn" + (i === 0 ? " active" : "");
      btn.type = "button";
      btn.textContent = window.MESH_MANIFEST.modes[mode].label;
      btn.addEventListener("click", function () {
        if (explorer.busy || explorer.mode === mode) return;
        toggle.querySelectorAll(".mode-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        explorer.mode = mode;
        buildSceneChips(overlays);
        loadCase(overlays);
      });
      toggle.appendChild(btn);
    });

    explorer.mode = Object.keys(window.MESH_MANIFEST.modes)[0];
    buildSceneChips(overlays);
    document.getElementById("resample-btn").addEventListener("click", function () { resample(overlays); });
    loadCase(overlays);
  }

  /* ============================================ latent interpolation */
  var interp = {
    viewer: null, key: null, data: null, frames: null, nFrames: 0,
    positions: null, t: 0, playing: false, lastNow: 0, busy: false,
  };
  var INTERP_RANGE_MAX = 1000;
  var INTERP_SWEEP_MS = 14000; // full path duration when playing

  function setInterpFrame(t) {
    // t in [0, nFrames-1], fractional: lerp between neighbouring keyframes
    var n = interp.nFrames;
    var lo = Math.min(Math.floor(t), n - 2);
    var frac = Math.min(Math.max(t - lo, 0), 1);
    var stride = 6890 * 3;
    var f = interp.frames;
    var a = lo * stride, b = (lo + 1) * stride;
    var pos = interp.positions.array;
    for (var i = 0; i < stride; i++) {
      pos[i] = f[a + i] + (f[b + i] - f[a + i]) * frac;
    }
    interp.positions.needsUpdate = true;
    interp.viewer.reactMesh.geometry.computeVertexNormals();
    interp.t = t;
    var range = document.getElementById("interp-range");
    range.value = Math.round((t / (n - 1)) * INTERP_RANGE_MAX);
  }

  function stopInterpPlay() {
    if (interp.playing) {
      interp.playing = false;
      document.getElementById("interp-play-icon").innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
  }

  function startInterpPlay() {
    interp.playing = true;
    interp.lastNow = performance.now();
    document.getElementById("interp-play-icon").innerHTML =
      '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  }

  function interpOnFrame() {
    if (!interp.playing || !interp.frames) return;
    var now = performance.now();
    var dt = now - interp.lastNow;
    interp.lastNow = now;
    var span = interp.nFrames - 1;
    var t = interp.t + interp.dir * (dt / INTERP_SWEEP_MS) * span;
    if (t >= span) { t = span; interp.dir = -1; }
    else if (t <= 0) { t = 0; interp.dir = 1; }
    setInterpFrame(t);
  }

  function loadInterp(key, overlays) {
    if (interp.busy) return;
    interp.busy = true;
    overlays.loading(true);
    stopInterpPlay();
    var mkey = "interp/" + key;
    Promise.all([getData(mkey), getFaces()])
      .then(function (r) {
        var data = r[0];
        interp.key = key;
        interp.data = data;
        interp.nFrames = data.frames.n;
        interp.frames = dequantize(data.frames);
        interp.viewer.condMesh.geometry = buildGeometry(dequantize(data.cond));
        var geo = new THREE.BufferGeometry();
        interp.positions = new THREE.Float32BufferAttribute(new Float32Array(6890 * 3), 3);
        geo.setAttribute("position", interp.positions);
        geo.setIndex(shared.faces);
        interp.viewer.reactMesh.geometry = geo;
        interp.dir = 1;
        setInterpFrame(0);
        interp.viewer.frame();
      })
      .catch(function (err) { console.error("GNOCHI interp:", err); })
      .then(function () {
        interp.busy = false;
        overlays.loading(false);
      });
  }

  function initInterp() {
    var container = document.getElementById("interp3d");
    if (!container) return;
    var overlays = overlayCtl("interp-loading", "interp-hint");
    try {
      interp.viewer = createViewer(container, overlays);
    } catch (e) {
      console.error("GNOCHI interp:", e);
      showError(container, "Your browser does not support WebGL, so the interactive interpolation cannot be shown.");
      return;
    }
    interp.viewer.setOnFrame(interpOnFrame);

    var chips = document.getElementById("interp-chips");
    var keys = Object.keys(window.MESH_MANIFEST.interp);
    keys.forEach(function (key, i) {
      var btn = document.createElement("button");
      btn.className = "chip" + (i === 0 ? " active" : "");
      btn.type = "button";
      btn.textContent = window.MESH_MANIFEST.interp[key].name;
      btn.addEventListener("click", function () {
        if (interp.busy || interp.key === key) return;
        chips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        btn.classList.add("active");
        loadInterp(key, overlays);
      });
      chips.appendChild(btn);
    });

    var range = document.getElementById("interp-range");
    range.max = INTERP_RANGE_MAX;
    range.addEventListener("input", function () {
      if (!interp.frames) return;
      stopInterpPlay();
      var t = (parseFloat(range.value) / INTERP_RANGE_MAX) * (interp.nFrames - 1);
      setInterpFrame(t);
    });

    document.getElementById("interp-play").addEventListener("click", function () {
      if (!interp.frames) return;
      if (interp.playing) stopInterpPlay();
      else startInterpPlay();
    });

    loadInterp(keys[0], overlays);
  }

  /* ------------------------------------------------------- start */
  document.addEventListener("DOMContentLoaded", function () {
    if (!window.MESH_MANIFEST || !window.MESH_MANIFEST.modes) {
      var c = document.getElementById("viewer3d");
      if (c) showError(c, "The 3D viewer data (static/js/manifest.js) failed to load.");
      return;
    }
    if (typeof THREE === "undefined" || !THREE.OrbitControls) {
      ["viewer3d", "interp3d"].forEach(function (id) {
        var c = document.getElementById(id);
        if (c) showError(c, "The 3D engine (static/js/vendor/) failed to load.");
      });
      return;
    }
    initExplorer();
    initInterp();
    window.__gnochiViewer = { explorer: explorer, interp: interp, shared: shared };
  });
})();
