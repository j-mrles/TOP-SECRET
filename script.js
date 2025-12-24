/* Town Trials — a tiny Pokémon-like 2D walk-around game (no assets, no deps).
   Walk to house doors, press Enter to open a challenge modal, clear 5 houses to reveal the secret. */

const STORAGE_KEY = "jm-town-trials:v3";

/** Customize these if you want different answers/challenges. */
const CONFIG = {
  // Houses 1..7 are challenges; House 8 is the finale.
  stepsTotal: 7,
  houses: [
    { step: 1, name: "Allgood, Alabama" },
    { step: 2, name: "Oneonta, Alabama" },
    { step: 3, name: "Allgood, Alabama" },
    { step: 4, name: "Cleveland" },
    { step: 5, name: "Durham, North Carolina" },
    { step: 6, name: "Wilmington, NC" },
    { step: 7, name: "Mebane, NC" },
    { step: 8, name: "Finale" },
  ],
  // Character look (tweak these colors anytime)
  playerPalette: {
    skin: "rgba(222, 170, 120, 0.98)", // medium-brown
    hair: "rgba(35, 24, 18, 0.98)", // dark brown/black
    hair2: "rgba(20, 14, 10, 0.98)",
    shirt: "rgba(245, 245, 245, 0.95)",
    pants: "rgba(30, 41, 59, 0.95)",
    shoe: "rgba(15, 23, 42, 0.95)",
    accent: "rgba(34, 197, 94, 0.9)",
  },
  answers: {
    // House 1
    c1_fullName: "javier morales",
    // House 2
    c2_initials: "JM",
    // House 3
    c3_word: "engagement",
    // House 4
    c4_name: "rosita pacheco",
    // House 5
    c5_state: "AL",
    // House 6
    c6_state: "NC",
    // House 7
    c7_passcode: "JM-RP",
  },
  // Finale secret (lightly obfuscated; not security)
  secretEncoded: "b2NlaGNhUCBhdGlzb1IgaHRpdyBkZWdhZ25lIHNpIHNlbGFyb00gcmVpdmFK",
  secretPrefix: "Secret unlocked:",
};

function $(sel) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
}

function normalize(s) {
  return String(s ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function clampInt(n, min, max) {
  const x = Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : min;
  return clamp(x, min, max);
}

function decodeSecret() {
  const base = atob(CONFIG.secretEncoded);
  return base.split("").reverse().join("");
}

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedStep: 1, solved: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { unlockedStep: 1, solved: {} };
    return {
      unlockedStep: clampInt(parsed.unlockedStep ?? 1, 1, CONFIG.stepsTotal + 1),
      solved: typeof parsed.solved === "object" && parsed.solved ? parsed.solved : {},
    };
  } catch {
    return { unlockedStep: 1, solved: {} };
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setMessage(text) {
  $("#messageText").textContent = text ?? "";
}

function setProgressUI(state) {
  const unlockedCount = Math.min(CONFIG.stepsTotal, Math.max(0, state.unlockedStep - 1));
  $("#progressText").textContent = `${unlockedCount}/${CONFIG.stepsTotal}`;
  const pct = Math.round((unlockedCount / CONFIG.stepsTotal) * 100);
  $("#progressFill").style.width = `${pct}%`;
  document.querySelector(".progress-bar")?.setAttribute("aria-valuenow", String(unlockedCount));

  const statusPill = $("#statusPill");
  if (unlockedCount === 0) statusPill.textContent = "Not started";
  else if (unlockedCount < CONFIG.stepsTotal) statusPill.textContent = "In progress";
  else statusPill.textContent = "All houses cleared";
}

/* =========================
   Modal (challenge UI)
   ========================= */

const modal = {
  overlay: null,
  title: null,
  desc: null,
  form: null,
  submit: null,
  hintBtn: null,
  hint: null,
  result: null,
  closeBtn: null,
  isOpen: false,
  currentStep: null,
};

function modalOpen(step, state) {
  modal.isOpen = true;
  modal.currentStep = step;
  modal.result.textContent = "";
  modal.hint.hidden = true;
  modal.hint.textContent = "";
  modal.form.innerHTML = "";

  // Finale (House 8): show the secret and nothing else
  if (step === CONFIG.stepsTotal + 1) {
    const unlocked = state.unlockedStep >= CONFIG.stepsTotal + 1;
    modal.title.textContent = CONFIG.houses.find((h) => h.step === 8)?.name ?? "Finale";
    modal.desc.textContent = unlocked
      ? "You made it. Here’s the secret:"
      : "Finale is locked. Clear all houses first.";
    modal.submit.textContent = "OK";
    modal.hintBtn.hidden = true;
    modal.hint.hidden = true;
    modal.form.innerHTML = unlocked
      ? `<div class="hint" style="background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3);">
           <strong>${CONFIG.secretPrefix}</strong> ${decodeSecret()}
         </div>`
      : "";
    modal.overlay.hidden = false;
    requestAnimationFrame(() => modal.closeBtn?.focus?.());
    return;
  }

  const cfg = getChallenge(step, state);
  modal.title.textContent = cfg.title;
  modal.desc.textContent = cfg.desc;
  modal.submit.textContent = cfg.submitLabel ?? "Submit";

  cfg.render(modal.form);
  modal.hint.textContent = cfg.hint;
  modal.hintBtn.hidden = !cfg.hint;

  modal.overlay.hidden = false;
  requestAnimationFrame(() => {
    const focusEl = modal.form.querySelector("input, button, [tabindex]") || modal.submit;
    focusEl?.focus?.();
  });
}

function modalClose() {
  modal.isOpen = false;
  modal.currentStep = null;
  modal.overlay.hidden = true;
  setMessage("Walk to a house door and press Enter.");
  $("#gameCanvas").focus?.();
}

function modalSetResult(kind, text) {
  modal.result.textContent = text;
  modal.result.style.color =
    kind === "ok"
      ? "rgba(224, 255, 238, 0.95)"
      : kind === "bad"
        ? "rgba(255, 210, 210, 0.95)"
        : "rgba(255, 255, 255, 0.72)";
}

function getChallenge(step, state) {
  const houseName = CONFIG.houses.find((h) => h.step === step)?.name ?? `House ${step}`;
  if (step === 1) {
    return {
      title: `${houseName} — Identity Check`,
      desc: "Enter the full name of the person this game is about.",
      hint: "First name: Javier. Last name: Morales.",
      render: (root) => {
        root.innerHTML = `
          <label class="field">
            <span class="field-label">Answer</span>
            <input id="c1" class="input" type="text" autocomplete="off" spellcheck="false" placeholder="Full name" />
          </label>
        `;
      },
      validate: () => normalize($("#c1").value) === normalize(CONFIG.answers.c1_fullName),
    };
  }

  if (step === 2) {
    return {
      title: `${houseName} — Initials Gate`,
      desc: "Pick the initials that match the name you entered.",
      hint: "Use the first letters of Javier and Morales.",
      render: (root) => {
        root.innerHTML = `
          <fieldset class="choices" aria-label="Initials choices">
            <label class="choice"><input type="radio" name="c2" value="JM" /> <span>JM</span></label>
            <label class="choice"><input type="radio" name="c2" value="MJ" /> <span>MJ</span></label>
            <label class="choice"><input type="radio" name="c2" value="JP" /> <span>JP</span></label>
            <label class="choice"><input type="radio" name="c2" value="RM" /> <span>RM</span></label>
          </fieldset>
        `;
      },
      validate: () => (document.querySelector('input[name="c2"]:checked')?.value ?? "") === CONFIG.answers.c2_initials,
    };
  }

  if (step === 3) {
    return {
      title: `${houseName} — The Promise Word`,
      desc: "Riddle: “I’m not a ring, but I often come before one. I’m a vow you can’t see, but you can feel.”",
      hint: "The stage before marriage. (Starts with “e”)",
      render: (root) => {
        root.innerHTML = `
          <label class="field">
            <span class="field-label">One word</span>
            <input id="c3" class="input" type="text" autocomplete="off" spellcheck="false" placeholder="Your answer" />
          </label>
        `;
      },
      validate: () => normalize($("#c3").value) === normalize(CONFIG.answers.c3_word),
    };
  }

  if (step === 4) {
    return {
      title: `${houseName} — Caesar Cipher`,
      desc: "Decode this (Caesar shift -3). It’s a name: URVLWD SDFKHFR",
      hint: "Shift each letter back 3. Example: D → A, C → Z.",
      render: (root) => {
        root.innerHTML = `
          <label class="field">
            <span class="field-label">Decoded name</span>
            <input id="c4" class="input" type="text" autocomplete="off" spellcheck="false" placeholder="First Last" />
          </label>
        `;
      },
      validate: () => normalize($("#c4").value) === normalize(CONFIG.answers.c4_name),
    };
  }

  if (step === 5) {
    return {
      title: `${houseName} — State Code`,
      desc: "Enter the 2-letter state code for Alabama.",
      hint: "Alabama → AL",
      submitLabel: "Unlock",
      render: (root) => {
        root.innerHTML = `
          <label class="field">
            <span class="field-label">Answer</span>
            <input id="c5" class="input" type="text" autocomplete="off" spellcheck="false" placeholder="AL" />
          </label>
        `;
      },
      validate: () => {
        const v = $("#c5").value.trim().toUpperCase().replace(/\s+/g, "");
        const expected = CONFIG.answers.c5_state.toUpperCase();
        return v === expected;
      },
    };
  }

  if (step === 6) {
    return {
      title: `${houseName} — State Code`,
      desc: "Enter the 2-letter state code for North Carolina.",
      hint: "North Carolina → NC",
      submitLabel: "Unlock",
      render: (root) => {
        root.innerHTML = `
          <label class="field">
            <span class="field-label">Answer</span>
            <input id="c6" class="input" type="text" autocomplete="off" spellcheck="false" placeholder="NC" />
          </label>
        `;
      },
      validate: () => {
        const v = $("#c6").value.trim().toUpperCase().replace(/\s+/g, "");
        const expected = CONFIG.answers.c6_state.toUpperCase();
        return v === expected;
      },
    };
  }

  if (step === 7) {
    const finaleUnlocked = state.unlockedStep >= CONFIG.stepsTotal + 1;
    return {
      title: `${houseName} — Final Passcode`,
      desc: finaleUnlocked
        ? "You already cleared this house. The finale is unlocked."
        : "Build the passcode from the initials of the two main names, in this format: JM-RP",
      hint: finaleUnlocked ? "" : "House 1 gives JM. House 4 gives initials RP.",
      submitLabel: finaleUnlocked ? "OK" : "Unlock Finale",
      render: (root) => {
        root.innerHTML = `
          <label class="field">
            <span class="field-label">Passcode</span>
            <input id="c7" class="input" type="text" autocomplete="off" spellcheck="false" placeholder="JM-RP" />
          </label>
        `;
      },
      validate: () => {
        if (finaleUnlocked) return true;
        const v = $("#c7").value.trim().toUpperCase().replace(/\s+/g, "");
        const expected = CONFIG.answers.c7_passcode.toUpperCase().replace(/\s+/g, "");
        return v === expected;
      },
    };
  }

  return {
    title: "Unknown",
    desc: "This house is empty.",
    hint: "",
    render: (root) => (root.textContent = ""),
    validate: () => false,
  };
}

function onModalSubmit(state) {
  const step = modal.currentStep;
  if (!step) return;
  if (step > state.unlockedStep) {
    modalSetResult("bad", "This house is locked.");
    return;
  }

  const cfg = getChallenge(step, state);
  const ok = cfg.validate();
  if (!ok) {
    modalSetResult("bad", "Not quite — try again (or use a hint).");
    return;
  }

  // Clearing house 5 unlocks finale (unlockedStep becomes 6)
  state.solved[String(step)] = true;
  state.unlockedStep = Math.max(state.unlockedStep, step + 1);
  writeState(state);
  setProgressUI(state);

  if (step === 7) {
    modalSetResult("ok", "Finale unlocked! Go to the Finale house.");
  } else {
    modalSetResult("ok", "Cleared! Next house unlocked.");
  }
}

/* =========================
   2D world + movement
   ========================= */

const WORLD = {
  tile: 24,
  // Bigger-than-screen world so it feels like a journey (camera follows player)
  w: 48,
  h: 42,
  // Player spawn in tiles (start in the Alabama hometown)
  // NOTE: must not spawn inside a solid (house/water/walls)
  spawn: { x: 10.5, y: 40.5 },
};

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function makeHouse(step, tx, ty) {
  // House footprint (in tiles): 5x4, door centered bottom
  const tile = WORLD.tile;
  const house = {
    step,
    name: CONFIG.houses.find((h) => h.step === step)?.name ?? `House ${step}`,
    // building rect (solid)
    rect: { x: tx * tile, y: ty * tile, w: 5 * tile, h: 4 * tile },
    // door interaction zone (non-solid, near the entrance)
    door: { x: (tx + 2) * tile, y: (ty + 4) * tile - 6, w: 1 * tile, h: 1 * tile },
    // where to stand to interact (a bit in front of door)
    interactPoint: { x: (tx + 2.5) * tile, y: (ty + 4.6) * tile },
  };
  return house;
}

function buildTown() {
  const tile = WORLD.tile;
  const bounds = { x: 0, y: 0, w: WORLD.w * tile, h: WORLD.h * tile };

  const houses = [
    // Alabama hometown (bottom)
    // Placed left→right along the bottom path (1→2→3), then 4 at the route gate.
    makeHouse(1, 6, 34), // Allgood, Alabama
    makeHouse(2, 19, 34), // Oneonta, Alabama
    makeHouse(3, 32, 34), // Allgood, Alabama
    makeHouse(4, 10, 26), // Cleveland (gate to the route)
    // North Carolina region (top)
    // Placed left→right on the top town row (5→6→7)
    makeHouse(5, 6, 8), // Durham, North Carolina
    makeHouse(6, 19, 8), // Wilmington, NC
    makeHouse(7, 32, 8), // Mebane, NC
    // Finale landmark (top-most)
    makeHouse(8, 19, 1), // Finale
  ];

  // Visual layers (non-colliding)
  const paths = [
    // Alabama town path
    { x: 4 * tile, y: 38 * tile, w: 40 * tile, h: 2 * tile },
    // Connector up to Cleveland (house 4)
    { x: 12 * tile, y: 30 * tile, w: 2 * tile, h: 8 * tile },
    // Route north (corridor)
    { x: 22 * tile, y: 12 * tile, w: 4 * tile, h: 18 * tile },
    { x: 12 * tile, y: 30 * tile, w: 14 * tile, h: 2 * tile }, // connector from 4 to route
    // NC town path
    { x: 6 * tile, y: 12 * tile, w: 36 * tile, h: 2 * tile },
    { x: 22 * tile, y: 4 * tile, w: 4 * tile, h: 8 * tile }, // to finale
  ];

  const waters = [
    // Lake near NC region
    { x: 36 * tile, y: 15 * tile, w: 8 * tile, h: 6 * tile },
    // Small pond in Alabama
    { x: 34 * tile, y: 30 * tile, w: 6 * tile, h: 4 * tile },
  ];

  const hedges = [
    { x: 0, y: 0, w: bounds.w, h: tile },
    { x: 0, y: bounds.h - tile, w: bounds.w, h: tile },
    { x: 0, y: 0, w: tile, h: bounds.h },
    { x: bounds.w - tile, y: 0, w: tile, h: bounds.h },
  ];

  // Solid “cliffs/rocks” that guide the journey. These must be visible in rendering (no invisible walls).
  const cliffs = [
    // Route walls (a shorter canyon corridor)
    { x: 20 * tile, y: 14 * tile, w: 2 * tile, h: 14 * tile },
    { x: 26 * tile, y: 14 * tile, w: 2 * tile, h: 14 * tile },
    // Blockers
    { x: 6 * tile, y: 22 * tile, w: 10 * tile, h: 2 * tile },
    { x: 34 * tile, y: 22 * tile, w: 10 * tile, h: 2 * tile },
  ];

  // Pokemon-like decor
  const tallGrass = [
    // Alabama patches
    { x: 4 * tile, y: 32 * tile, w: 6 * tile, h: 2 * tile },
    { x: 38 * tile, y: 36 * tile, w: 4 * tile, h: 2 * tile },
    // Route patches
    { x: 14 * tile, y: 18 * tile, w: 4 * tile, h: 3 * tile },
    { x: 30 * tile, y: 18 * tile, w: 4 * tile, h: 3 * tile },
    // NC patches
    { x: 6 * tile, y: 15 * tile, w: 6 * tile, h: 2 * tile },
    { x: 30 * tile, y: 15 * tile, w: 6 * tile, h: 2 * tile },
  ];

  const flowers = [
    { x: 10 * tile, y: 39 * tile },
    { x: 11 * tile, y: 39 * tile },
    { x: 12 * tile, y: 39 * tile },
    { x: 16 * tile, y: 11 * tile },
    { x: 17 * tile, y: 11 * tile },
    { x: 28 * tile, y: 11 * tile },
  ];

  const fences = [
    // Simple fence lines near Alabama homes
    { x: 4 * tile, y: 33 * tile, w: 1 * tile, h: 7 * tile },
    { x: 44 * tile, y: 33 * tile, w: 1 * tile, h: 7 * tile },
  ];

  const trees = [
    // Tree clusters that frame the world (solid)
    { x: 2 * tile, y: 28 * tile },
    { x: 3 * tile, y: 28 * tile },
    { x: 2 * tile, y: 29 * tile },
    { x: 44 * tile, y: 28 * tile },
    { x: 45 * tile, y: 28 * tile },
    { x: 45 * tile, y: 29 * tile },
    // Route trees
    { x: 12 * tile, y: 16 * tile },
    { x: 35 * tile, y: 16 * tile },
    // NC trees
    { x: 2 * tile, y: 6 * tile },
    { x: 3 * tile, y: 6 * tile },
    { x: 44 * tile, y: 6 * tile },
    { x: 45 * tile, y: 6 * tile },
  ];

  const solids = [...hedges, ...cliffs, ...fences];

  // Water is solid too
  waters.forEach((w) => solids.push(w));

  // houses are solid too (but doors are interact zones)
  houses.forEach((h) => solids.push(h.rect));

  // Trees are solid (block movement)
  trees.forEach((t) => solids.push({ x: t.x, y: t.y, w: tile, h: tile }));

  const signs = [
    { x: 10 * tile, y: 40 * tile, text: "START → Allgood / Oneonta" },
    { x: 12 * tile, y: 31 * tile, text: "↑ Cleveland (Route Gate)" },
    { x: 22 * tile, y: 26 * tile, text: "↑ ROUTE NORTH" },
    { x: 10 * tile, y: 12 * tile, text: "→ North Carolina" },
    { x: 23 * tile, y: 6 * tile, text: "↑ FINALE" },
  ];

  const regions = [
    { name: "Alabama (Hometown)", rect: { x: 0, y: 24 * tile, w: bounds.w, h: 18 * tile } },
    { name: "The Route", rect: { x: 0, y: 12 * tile, w: bounds.w, h: 12 * tile } },
    { name: "North Carolina", rect: { x: 0, y: 0, w: bounds.w, h: 12 * tile } },
  ];

  return { bounds, houses, solids, paths, waters, regions, signs, hedges, cliffs, tallGrass, flowers, fences, trees };
}

function isTypingTarget(el) {
  if (!(el instanceof Element)) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

function main() {
  // Wire modal DOM
  modal.overlay = $("#modalOverlay");
  modal.title = $("#modalTitle");
  modal.desc = $("#modalDesc");
  modal.form = $("#modalForm");
  modal.submit = $("#modalSubmitBtn");
  modal.hintBtn = $("#modalHintBtn");
  modal.hint = $("#modalHint");
  modal.result = $("#modalResult");
  modal.closeBtn = $("#modalCloseBtn");
  // Force closed on startup (some environments mishandle initial hidden state)
  modal.isOpen = false;
  modal.currentStep = null;
  modal.overlay.hidden = true;

  const state = readState();
  setProgressUI(state);

  const canvas = $("#gameCanvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");
  canvas.tabIndex = 0;

  const town = buildTown();
  const camera = { x: 0, y: 0 };
  let debugCollision = false;
  let joyVec = { x: 0, y: 0 };
  let joyActive = false;

  const player = {
    x: WORLD.spawn.x * WORLD.tile,
    y: WORLD.spawn.y * WORLD.tile,
    w: 14,
    h: 14,
    speed: 120, // px/s
    dir: "down",
    isMoving: false,
    animTime: 0,
  };

  const keys = new Set();
  let last = performance.now();
  let nearbyHouse = null;
  let nearbySign = null;

  // Touch UI (mobile joystick + action button)
  const touchControls = document.getElementById("touchControls");
  const joyBase = document.getElementById("joyBase");
  const joyKnob = document.getElementById("joyKnob");
  const actionBtn = document.getElementById("actionBtn");

  function isTouchDevice() {
    return (
      window.matchMedia?.("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      (navigator.maxTouchPoints ?? 0) > 0
    );
  }

  function setJoyKnob(nx, ny) {
    if (!joyKnob) return;
    // knob expects translate from center
    joyKnob.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
  }

  function resetJoystick() {
    joyVec = { x: 0, y: 0 };
    joyActive = false;
    setJoyKnob(0, 0);
  }

  function playerRectAt(x, y) {
    return { x: x - player.w / 2, y: y - player.h / 2, w: player.w, h: player.h };
  }

  function collides(rect) {
    for (const s of town.solids) {
      if (rectsOverlap(rect, s)) return true;
    }
    return false;
  }

  function ensurePlayerNotStuck() {
    // If we ever change map layout and accidentally spawn inside a solid,
    // gently search nearby tiles for a free spot.
    let r0 = playerRectAt(player.x, player.y);
    if (!collides(r0)) return;

    const tile = WORLD.tile;
    const startX = player.x;
    const startY = player.y;

    for (let radius = 1; radius <= 12; radius++) {
      for (let oy = -radius; oy <= radius; oy++) {
        for (let ox = -radius; ox <= radius; ox++) {
          const x = startX + ox * tile;
          const y = startY + oy * tile;
          const r = playerRectAt(x, y);
          if (!collides(r)) {
            player.x = x;
            player.y = y;
            return;
          }
        }
      }
    }
  }

  function validateReachability() {
    // Tile-based BFS to ensure the “journey” is actually completable.
    const tile = WORLD.tile;
    const cols = WORLD.w;
    const rows = WORLD.h;

    function nodeKey(cx, cy) {
      return `${cx},${cy}`;
    }

    function centerToWorld(cx, cy) {
      return { x: (cx + 0.5) * tile, y: (cy + 0.5) * tile };
    }

    function isFreeAt(cx, cy) {
      const p0 = centerToWorld(cx, cy);
      return !collides(playerRectAt(p0.x, p0.y));
    }

    const start = { cx: clampInt(Math.floor(player.x / tile), 0, cols - 1), cy: clampInt(Math.floor(player.y / tile), 0, rows - 1) };
    if (!isFreeAt(start.cx, start.cy)) return [`Spawn is blocked at (${start.cx},${start.cy}).`];

    const q = [start];
    const seen = new Set([nodeKey(start.cx, start.cy)]);

    while (q.length) {
      const cur = q.shift();
      const nbrs = [
        { cx: cur.cx + 1, cy: cur.cy },
        { cx: cur.cx - 1, cy: cur.cy },
        { cx: cur.cx, cy: cur.cy + 1 },
        { cx: cur.cx, cy: cur.cy - 1 },
      ];
      for (const n of nbrs) {
        if (n.cx < 0 || n.cy < 0 || n.cx >= cols || n.cy >= rows) continue;
        const k = nodeKey(n.cx, n.cy);
        if (seen.has(k)) continue;
        if (!isFreeAt(n.cx, n.cy)) continue;
        seen.add(k);
        q.push(n);
      }
    }

    const unreachable = [];
    for (const h of town.houses ?? []) {
      const targetCx = clampInt(Math.floor(h.interactPoint.x / tile), 0, cols - 1);
      const targetCy = clampInt(Math.floor(h.interactPoint.y / tile), 0, rows - 1);
      const k = nodeKey(targetCx, targetCy);
      if (!seen.has(k)) unreachable.push(`${h.name} (house ${h.step})`);
    }
    return unreachable;
  }

  function tryMove(dx, dy, dt) {
    const step = player.speed * dt;
    const nx = player.x + dx * step;
    const ny = player.y + dy * step;

    // Slide: attempt x then y
    const rx = playerRectAt(nx, player.y);
    if (!collides(rx)) player.x = nx;

    const ry = playerRectAt(player.x, ny);
    if (!collides(ry)) player.y = ny;

    // Clamp to bounds (inside hedges)
    player.x = clamp(player.x, WORLD.tile + 2, town.bounds.w - WORLD.tile - 2);
    player.y = clamp(player.y, WORLD.tile + 2, town.bounds.h - WORLD.tile - 2);
  }

  function updateCamera() {
    // Keep player near center, clamp camera to world bounds
    camera.x = clamp(player.x - canvas.width / 2, 0, town.bounds.w - canvas.width);
    camera.y = clamp(player.y - canvas.height / 2, 0, town.bounds.h - canvas.height);
  }

  function setLocationFromRegions() {
    const cx = player.x;
    const cy = player.y;
    const region = town.regions?.find((r) => rectsOverlap({ x: cx, y: cy, w: 1, h: 1 }, r.rect));
    $("#locationText").textContent = region?.name ?? "Journey";
  }

  function computeNearbyHouse() {
    let best = null;
    let bestD2 = Infinity;
    for (const h of town.houses) {
      const d2 = dist2(player.x, player.y, h.interactPoint.x, h.interactPoint.y);
      if (d2 < bestD2) {
        bestD2 = d2;
        best = h;
      }
    }
    // within ~28px
    if (best && bestD2 <= 28 * 28) return best;
    return null;
  }

  function computeNearbySign() {
    let best = null;
    let bestD = Infinity;
    for (const s of town.signs ?? []) {
      const d = dist(player.x, player.y, s.x, s.y);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    if (best && bestD <= 30) return best;
    return null;
  }

  function houseStatus(h) {
    // Finale (step 8) unlocks when state.unlockedStep reaches CONFIG.stepsTotal + 1
    if (h.step === CONFIG.stepsTotal + 1) {
      return state.unlockedStep >= CONFIG.stepsTotal + 1 ? "unlocked" : "locked";
    }
    if (h.step < state.unlockedStep) return "cleared";
    if (h.step === state.unlockedStep) return "unlocked";
    return "locked";
  }

  function drawHouseFireRed(ctx2, h, st) {
    // Visual-only. Collisions/doors stay driven by h.rect/h.door/h.interactPoint.
    const x = h.rect.x;
    const y = h.rect.y;
    const w = h.rect.w;
    const hh = h.rect.h;

    // Palette (slight tint by status, but still “normal houses”)
    const tint =
      st === "cleared" ? "rgba(34, 197, 94, 0.10)" : st === "unlocked" ? "rgba(139, 92, 246, 0.10)" : "transparent";
    const roof = "rgba(209, 90, 50, 0.95)";
    const roof2 = "rgba(168, 70, 38, 0.95)";
    const wall = "rgba(214, 199, 168, 0.95)";
    const wall2 = "rgba(186, 168, 140, 0.95)";
    const outline = "rgba(0,0,0,0.28)";
    const window = "rgba(59, 130, 246, 0.24)";
    const window2 = "rgba(59, 130, 246, 0.36)";
    const door = "rgba(120, 82, 45, 0.95)";
    const door2 = "rgba(92, 60, 32, 0.95)";

    // Roof area (top ~40% of house)
    const roofH = Math.round(hh * 0.42);
    ctx2.fillStyle = roof;
    ctx2.fillRect(x, y, w, roofH);
    // Roof tiles (simple bands)
    ctx2.fillStyle = roof2;
    for (let yy = y + 6; yy < y + roofH; yy += 10) {
      ctx2.fillRect(x + 4, yy, w - 8, 2);
    }
    // Roof ridge
    ctx2.fillStyle = "rgba(255,255,255,0.08)";
    ctx2.fillRect(x + 6, y + 6, w - 12, 3);

    // Walls
    ctx2.fillStyle = wall;
    ctx2.fillRect(x, y + roofH, w, hh - roofH);
    // Wall texture (vertical supports)
    ctx2.fillStyle = wall2;
    ctx2.fillRect(x + 6, y + roofH + 6, 2, hh - roofH - 12);
    ctx2.fillRect(x + w - 8, y + roofH + 6, 2, hh - roofH - 12);

    // Windows (two)
    const winY = y + roofH + 16;
    const winW = 20;
    const winH = 16;
    const win1X = x + 14;
    const win2X = x + w - 14 - winW;
    for (const wx of [win1X, win2X]) {
      ctx2.fillStyle = "rgba(0,0,0,0.18)";
      ctx2.fillRect(wx - 2, winY - 2, winW + 4, winH + 4);
      ctx2.fillStyle = window;
      ctx2.fillRect(wx, winY, winW, winH);
      ctx2.fillStyle = window2;
      ctx2.fillRect(wx + 2, winY + 2, winW - 4, 3);
      // window cross
      ctx2.fillStyle = "rgba(255,255,255,0.18)";
      ctx2.fillRect(wx + Math.floor(winW / 2) - 1, winY + 1, 2, winH - 2);
      ctx2.fillRect(wx + 1, winY + Math.floor(winH / 2) - 1, winW - 2, 2);
    }

    // Door (VISUAL): draw on the facade (do not use the interaction hitbox for placement)
    // This keeps interactibility the same while making the door look correctly attached to the house.
    const dw = 16;
    const dh = 18;
    const dx = Math.round(x + w / 2 - dw / 2);
    const dy = Math.round(y + hh - dh - 2);
    // doormat
    ctx2.fillStyle = "rgba(245, 158, 11, 0.12)";
    ctx2.fillRect(dx - 6, dy + dh - 2, dw + 12, 6);
    // door body
    ctx2.fillStyle = st === "locked" ? "rgba(255,255,255,0.10)" : door;
    ctx2.fillRect(dx, dy, dw, dh);
    ctx2.fillStyle = st === "locked" ? "rgba(255,255,255,0.12)" : door2;
    ctx2.fillRect(dx + 2, dy + 2, dw - 4, dh - 4);
    // knob
    ctx2.fillStyle = "rgba(255,255,255,0.30)";
    ctx2.fillRect(dx + dw - 5, dy + Math.floor(dh / 2), 2, 2);

    // Outline box
    ctx2.strokeStyle = outline;
    ctx2.lineWidth = 2;
    ctx2.strokeRect(x + 1, y + 1, w - 2, hh - 2);

    // Soft status tint overlay
    if (tint !== "transparent") {
      ctx2.fillStyle = tint;
      ctx2.fillRect(x + 1, y + 1, w - 2, hh - 2);
    }
  }

  function getHouseDoorVisual(h) {
    // Must match drawHouseFireRed() so the interaction marker points to the visual door.
    const x = h.rect.x;
    const y = h.rect.y;
    const w = h.rect.w;
    const hh = h.rect.h;
    const dw = 16;
    const dh = 18;
    const dx = Math.round(x + w / 2 - dw / 2);
    const dy = Math.round(y + hh - dh - 2);
    return { x: dx, y: dy, w: dw, h: dh };
  }

  function interact() {
    if (!nearbyHouse) {
      setMessage("Nothing to interact with here.");
      return;
    }

    const status = houseStatus(nearbyHouse);
    if (status === "locked") {
      setMessage(`${nearbyHouse.name} is locked. Clear the earlier houses first.`);
      return;
    }

    if (nearbyHouse.step === CONFIG.stepsTotal + 1) {
      setMessage("Entering Finale...");
    } else {
      setMessage(`Entering ${nearbyHouse.name}...`);
    }
    modalOpen(nearbyHouse.step, state);
  }

  function draw() {
    const tile = WORLD.tile;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky-ish vignette
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "rgba(10, 18, 40, 0.85)");
    grad.addColorStop(1, "rgba(6, 10, 18, 0.95)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Grass tiles (only draw what's visible)
    const startX = clampInt(Math.floor(camera.x / tile) - 2, 0, WORLD.w);
    const endX = clampInt(Math.ceil((camera.x + canvas.width) / tile) + 2, 0, WORLD.w);
    const startY = clampInt(Math.floor(camera.y / tile) - 2, 0, WORLD.h);
    const endY = clampInt(Math.ceil((camera.y + canvas.height) / tile) + 2, 0, WORLD.h);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const px = x * tile;
        const py = y * tile;
        const v = (x * 17 + y * 31) % 9;
        ctx.fillStyle = v < 2 ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.09)";
        ctx.fillRect(px, py, tile, tile);
      }
    }

    // Paths
    ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
    for (const p of town.paths ?? []) ctx.fillRect(p.x, p.y, p.w, p.h);

    // Water
    for (const w of town.waters ?? []) {
      ctx.fillStyle = "rgba(59, 130, 246, 0.18)";
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.32)";
      ctx.lineWidth = 2;
      ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
    }

    // Tall grass (Pokemon vibe; not solid)
    for (const g of town.tallGrass ?? []) {
      for (let yy = g.y; yy < g.y + g.h; yy += tile) {
        for (let xx = g.x; xx < g.x + g.w; xx += tile) {
          ctx.fillStyle = "rgba(34, 197, 94, 0.16)";
          ctx.fillRect(xx, yy, tile, tile);
          ctx.fillStyle = "rgba(34, 197, 94, 0.22)";
          // grass blades
          ctx.fillRect(xx + 3, yy + 6, 2, 12);
          ctx.fillRect(xx + 9, yy + 4, 2, 14);
          ctx.fillRect(xx + 15, yy + 7, 2, 11);
          ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
          ctx.fillRect(xx + 5, yy + 10, 10, 2);
        }
      }
    }

    // Cliffs / blockers (render as repeated rock tiles so they don't look like random rectangles)
    for (const c of town.cliffs ?? []) {
      for (let yy = c.y; yy < c.y + c.h; yy += tile) {
        for (let xx = c.x; xx < c.x + c.w; xx += tile) {
          // rock tile
          ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
          ctx.fillRect(xx, yy, tile, tile);
          ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
          ctx.fillRect(xx + 2, yy + 2, tile - 4, tile - 4);
          ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
          ctx.fillRect(xx + 5, yy + 5, tile - 10, tile - 10);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
          ctx.lineWidth = 2;
          ctx.strokeRect(xx + 1, yy + 1, tile - 2, tile - 2);
        }
      }
    }

    // Fences (solid)
    for (const f of town.fences ?? []) {
      for (let yy = f.y; yy < f.y + f.h; yy += tile) {
        for (let xx = f.x; xx < f.x + f.w; xx += tile) {
          ctx.fillStyle = "rgba(148, 163, 184, 0.16)";
          ctx.fillRect(xx, yy, tile, tile);
          ctx.fillStyle = "rgba(148, 163, 184, 0.45)";
          ctx.fillRect(xx + 4, yy + 6, tile - 8, 2);
          ctx.fillRect(xx + 4, yy + 12, tile - 8, 2);
          ctx.fillRect(xx + 6, yy + 4, 2, tile - 6);
          ctx.fillRect(xx + tile - 8, yy + 4, 2, tile - 6);
        }
      }
    }

    // Trees (solid)
    for (const t of town.trees ?? []) {
      const xx = t.x;
      const yy = t.y;
      // trunk
      ctx.fillStyle = "rgba(120, 82, 45, 0.95)";
      ctx.fillRect(xx + 9, yy + 12, 6, 10);
      // canopy
      ctx.fillStyle = "rgba(34, 197, 94, 0.28)";
      ctx.beginPath();
      ctx.arc(xx + 12, yy + 10, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 2;
      ctx.strokeRect(xx + 1, yy + 1, tile - 2, tile - 2);
    }

    // Flowers (not solid)
    for (const fl of town.flowers ?? []) {
      const xx = fl.x;
      const yy = fl.y;
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(xx, yy, tile, tile);
      ctx.fillStyle = "rgba(244, 114, 182, 0.9)";
      ctx.fillRect(xx + 10, yy + 9, 4, 4);
      ctx.fillStyle = "rgba(250, 204, 21, 0.9)";
      ctx.fillRect(xx + 11, yy + 10, 2, 2);
      ctx.fillStyle = "rgba(34, 197, 94, 0.5)";
      ctx.fillRect(xx + 11, yy + 13, 2, 7);
    }

    // Signposts (no floating text boxes)
    for (const s of town.signs ?? []) {
      const sx = s.x;
      const sy = s.y;
      // post
      ctx.fillStyle = "rgba(120, 82, 45, 0.95)";
      ctx.fillRect(sx - 2, sy - 6, 4, 10);
      // board
      ctx.fillStyle = "rgba(161, 111, 63, 0.95)";
      ctx.fillRect(sx - 10, sy - 16, 20, 10);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - 10 + 1, sy - 16 + 1, 20 - 2, 10 - 2);
      // nail
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(sx - 1, sy - 12, 2, 2);
    }

    // Houses
    for (const h of town.houses) {
      const st = houseStatus(h);

      drawHouseFireRed(ctx, h, st);

      // number badge
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(h.rect.x + 6, h.rect.y + 6, 18, 18);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "900 12px Inter, system-ui";
      ctx.fillText(String(h.step), h.rect.x + 12, h.rect.y + 20);

      // name label (so the journey is clear)
      const label = h.name || `House ${h.step}`;
      ctx.font = "800 11px Inter, system-ui";
      const tw = ctx.measureText(label).width;
      const lx = h.rect.x + h.rect.w / 2 - tw / 2;
      const ly = h.rect.y - 8;
      ctx.fillStyle = "rgba(0, 0, 0, 0.30)";
      ctx.fillRect(lx - 6, ly - 14, tw + 12, 18);
      ctx.fillStyle =
        st === "cleared"
          ? "rgba(224, 255, 238, 0.95)"
          : st === "unlocked"
            ? "rgba(235, 230, 255, 0.92)"
            : "rgba(255, 255, 255, 0.68)";
      ctx.fillText(label, lx, ly);
    }

    // Hedges (borders)
    ctx.fillStyle = "rgba(16, 185, 129, 0.22)";
    ctx.fillRect(0, 0, town.bounds.w, tile);
    ctx.fillRect(0, town.bounds.h - tile, town.bounds.w, tile);
    ctx.fillRect(0, 0, tile, town.bounds.h);
    ctx.fillRect(town.bounds.w - tile, 0, tile, town.bounds.h);

    // Player sprite (simple FireRed-ish walk cycle)
    drawPlayerSprite(ctx, player);

    // Interaction prompt marker
    if (nearbyHouse) {
      const st = houseStatus(nearbyHouse);
      const vd = getHouseDoorVisual(nearbyHouse);
      ctx.fillStyle = st === "locked" ? "rgba(255,255,255,0.35)" : "rgba(245,158,11,0.9)";
      ctx.beginPath();
      ctx.arc(vd.x + vd.w / 2, vd.y - 6, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Debug overlay: show collision rectangles
    if (debugCollision) {
      ctx.lineWidth = 2;
      for (const s of town.solids ?? []) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.65)";
        ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1);
      }
      // player collision box
      const pr = playerRectAt(player.x, player.y);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.9)";
      ctx.strokeRect(pr.x + 0.5, pr.y + 0.5, pr.w - 1, pr.h - 1);
    }

    ctx.restore();
  }

  function drawPlayerSprite(ctx2, p) {
    // Anchor sprite at "feet" point (center-ish like classic top-down RPGs)
    const scale = 2; // pixel-art scale
    const sw = 12; // sprite width in pixels
    const sh = 16; // sprite height in pixels
    const feetX = Math.round(p.x);
    const feetY = Math.round(p.y + 8);
    const x0 = feetX - Math.round((sw * scale) / 2);
    const y0 = feetY - sh * scale;

    // 3-frame walk cycle (0,1,2,1) only when moving
    const seq = [0, 1, 2, 1];
    const frame = p.isMoving ? seq[Math.floor(p.animTime * 10) % seq.length] : 1;

    const pal = CONFIG.playerPalette ?? {};
    const C = {
      outline: "rgba(0,0,0,0.35)",
      skin: pal.skin ?? "rgba(230, 200, 170, 0.98)",
      hair: pal.hair ?? "rgba(35, 24, 18, 0.98)",
      hair2: pal.hair2 ?? "rgba(20, 14, 10, 0.98)",
      shirt: pal.shirt ?? "rgba(245, 245, 245, 0.95)",
      pants: pal.pants ?? "rgba(30, 41, 59, 0.95)",
      shoe: pal.shoe ?? "rgba(15, 23, 42, 0.95)",
      accent: pal.accent ?? "rgba(34, 197, 94, 0.9)",
    };

    function px(x, y, w, h, color) {
      ctx2.fillStyle = color;
      ctx2.fillRect(x0 + x * scale, y0 + y * scale, w * scale, h * scale);
    }

    function outlineBox(x, y, w, h) {
      ctx2.strokeStyle = C.outline;
      ctx2.lineWidth = 1;
      ctx2.strokeRect(x0 + x * scale + 0.5, y0 + y * scale + 0.5, w * scale - 1, h * scale - 1);
    }

    // Shadow
    ctx2.fillStyle = "rgba(0,0,0,0.26)";
    ctx2.beginPath();
    ctx2.ellipse(p.x, p.y + 7, 9, 4, 0, 0, Math.PI * 2);
    ctx2.fill();

    // Leg swing offsets
    const swing = frame === 0 ? -1 : frame === 2 ? 1 : 0;

    // Base sprite layers (draw back-to-front)
    if (p.dir === "up") {
      // Legs
      px(4, 12 + swing, 2, 4, C.pants);
      px(6, 12 - swing, 2, 4, C.pants);
      px(4, 15, 2, 1, C.shoe);
      px(6, 15, 2, 1, C.shoe);

      // Torso/back
      px(3, 7, 6, 5, C.shirt);
      px(2, 8, 1, 3, C.shirt);
      px(9, 8, 1, 3, C.shirt);

      // Head + hair (back view)
      px(3, 2, 6, 5, C.hair);
      px(3, 5, 6, 2, C.hair2);
      outlineBox(3, 2, 6, 10);
      return;
    }

    if (p.dir === "down") {
      // Legs
      px(4, 12 - swing, 2, 4, C.pants);
      px(6, 12 + swing, 2, 4, C.pants);
      px(4, 15, 2, 1, C.shoe);
      px(6, 15, 2, 1, C.shoe);

      // Torso
      px(3, 7, 6, 5, C.shirt);
      px(2, 8, 1, 3, C.shirt);
      px(9, 8, 1, 3, C.shirt);

      // Head + face
      px(3, 2, 6, 5, C.skin);
      // Hairline
      px(3, 1, 6, 3, C.hair);
      px(3, 3, 6, 1, C.hair2);
      px(3, 4, 6, 1, C.hair); // fringe
      // Eyes
      px(4, 4, 1, 1, "rgba(0,0,0,0.65)");
      px(7, 4, 1, 1, "rgba(0,0,0,0.65)");
      // Accent (tiny badge)
      px(8, 8, 1, 1, C.accent);
      outlineBox(3, 2, 6, 10);
      return;
    }

    const facingRight = p.dir === "right";
    // Side view: mirror by shifting x
    const sx = facingRight ? 0 : 0; // we mirror by choosing features below

    // Legs (one in front, one behind)
    px(facingRight ? 5 : 5, 12 - swing, 2, 4, C.pants);
    px(facingRight ? 4 : 6, 12 + swing, 2, 4, "rgba(30, 41, 59, 0.8)");
    px(facingRight ? 5 : 5, 15, 2, 1, C.shoe);

    // Torso
    px(4, 7, 5, 5, C.shirt);
    // Arm swing (simple)
    px(facingRight ? 8 : 3, 8 + swing, 1, 3, C.shirt);

    // Head
    px(4, 2, 5, 5, C.skin);
    // Hair
    px(4, 1, 5, 3, C.hair);
    px(4, 3, 5, 1, C.hair2);
    // Hair fringe / nose direction
    px(facingRight ? 8 : 3, 4, 1, 1, C.hair);
    // Eye (single)
    px(facingRight ? 7 : 5, 4, 1, 1, "rgba(0,0,0,0.65)");

    // Outline-ish box
    outlineBox(3, 2, 6, 10);
    void sx;
  }

  function tick(now) {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;

    // Move unless modal open
    if (!modal.isOpen) {
      const up = keys.has("ArrowUp") || keys.has("w") || keys.has("W");
      const down = keys.has("ArrowDown") || keys.has("s") || keys.has("S");
      const left = keys.has("ArrowLeft") || keys.has("a") || keys.has("A");
      const right = keys.has("ArrowRight") || keys.has("d") || keys.has("D");

      let dx = 0;
      let dy = 0;
      if (up) dy -= 1;
      if (down) dy += 1;
      if (left) dx -= 1;
      if (right) dx += 1;

      // Prefer joystick when active or non-trivial
      const jx = joyVec.x;
      const jy = joyVec.y;
      const jMag = Math.hypot(jx, jy);
      if (jMag > 0.08) {
        dx = jx;
        dy = jy;
      } else {
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
      }

      if (dx !== 0 || dy !== 0) {
        if (Math.abs(dx) > Math.abs(dy)) player.dir = dx < 0 ? "left" : "right";
        else player.dir = dy < 0 ? "up" : "down";
        tryMove(dx, dy, dt);
        player.isMoving = true;
        player.animTime += dt;
      } else {
        player.isMoving = false;
        player.animTime = 0;
      }

      nearbyHouse = computeNearbyHouse();
      nearbySign = computeNearbySign();
      if (nearbyHouse) {
        const st = houseStatus(nearbyHouse);
        if (nearbyHouse.step === CONFIG.stepsTotal + 1) {
          $("#tipText").textContent =
            st === "locked" ? "Finale locked — clear all houses." : "Press Enter to see the Finale.";
        } else {
          $("#tipText").textContent =
            st === "locked"
              ? `${nearbyHouse.name} locked — clear earlier houses.`
              : `Press Enter to enter ${nearbyHouse.name}.`;
        }
      } else {
        const nextStep = clampInt(state.unlockedStep, 1, CONFIG.stepsTotal + 1);
        const nextName =
          nextStep === CONFIG.stepsTotal + 1
            ? CONFIG.houses.find((h) => h.step === 8)?.name ?? "Finale"
            : CONFIG.houses.find((h) => h.step === nextStep)?.name ?? `House ${nextStep}`;
        if (nearbySign?.text) $("#tipText").textContent = `Sign: ${nearbySign.text}`;
        else $("#tipText").textContent = `Next destination: ${nextName}`;
      }
    }
    if (modal.isOpen) {
      player.isMoving = false;
      player.animTime = 0;
    }

    updateCamera();
    setLocationFromRegions();
    draw();
    requestAnimationFrame(tick);
  }

  // Input
  window.addEventListener("keydown", (e) => {
    if (isTypingTarget(document.activeElement)) return;

    // Debug: toggle collision overlay
    if (e.key === "c" || e.key === "C") {
      debugCollision = !debugCollision;
      setMessage(debugCollision ? "Debug: collision overlay ON (press C to toggle)" : "Debug: collision overlay OFF");
      return;
    }

    if (e.key === "Escape") {
      if (modal.isOpen) modalClose();
      return;
    }

    if (modal.isOpen) return;

    if (e.key === "Enter") {
      e.preventDefault();
      interact();
      return;
    }

    if (e.key.startsWith("Arrow")) e.preventDefault();
    keys.add(e.key);
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.key);
  });

  // Modal interactions
  modal.closeBtn.addEventListener("click", modalClose);
  modal.overlay.addEventListener("click", (e) => {
    if (e.target === modal.overlay) modalClose();
  });
  modal.hintBtn.addEventListener("click", () => {
    modal.hint.hidden = !modal.hint.hidden;
  });
  modal.submit.addEventListener("click", () => onModalSubmit(state));

  // Enter-to-submit in modal, while still allowing Enter-to-interact outside
  modal.overlay.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (!modal.isOpen) return;
    if (isTypingTarget(document.activeElement)) {
      // allow enter to submit when typing in an input
      e.preventDefault();
      onModalSubmit(state);
    }
  });

  // Reset
  $("#resetBtn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = readState();
    state.unlockedStep = fresh.unlockedStep;
    state.solved = fresh.solved;
    writeState(state);
    setProgressUI(state);
    setMessage("Progress reset. Walk to House 1.");
    player.x = WORLD.spawn.x * WORLD.tile;
    player.y = WORLD.spawn.y * WORLD.tile;
    if (modal.isOpen) modalClose();
  });

  // Touch controls wiring
  if (touchControls && isTouchDevice()) {
    touchControls.hidden = false;
  }

  if (joyBase && joyKnob) {
    const radius = 44; // px from center
    let activePointerId = null;

    const getCenter = () => {
      const r = joyBase.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    };

    const onPointerDown = (e) => {
      if (modal.isOpen) return;
      joyActive = true;
      activePointerId = e.pointerId;
      joyBase.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!joyActive) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      const { cx, cy } = getCenter();
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const mag = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(radius, mag);
      const nx = (dx / mag) * clamped;
      const ny = (dy / mag) * clamped;
      setJoyKnob(nx, ny);

      // Normalize to [-1..1] with slight deadzone in tick
      joyVec = { x: nx / radius, y: ny / radius };
    };

    const onPointerUp = (e) => {
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      activePointerId = null;
      resetJoystick();
    };

    joyBase.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
  }

  if (actionBtn) {
    actionBtn.addEventListener("click", () => {
      if (modal.isOpen) return;
      interact();
    });
  }

  // Initial focus + message
  setMessage("Walk to House 1 and press Enter.");
  canvas.focus();
  ensurePlayerNotStuck();
  const unreachable = validateReachability();
  if (unreachable.length) {
    const panel = document.getElementById("debugPanel");
    const pre = document.getElementById("debugError");
    if (panel && pre) {
      panel.hidden = false;
      pre.textContent = `Map reachability warning:\n- ${unreachable.join("\n- ")}\n\n(Press C in-game to show collision boxes.)`;
    }
    setMessage("Map warning: some areas are unreachable. See the red debug panel.");
  }
  requestAnimationFrame(tick);
}

function showStartupError(err) {
  try {
    // eslint-disable-next-line no-console
    console.error(err);
    const panel = document.getElementById("debugPanel");
    const pre = document.getElementById("debugError");
    if (panel && pre) {
      panel.hidden = false;
      const msg = err instanceof Error ? `${err.message}\n\n${err.stack ?? ""}` : String(err);
      pre.textContent = msg.trim() || "Unknown error";
    } else {
      alert(`Startup error: ${err?.message ?? err}`);
    }
  } catch {
    // As a last resort
    // eslint-disable-next-line no-alert
    alert("Startup error. Open DevTools Console for details.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    main();
  } catch (err) {
    showStartupError(err);
  }
});

window.addEventListener("error", (e) => {
  showStartupError(e?.error ?? e?.message ?? e);
});

window.addEventListener("unhandledrejection", (e) => {
  showStartupError(e?.reason ?? e);
});


