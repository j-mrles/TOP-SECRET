/* Town Trials — a tiny Pokémon-like 2D walk-around game (no assets, no deps).
   Walk to house doors, press Enter to open a challenge modal, clear 5 houses to reveal the secret. */

const STORAGE_KEY = "jm-town-trials:v3";
const LANG_KEY = "jm-town-trials:lang:v1";

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
    c1_fullName: "Francisco Javier Morales Duarte",
    c1_dob: "December 27, 2001",
    // House 2
    c2_age_left_al_to_nc: "15",
    c2_first_job: "sears",
    c2_first_job_role: "tools specialist",
    // House 3
    c3_first_car: "2010 dodge challenger",
    c3_after_sears_job1: "grocery store",
    c3_after_sears_job2: "busser",
    c3_after_sears_context: "french restaurant downtown",
    // House 4
    c4_career_1: "photographer",
    c4_career_2: "journalist",
    c4_career_3: "engineer",
    c4_money_to_wilmington: "2000",
    // House 5
    c5_money_after_first_year: "0",
    c5_first_tech_job_where: "liberty healthcare",
    c5_major: "computer science",
    c5_concentration: "software engineering",
    c5_minor: "cybersecurity",
    // House 6
    c6_role: "software engineer",
    c6_company: "megacorp logistics",
    c6_car: "tesla model 3",
    c6_purchase: "house",
    // House 7
    c7_passcode: "JM-RP",
  },
  // Finale secret (lightly obfuscated; not security)
  secretEncoded: "b2NlaGNhUCBhdGlzb1IgaHRpdyBkZWdhZ25lIHNpIHNlbGFyb00gcmVpdmFK",
  secretPrefix: "Secret unlocked:",
};

const I18N = {
  en: {
    brandTitle: "Town Trials",
    brandSubtitle: "Walk → enter houses → solve challenges → unlock the secret",
    reset: "Reset",
    controlsTitle: "Controls",
    controlsMove: "Move",
    controlsInteract: "Interact",
    controlsClose: "Close",
    footerText: "This is a static site (no server). Progress is saved locally on this device.",
    langTitle: "Choose language",
    langDesc: "Select English or Español to start.",
    introTitle: "Welcome to Javi’s Life",
    introBody:
      "A game where you explore the journey of life — walk the map, enter houses, answer questions, and reach the finale.",
    introStart: "Start",
    modalClose: "Close",
    modalBack: "Back",
    modalHint: "Hint",
    modalSubmit: "Submit",
    wizardNext: "Next",
    wizardUnlock: "Unlock",
    wizardUnlockFinale: "Unlock Finale",
    tipWalkToDoor: "Walk to a house door and press Enter.",
    tipNextDestination: (name) => `Next destination: ${name}`,
    msgNothingHere: "Nothing to interact with here.",
    msgLockedHouse: (name) => `${name} is locked. Clear the earlier houses first.`,
    msgEntering: (name) => `Entering ${name}...`,
    msgEnteringFinale: "Entering Finale...",
    msgPickToContinue: "Pick an option to continue.",
    msgTryAgain: "Not quite — try again (or use a hint).",
    msgCleared: "Cleared! Next house unlocked.",
    msgFinaleUnlocked: "Finale unlocked! Go to the Finale house.",
    msgReset: "Progress reset. Walk to House 1.",
    msgMounted: (label) => `Riding: ${label}. (Press Enter/A to dismount when not at a house.)`,
    msgDismounted: "Dismounted.",
    msgVehicleLocked: (n, label) => `Locked: clear House ${n} to ride the ${label}.`,
    tipRidePrompt: (label) => `Press Enter/A to ride: ${label}`,
    tipRiding: "Riding — press Enter/A to dismount (when not at a house).",
    tipFish: "Press Enter/A to fish",
    fish1: "Fishing... 1",
    fish2: "Fishing... 2",
    fish3: "Fishing... 3",
    fishBoom: (fish) => `Boom! Caught a ${fish}.`,
    fishCancelled: "Fishing cancelled.",
    finaleLockedTip: "Finale locked — clear all houses.",
    pressEnterSeeFinale: "Press Enter to see the Finale.",
    houseLockedTip: (name) => `${name} locked — clear earlier houses.`,
    pressEnterEnterHouse: (name) => `Press Enter to enter ${name}.`,
    signPrefix: "Sign:",
    debugCollisionOn: "Debug: collision overlay ON (press C to toggle)",
    debugCollisionOff: "Debug: collision overlay OFF",
    finalePrompt: "Do you want to know the finale? Type YES.",
    finaleLocked: "Finale is locked. Clear all houses first.",
    finaleRevealBtn: "Reveal",
    finaleOk: "OK",
    finaleTypeYes: "Type YES to reveal",
    finaleTypeYesError: "Type YES to reveal the finale.",
    finaleCaption: "Rosita and Javier are engaged.",
    pickCorrectAnswers: "Pick the correct answers.",
    houseLocked: "This house is locked.",
    alreadyClearedFinaleUnlocked: "You already cleared this house. The finale is unlocked.",
    threeQuestionsInThisHouse: "Three questions in this house.",
    houseTitles: {
      1: "Identity Check",
      2: "The Move + First Job",
      3: "First Car + Next Jobs",
      4: "Career + Wilmington",
      5: "First Tech Job + Studies",
      6: "Right Now",
      7: "The Finale Key",
    },
  },
  es: {
    brandTitle: "Pruebas del Pueblo",
    brandSubtitle: "Camina → entra a casas → resuelve retos → desbloquea el secreto",
    reset: "Reiniciar",
    controlsTitle: "Controles",
    controlsMove: "Mover",
    controlsInteract: "Interactuar",
    controlsClose: "Cerrar",
    footerText: "Este sitio es estático (sin servidor). El progreso se guarda localmente en este dispositivo.",
    langTitle: "Elige idioma",
    langDesc: "Selecciona English o Español para comenzar.",
    introTitle: "Bienvenido a la vida de Javi",
    introBody:
      "Un juego donde exploras el viaje de la vida — camina por el mapa, entra a casas, contesta preguntas y llega al final.",
    introStart: "Empezar",
    modalClose: "Cerrar",
    modalBack: "Atrás",
    modalHint: "Pista",
    modalSubmit: "Enviar",
    wizardNext: "Siguiente",
    wizardUnlock: "Desbloquear",
    wizardUnlockFinale: "Desbloquear Final",
    tipWalkToDoor: "Camina a la puerta de una casa y presiona Enter.",
    tipNextDestination: (name) => `Siguiente destino: ${name}`,
    msgNothingHere: "No hay nada con qué interactuar aquí.",
    msgLockedHouse: (name) => `${name} está cerrada. Primero completa las casas anteriores.`,
    msgEntering: (name) => `Entrando a ${name}...`,
    msgEnteringFinale: "Entrando al Final...",
    msgPickToContinue: "Elige una opción para continuar.",
    msgTryAgain: "Casi — intenta de nuevo (o usa una pista).",
    msgCleared: "¡Completado! La siguiente casa se desbloqueó.",
    msgFinaleUnlocked: "¡Final desbloqueado! Ve a la casa Final.",
    msgReset: "Progreso reiniciado. Ve a la Casa 1.",
    msgMounted: (label) => `Conduciendo: ${label}. (Presiona Enter/A para bajarte si no estás en una casa.)`,
    msgDismounted: "Te bajaste.",
    msgVehicleLocked: (n, label) => `Bloqueado: completa la Casa ${n} para usar ${label}.`,
    tipRidePrompt: (label) => `Presiona Enter/A para usar: ${label}`,
    tipRiding: "Conduciendo — presiona Enter/A para bajarte.",
    tipFish: "Presiona Enter/A para pescar",
    fish1: "Pescando... 1",
    fish2: "Pescando... 2",
    fish3: "Pescando... 3",
    fishBoom: (fish) => `¡Boom! Atrapaste un ${fish}.`,
    fishCancelled: "Pesca cancelada.",
    finaleLockedTip: "Final bloqueado — completa todas las casas.",
    pressEnterSeeFinale: "Presiona Enter para ver el Final.",
    houseLockedTip: (name) => `${name} bloqueada — completa las casas anteriores.`,
    pressEnterEnterHouse: (name) => `Presiona Enter para entrar a ${name}.`,
    signPrefix: "Letrero:",
    debugCollisionOn: "Debug: colisiones ACTIVADAS (presiona C para alternar)",
    debugCollisionOff: "Debug: colisiones DESACTIVADAS",
    finalePrompt: "¿Quieres saber el final? Escribe YES.",
    finaleLocked: "El final está bloqueado. Primero completa todas las casas.",
    finaleRevealBtn: "Revelar",
    finaleOk: "OK",
    finaleTypeYes: "Escribe YES para revelar",
    finaleTypeYesError: "Escribe YES para revelar el final.",
    finaleCaption: "Rosita y Javier están comprometidos.",
    pickCorrectAnswers: "Elige las respuestas correctas.",
    houseLocked: "Esta casa está bloqueada.",
    alreadyClearedFinaleUnlocked: "Ya completaste esta casa. El final ya está desbloqueado.",
    threeQuestionsInThisHouse: "Tres preguntas en esta casa.",
    houseTitles: {
      1: "Identidad",
      2: "La Mudanza + Primer Trabajo",
      3: "Primer Carro + Siguientes Trabajos",
      4: "Carrera + Wilmington",
      5: "Primer Trabajo Tech + Estudios",
      6: "Hoy en día",
      7: "La Llave del Final",
    },
  },
};

let currentLang = "en";
function t(key, ...args) {
  const dict = I18N[currentLang] ?? I18N.en;
  const val = dict[key];
  if (typeof val === "function") return val(...args);
  return val ?? key;
}

function setLang(lang) {
  currentLang = lang === "es" ? "es" : "en";
  try {
    localStorage.setItem(LANG_KEY, currentLang);
  } catch {
    // ignore
  }
}

function getLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

function applyI18nToDom() {
  // Header / HUD / footer
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setText("brandTitle", t("brandTitle"));
  setText("brandSubtitle", t("brandSubtitle"));
  setText("resetBtn", t("reset"));
  setText("controlsTitle", t("controlsTitle"));
  setText("controlsMove", t("controlsMove"));
  setText("controlsInteract", t("controlsInteract"));
  setText("controlsClose", t("controlsClose"));
  setText("footerText", t("footerText"));
  setText("langTitle", t("langTitle"));
  setText("langDesc", t("langDesc"));
  setText("introTitle", t("introTitle"));
  setText("introStartBtn", t("introStart"));
  const introBody = document.querySelector("#introOverlay .modal-body p");
  if (introBody) introBody.textContent = t("introBody");
  setText("modalCloseBtn", t("modalClose"));
  setText("modalBackBtn", t("modalBack"));
  setText("modalHintBtn", t("modalHint"));
}

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

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMcq(root, questions) {
  root.innerHTML = questions
    .map((q, idx) => {
      const name = `mcq_${q.id}`;
      const legend = escapeHtml(q.prompt ?? `Question ${idx + 1}`);
      const options = (q.options ?? [])
        .map((opt) => {
          const value = escapeHtml(opt.value);
          const label = escapeHtml(opt.label ?? opt.value);
          return `<label class="choice"><input type="radio" name="${name}" value="${value}" /> <span>${label}</span></label>`;
        })
        .join("");
      return `
        <div class="field">
          <div class="field-label">${legend}</div>
          <fieldset class="choices" aria-label="${legend}">
            ${options}
          </fieldset>
        </div>
      `;
    })
    .join("");
}

function validateMcq(questions, answersOverride) {
  function isCorrect(val, correct) {
    const v = normalize(val);
    if (Array.isArray(correct)) return correct.some((c) => normalize(c) === v);
    return normalize(correct) === v;
  }

  for (const q of questions) {
    let val = "";
    if (answersOverride) {
      val = answersOverride[q.id] ?? "";
    } else {
      const name = `mcq_${q.id}`;
      const checked = document.querySelector(`input[name="${CSS.escape(name)}"]:checked`);
      val = checked?.value ?? "";
    }
    if (!isCorrect(val, q.correct)) return false;
  }
  return true;
}

function normalizeDob(s) {
  // Accepts "December 27, 2001" OR "Dec 27 2001" OR "12/27/2001" (and similar).
  const raw = normalize(s).replace(/,/g, "");
  if (!raw) return "";

  // Numeric formats: mm/dd/yyyy or mm-dd-yyyy
  const m1 = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m1) {
    const mm = String(m1[1]).padStart(2, "0");
    const dd = String(m1[2]).padStart(2, "0");
    const yyyy = m1[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  // Month name formats: month day year
  const months = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    sept: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  const parts = raw.split(" ");
  if (parts.length >= 3) {
    const month = months[parts[0]];
    const day = parts[1]?.replace(/\D/g, "");
    const year = parts[2]?.replace(/\D/g, "");
    if (month && day && year && year.length === 4) {
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      return `${year}-${mm}-${dd}`;
    }
  }

  // Fallback: normalized string
  return raw;
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
      fishCaught: clampInt(parsed.fishCaught ?? 0, 0, 999999),
    };
  } catch {
    return { unlockedStep: 1, solved: {}, fishCaught: 0 };
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
  backBtn: null,
  hintBtn: null,
  hint: null,
  result: null,
  closeBtn: null,
  isOpen: false,
  currentStep: null,
  wizard: null,
  finaleMode: null,
  autoCloseTimer: null,
};

function clearModalAutoClose() {
  if (modal.autoCloseTimer) {
    clearTimeout(modal.autoCloseTimer);
    modal.autoCloseTimer = null;
  }
}

function scheduleModalAutoClose(ms) {
  clearModalAutoClose();
  modal.autoCloseTimer = setTimeout(() => {
    modal.autoCloseTimer = null;
    // Only close if we're still open
    if (modal.isOpen) modalClose();
  }, ms);
}

function wizardInit(cfg) {
  modal.wizard = {
    questions: cfg.questions,
    idx: 0,
    answers: {},
    desc: cfg.desc ?? "",
    hint: cfg.hint ?? "",
    finalLabel: cfg.submitLabel ?? "Submit",
  };
}

function wizardStoreCurrentAnswer() {
  const wz = modal.wizard;
  if (!wz) return;
  const q = wz.questions[wz.idx];
  if (!q) return;
  const name = `mcq_${q.id}`;
  const checked = modal.form.querySelector(`input[name="${CSS.escape(name)}"]:checked`);
  const val = checked?.value ?? "";
  if (val) wz.answers[q.id] = val;
}

function wizardHasCurrentAnswer() {
  const wz = modal.wizard;
  if (!wz) return false;
  const q = wz.questions[wz.idx];
  if (!q) return false;
  return Boolean(wz.answers[q.id]);
}

function renderWizardQuestion() {
  const wz = modal.wizard;
  if (!wz) return;
  const q = wz.questions[wz.idx];
  if (!q) return;

  // Render ONE question
  renderMcq(modal.form, [q]);

  // Restore selection (if previously chosen)
  const saved = wz.answers[q.id];
  if (saved) {
    const name = `mcq_${q.id}`;
    const input = modal.form.querySelector(
      `input[name="${CSS.escape(name)}"][value="${CSS.escape(saved)}"]`,
    );
    if (input) input.checked = true;
  }

  // Store selection on change
  modal.form.onchange = () => wizardStoreCurrentAnswer();

  // Update UI
  if (modal.backBtn) modal.backBtn.hidden = wz.idx === 0;
  if (modal.hintBtn) modal.hintBtn.hidden = !wz.hint;
  if (modal.hint) {
    modal.hint.textContent = wz.hint ?? "";
    modal.hint.hidden = true;
  }
  modal.result.textContent = "";

  const progress = `Question ${wz.idx + 1}/${wz.questions.length}`;
  modal.desc.textContent = wz.desc ? `${wz.desc} (${progress})` : progress;

  if (modal.submit) {
    modal.submit.textContent =
      wz.idx === wz.questions.length - 1 ? (wz.finalLabel ?? t("modalSubmit")) : t("wizardNext");
  }
}

function modalOpen(step, state) {
  modal.isOpen = true;
  modal.currentStep = step;
  modal.result.textContent = "";
  modal.hint.hidden = true;
  modal.hint.textContent = "";
  modal.form.innerHTML = "";
  modal.wizard = null;
  modal.finaleMode = null;
  clearModalAutoClose();

  // Finale (House 8): show the secret and nothing else
  if (step === CONFIG.stepsTotal + 1) {
    const unlocked = state.unlockedStep >= CONFIG.stepsTotal + 1;
    modal.title.textContent = CONFIG.houses.find((h) => h.step === 8)?.name ?? "Finale";
    modal.desc.textContent = unlocked ? t("finalePrompt") : t("finaleLocked");
    modal.submit.textContent = unlocked ? t("finaleRevealBtn") : t("finaleOk");
    modal.hintBtn.hidden = true;
    modal.hint.hidden = true;
    if (modal.backBtn) modal.backBtn.hidden = true;
    modal.finaleMode = unlocked ? "confirm" : "locked";
    modal.form.innerHTML = unlocked
      ? `
        <label class="field">
          <span class="field-label">${escapeHtml(t("finaleTypeYes"))}</span>
          <input id="finale_yes" class="input" type="text" autocomplete="off" spellcheck="false" placeholder="yes" />
        </label>
      `
      : "";
    modal.overlay.hidden = false;
    requestAnimationFrame(() => (unlocked ? document.getElementById("finale_yes")?.focus?.() : modal.closeBtn?.focus?.()));
    return;
  }

  const cfg = getChallenge(step, state);
  modal.title.textContent = cfg.title;
  if (cfg.questions && Array.isArray(cfg.questions) && cfg.questions.length) {
    wizardInit(cfg);
    renderWizardQuestion();
  } else {
    modal.desc.textContent = cfg.desc;
    modal.submit.textContent = cfg.submitLabel ?? "Submit";
    cfg.render(modal.form);
    modal.hint.textContent = cfg.hint;
    modal.hintBtn.hidden = !cfg.hint;
    if (modal.backBtn) modal.backBtn.hidden = true;
  }

  modal.overlay.hidden = false;
  requestAnimationFrame(() => {
    const focusEl = modal.form.querySelector("input, button, [tabindex]") || modal.submit;
    focusEl?.focus?.();
  });
}

function modalClose() {
  modal.isOpen = false;
  modal.currentStep = null;
  modal.wizard = null;
  modal.finaleMode = null;
  clearModalAutoClose();
  modal.overlay.hidden = true;
  setMessage(t("tipWalkToDoor"));
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
  const isEs = currentLang === "es";
  const txt = (en, es) => (isEs ? es : en);
  const houseTitle = (n) => (I18N[currentLang]?.houseTitles?.[n] ?? I18N.en.houseTitles?.[n] ?? "");
  if (step === 1) {
    const questions = [
      {
        id: "1_name",
        prompt: txt("Full name", "Nombre completo"),
        options: [
          { value: "A", label: "Francisco Javier Morales Duarte" },
          { value: "B", label: "Javier Morales" },
          { value: "C", label: "Francisco Morales Duarte" },
          { value: "D", label: "Francisco Javier Duarte" },
        ],
        correct: "A",
      },
      {
        id: "1_dob",
        prompt: txt("Date of birth", "Fecha de nacimiento"),
        options: [
          { value: "A", label: "December 27, 2001" },
          { value: "B", label: "December 27, 2000" },
          { value: "C", label: "November 27, 2001" },
          { value: "D", label: "December 17, 2001" },
        ],
        correct: "A",
      },
    ];
    return {
      title: `${houseName} — ${houseTitle(1)}`,
      desc: t("pickCorrectAnswers"),
      hint: txt(
        "Hint: The correct full name includes a second last name (Duarte). For the DOB, the year ends with “01”.",
        "Pista: El nombre correcto incluye un segundo apellido (Duarte). Para la fecha, el año termina en “01”."
      ),
      questions,
      submitLabel: t("wizardUnlock"),
      render: (root) => renderMcq(root, [questions[0]]),
      validate: () => validateMcq(questions),
    };
  }

  if (step === 2) {
    const questions = [
      {
        id: "2_age",
        prompt: txt(
          "What age did I leave Alabama to go to North Carolina?",
          "¿A qué edad dejé Alabama para irme a Carolina del Norte?"
        ),
        options: [
          { value: "A", label: "14" },
          { value: "B", label: "15" },
          { value: "C", label: "16" },
          { value: "D", label: "17" },
        ],
        correct: "B",
      },
      {
        id: "2_job",
        prompt: txt("What was my first job?", "¿Cuál fue mi primer trabajo?"),
        options: [
          { value: "A", label: txt("Sears — Tools Specialist", "Sears — Especialista en herramientas") },
          { value: "B", label: txt("Walmart — Cashier", "Walmart — Cajero") },
          { value: "C", label: txt("Home Depot — Sales Associate", "Home Depot — Asociado de ventas") },
          { value: "D", label: txt("Target — Stock Team", "Target — Reposición") },
        ],
        correct: "A",
      },
    ];
    return {
      title: `${houseName} — ${houseTitle(2)}`,
      desc: t("pickCorrectAnswers"),
      hint: txt(
        "Hint: The age is mid‑teens. The job is the one that mentions the tools department.",
        "Pista: La edad es a mediados de la adolescencia. El trabajo es el que menciona el departamento de herramientas."
      ),
      questions,
      submitLabel: t("wizardUnlock"),
      render: (root) => renderMcq(root, [questions[0]]),
      validate: () => validateMcq(questions),
    };
  }

  if (step === 3) {
    const questions = [
      {
        id: "3_car",
        prompt: txt("What was my first car?", "¿Cuál fue mi primer carro?"),
        options: [
          { value: "A", label: "2010 Dodge Challenger" },
          { value: "B", label: "2010 Dodge Charger" },
          { value: "C", label: "2012 Ford Mustang" },
          { value: "D", label: "2008 Honda Civic" },
        ],
        correct: "A",
      },
      {
        id: "3_after",
        prompt: txt("What did I do after Sears?", "¿Qué hice después de Sears?"),
        options: [
          {
            value: "A",
            label: txt(
              "Worked two jobs: grocery store + busser at a French restaurant downtown",
              "Trabajé dos empleos: tienda de abarrotes + busser en un restaurante francés en el centro"
            ),
          },
          { value: "B", label: txt("Worked one job: bartender downtown", "Trabajé un empleo: bartender en el centro") },
          { value: "C", label: txt("Joined the military", "Me uní al ejército") },
          { value: "D", label: txt("Started a photography business", "Empecé un negocio de fotografía") },
        ],
        correct: "A",
      },
    ];
    return {
      title: `${houseName} — ${houseTitle(3)}`,
      desc: t("pickCorrectAnswers"),
      hint: txt(
        "Hint: The first car is the muscle car (Challenger). After Sears it was TWO jobs, and one was at a French restaurant downtown.",
        "Pista: El primer carro es el muscle car (Challenger). Después de Sears fueron DOS trabajos, y uno fue en un restaurante francés en el centro."
      ),
      questions,
      submitLabel: t("wizardUnlock"),
      render: (root) => renderMcq(root, [questions[0]]),
      validate: () => validateMcq(questions),
    };
  }

  if (step === 4) {
    const questions = [
      {
        id: "4_career",
        prompt: txt(
          "What career did I want in high school (in order)?",
          "¿Qué carrera quería en la preparatoria (en orden)?"
        ),
        options: [
          { value: "A", label: txt("Photographer → Journalist → Engineer", "Fotógrafo → Periodista → Ingeniero") },
          { value: "B", label: txt("Engineer → Journalist → Photographer", "Ingeniero → Periodista → Fotógrafo") },
          { value: "C", label: txt("Journalist → Photographer → Engineer", "Periodista → Fotógrafo → Ingeniero") },
          { value: "D", label: txt("Photographer → Engineer → Journalist", "Fotógrafo → Ingeniero → Periodista") },
        ],
        correct: "A",
      },
      {
        id: "4_money",
        prompt: txt(
          "How much money did I have when I left for Wilmington for university?",
          "¿Cuánto dinero tenía cuando me fui a Wilmington para la universidad?"
        ),
        options: [
          { value: "A", label: "$0" },
          { value: "B", label: "$500" },
          { value: "C", label: "$2000" },
          { value: "D", label: "$5000" },
        ],
        correct: "C",
      },
    ];
    return {
      title: `${houseName} — ${houseTitle(4)}`,
      desc: t("pickCorrectAnswers"),
      hint: txt(
        "Hint: The career path starts creative (photographer), then writing (journalist), then problem-solving (engineer). The money was in the thousands, not hundreds.",
        "Pista: El camino de carrera empieza creativo (fotógrafo), luego escritura (periodista) y después resolver problemas (ingeniero). El dinero fue en miles, no en cientos."
      ),
      questions,
      submitLabel: t("wizardUnlock"),
      render: (root) => renderMcq(root, [questions[0]]),
      validate: () => validateMcq(questions),
    };
  }

  if (step === 5) {
    const questions = [
      {
        id: "5_money",
        prompt: txt(
          "After my first year in college, how much money did I have?",
          "Después de mi primer año en la universidad, ¿cuánto dinero tenía?"
        ),
        options: [
          { value: "A", label: "$0" },
          { value: "B", label: "$200" },
          { value: "C", label: "$2000" },
          { value: "D", label: "$5000" },
        ],
        correct: "A",
      },
      {
        id: "5_job",
        prompt: txt("Where did I get my first tech job?", "¿Dónde conseguí mi primer trabajo Tech?"),
        options: [
          { value: "A", label: "Liberty Healthcare" },
          { value: "B", label: "Liberty Mutual" },
          { value: "C", label: "Duke Health" },
          { value: "D", label: "UNC Health" },
        ],
        correct: "A",
      },
      {
        id: "5_degree",
        prompt: txt("What kind of degree was it?", "¿Qué tipo de título era?"),
        options: [
          { value: "A", label: txt("Bachelor’s (4 years)", "Licenciatura (4 años)") },
          { value: "B", label: txt("Associate’s (2 years)", "Asociado (2 años)") },
          { value: "C", label: txt("Master’s (2 years)", "Maestría (2 años)") },
          { value: "D", label: txt("Certificate program", "Programa de certificado") },
        ],
        correct: "A",
      },
      {
        id: "5_study",
        prompt: txt("What was I studying?", "¿Qué estaba estudiando?"),
        options: [
          {
            value: "A",
            label: txt(
              "Computer Science (Software Engineering concentration) + Cybersecurity minor",
              "Ciencias de la Computación (concentración en Ingeniería de Software) + menor en Ciberseguridad"
            ),
          },
          {
            value: "B",
            label: txt(
              "Cybersecurity (Software Engineering concentration) + Computer Science minor",
              "Ciberseguridad (concentración en Ingeniería de Software) + menor en Ciencias de la Computación"
            ),
          },
          { value: "C", label: txt("Computer Engineering + Data Science minor", "Ingeniería de Computación + menor en Ciencia de Datos") },
          { value: "D", label: txt("Information Systems + Business minor", "Sistemas de Información + menor en Negocios") },
        ],
        correct: "A",
      },
    ];
    return {
      title: `${houseName} — ${houseTitle(5)}`,
      desc: t("pickCorrectAnswers"),
      hint: txt(
        "Hint: Money after year one was $0. The company name is Liberty Healthcare. It was a 4‑year Bachelor’s. The study option mentions Software Engineering + a Cybersecurity minor.",
        "Pista: El dinero después del primer año fue $0. La empresa es Liberty Healthcare. Fue una licenciatura de 4 años. La opción correcta menciona Ingeniería de Software + menor en Ciberseguridad."
      ),
      submitLabel: t("wizardUnlock"),
      questions,
      render: (root) => renderMcq(root, [questions[0]]),
      validate: () => validateMcq(questions),
    };
  }

  if (step === 6) {
    const questions = [
      {
        id: "6_work",
        prompt: txt("Where do I work now?", "¿Dónde trabajo ahora?"),
        options: [
          { value: "A", label: txt("Software Engineer at MegaCorp Logistics", "Software Engineer en MegaCorp Logistics") },
          { value: "B", label: txt("Project Manager at MegaCorp Logistics", "Project Manager en MegaCorp Logistics") },
          { value: "C", label: txt("Software Engineer at Liberty Healthcare", "Software Engineer en Liberty Healthcare") },
          { value: "D", label: txt("Cybersecurity Analyst at Duke Health", "Analista de Ciberseguridad en Duke Health") },
        ],
        correct: "A",
      },
      {
        id: "6_car",
        prompt: txt("What kind of car do I have now?", "¿Qué carro tengo ahora?"),
        options: [
          { value: "A", label: "Tesla Model 3" },
          { value: "B", label: "Tesla Model Y" },
          { value: "C", label: "Toyota Camry" },
          { value: "D", label: "Honda Accord" },
        ],
        correct: "A",
      },
      {
        id: "6_purchase",
        prompt: txt("What is my recent big purchase?", "¿Cuál es mi compra grande reciente?"),
        options: [
          { value: "A", label: txt("A house", "Una casa") },
          { value: "B", label: txt("A motorcycle", "Una moto") },
          { value: "C", label: txt("A boat", "Un bote") },
          { value: "D", label: txt("A watch", "Un reloj") },
        ],
        correct: "A",
      },
    ];
    return {
      title: `${houseName} — ${houseTitle(6)}`,
      desc: t("pickCorrectAnswers"),
      hint: txt(
        "Hint: Work is “Software Engineer” at MegaCorp Logistics. The car is a Tesla Model 3. The big purchase is not a vehicle — it’s a home.",
        "Pista: El trabajo es “Software Engineer” en MegaCorp Logistics. El carro es un Tesla Model 3. La compra grande no es un vehículo — es una casa."
      ),
      submitLabel: t("wizardUnlock"),
      questions,
      render: (root) => renderMcq(root, [questions[0]]),
      validate: () => validateMcq(questions),
    };
  }

  if (step === 7) {
    const finaleUnlocked = state.unlockedStep >= CONFIG.stepsTotal + 1;
    const questions = [
      {
        id: "7_partner",
        prompt: txt("What is the name of my partner?", "¿Cuál es el nombre de mi pareja?"),
        options: [
          { value: "A", label: "Rosita Pacheco Vargas" },
          { value: "B", label: "Rosita Vargas Pacheco" },
          { value: "C", label: "Rosa Pacheco Vargas" },
          { value: "D", label: "Rosita Pacheca Vargas" },
        ],
        correct: "A",
      },
      {
        id: "7_years",
        prompt: txt("How long have we been together?", "¿Cuánto tiempo hemos estado juntos?"),
        options: [
          { value: "A", label: txt("2 years (Jan 4)", "2 años (4 de enero)") },
          { value: "B", label: txt("3 years (Jan 4)", "3 años (4 de enero)") },
          { value: "C", label: txt("4 years (Jan 4)", "4 años (4 de enero)") },
          { value: "D", label: txt("5 years (Jan 4)", "5 años (4 de enero)") },
        ],
        correct: "C",
      },
      {
        id: "7_riddle",
        prompt:
          txt(
            "Riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
            "Adivinanza: Hablo sin boca y escucho sin oídos. No tengo cuerpo, pero cobro vida con el viento. ¿Qué soy?"
          ),
        options: [
          { value: "A", label: txt("An echo", "Un eco") },
          { value: "B", label: txt("A shadow", "Una sombra") },
          { value: "C", label: txt("A candle", "Una vela") },
          { value: "D", label: txt("A cloud", "Una nube") },
        ],
        correct: "A",
      },
    ];
    return {
      title: `${houseName} — ${houseTitle(7)}`,
      desc: finaleUnlocked ? t("alreadyClearedFinaleUnlocked") : t("pickCorrectAnswers"),
      hint: finaleUnlocked
        ? ""
        : txt(
            "Hint: Partner is Rosita Pacheco Vargas (full name). The time together is 4 years (Jan 4). The riddle’s answer is something you can hear bouncing back.",
            "Pista: La pareja es Rosita Pacheco Vargas (nombre completo). El tiempo juntos es 4 años (4 de enero). La respuesta de la adivinanza es algo que escuchas rebotar."
          ),
      submitLabel: finaleUnlocked ? t("finaleOk") : t("wizardUnlockFinale"),
      questions: finaleUnlocked ? null : questions,
      render: (root) => (finaleUnlocked ? (root.textContent = "") : renderMcq(root, [questions[0]])),
      validate: () => (finaleUnlocked ? true : validateMcq(questions)),
    };
  }

  return {
    title: txt("Unknown", "Desconocido"),
    desc: txt("This house is empty.", "Esta casa está vacía."),
    hint: "",
    render: (root) => (root.textContent = ""),
    validate: () => false,
  };
}

function onModalSubmit(state) {
  const step = modal.currentStep;
  if (!step) return;
  if (step > state.unlockedStep) {
    modalSetResult("bad", t("houseLocked"));
    return;
  }

  // Finale confirm flow (type YES)
  if (step === CONFIG.stepsTotal + 1) {
    if (modal.finaleMode === "locked") {
      modalClose();
      return;
    }
    if (modal.finaleMode === "confirm") {
      const v = normalize(document.getElementById("finale_yes")?.value ?? "");
      if (v !== "yes") {
        modalSetResult("bad", t("finaleTypeYesError"));
        return;
      }
      modal.finaleMode = "revealed";
      modal.desc.textContent = currentLang === "es" ? "Final:" : "Finale:";
      modal.submit.textContent = t("finaleOk");
      modal.form.innerHTML = `
        <div class="finale-stage" aria-label="Finale announcement">
          <div class="fireworks" aria-hidden="true">
            <div class="firework" style="--x: 14%; --y: 18%; --d: 0ms"></div>
            <div class="firework" style="--x: 84%; --y: 22%; --d: 180ms"></div>
            <div class="firework" style="--x: 22%; --y: 62%; --d: 360ms"></div>
            <div class="firework" style="--x: 78%; --y: 68%; --d: 540ms"></div>
            <div class="firework" style="--x: 50%; --y: 12%; --d: 720ms"></div>
            <div class="firework" style="--x: 50%; --y: 84%; --d: 900ms"></div>
          </div>

          <img class="finale-img" src="./assets/finale.png" alt="${escapeHtml(currentLang === "es" ? "Foto del final" : "Finale photo")}" />
          <div class="finale-caption">${escapeHtml(t("finaleCaption"))}</div>
        </div>
      `;
      modalSetResult("ok", "");
      return;
    }
    if (modal.finaleMode === "revealed") {
      modalClose();
      return;
    }
  }

  // Wizard (one question at a time)
  if (modal.wizard) {
    wizardStoreCurrentAnswer();
    if (!wizardHasCurrentAnswer()) {
      modalSetResult("bad", t("msgPickToContinue"));
      return;
    }

    const wz = modal.wizard;
    if (wz.idx < wz.questions.length - 1) {
      wz.idx += 1;
      renderWizardQuestion();
      return;
    }

    // Last question: validate all answers
    const ok = validateMcq(wz.questions, wz.answers);
    if (!ok) {
      modalSetResult("bad", t("msgTryAgain"));
      return;
    }
  } else {
    const cfg = getChallenge(step, state);
    const ok = cfg.validate();
    if (!ok) {
      modalSetResult("bad", t("msgTryAgain"));
      return;
    }
  }

  // Clearing house 5 unlocks finale (unlockedStep becomes 6)
  state.solved[String(step)] = true;
  state.unlockedStep = Math.max(state.unlockedStep, step + 1);
  writeState(state);
  setProgressUI(state);

  modal.wizard = null;

  if (step === 7) {
    modalSetResult("ok", t("msgFinaleUnlocked"));
  } else {
    modalSetResult("ok", t("msgCleared"));
    scheduleModalAutoClose(5000);
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

  // Allgood Neighborhood (tiny mobile homes around the big lake)
  const trailerHomes = [
    // north of lake
    { x: 35 * tile, y: 12 * tile, w: 3 * tile, h: 2 * tile },
    { x: 39 * tile, y: 12 * tile, w: 3 * tile, h: 2 * tile },
    { x: 43 * tile, y: 12 * tile, w: 3 * tile, h: 2 * tile },
    // west of lake
    { x: 33 * tile, y: 16 * tile, w: 3 * tile, h: 2 * tile },
    { x: 33 * tile, y: 19 * tile, w: 3 * tile, h: 2 * tile },
    // south of lake
    { x: 35 * tile, y: 22 * tile, w: 3 * tile, h: 2 * tile },
    { x: 39 * tile, y: 22 * tile, w: 3 * tile, h: 2 * tile },
    { x: 43 * tile, y: 22 * tile, w: 3 * tile, h: 2 * tile },
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

  // Trailer homes are solid (block movement)
  trailerHomes.forEach((t) => solids.push({ x: t.x, y: t.y, w: t.w, h: t.h }));

  const signs = [
    { x: 10 * tile, y: 40 * tile, text: "START → Allgood / Oneonta" },
    { x: 12 * tile, y: 31 * tile, text: "↑ Cleveland (Route Gate)" },
    { x: 22 * tile, y: 26 * tile, text: "↑ ROUTE NORTH" },
    { x: 10 * tile, y: 12 * tile, text: "→ North Carolina" },
    { x: 23 * tile, y: 6 * tile, text: "↑ FINALE" },
    { x: 36 * tile, y: 14 * tile, text: "ALLGOOD NEIGHBORHOOD" },
  ];

  const regions = [
    { name: "Alabama (Hometown)", rect: { x: 0, y: 24 * tile, w: bounds.w, h: 18 * tile } },
    { name: "The Route", rect: { x: 0, y: 12 * tile, w: bounds.w, h: 12 * tile } },
    { name: "North Carolina", rect: { x: 0, y: 0, w: bounds.w, h: 12 * tile } },
    { name: "Allgood Neighborhood", rect: { x: 32 * tile, y: 11 * tile, w: 16 * tile, h: 15 * tile } },
  ];

  // Rideable vehicles (unlock after completing the corresponding house)
  const vehicles = [
    // Next to House 3: orange bike
    { id: "bike_orange", type: "bike", label: "Orange Bike", color: "orange", unlockStep: 3, x: 39 * tile, y: 37 * tile, speedMult: 1.45 },
    // House 5: maroon dodge challenger
    { id: "car_challenger", type: "car", label: "Maroon Dodge Challenger", color: "maroon", unlockStep: 5, x: 13 * tile, y: 12 * tile, speedMult: 1.6 },
    // Next to House 6: silver mustang
    { id: "car_mustang", type: "car", label: "Silver Mustang", color: "silver", unlockStep: 6, x: 26 * tile, y: 12 * tile, speedMult: 1.6 },
    // Next to House 7: white tesla
    { id: "car_tesla", type: "car", label: "White Tesla", color: "white", unlockStep: 7, x: 39 * tile, y: 12 * tile, speedMult: 1.7 },
  ];

  return { bounds, houses, solids, paths, waters, regions, signs, hedges, cliffs, tallGrass, flowers, fences, trees, vehicles, trailerHomes };
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
  modal.backBtn = $("#modalBackBtn");
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

  // Language modal (shown before intro)
  let gameStarted = false;
  const langOverlay = document.getElementById("langOverlay");
  const langEnBtn = document.getElementById("langEnBtn");
  const langEsBtn = document.getElementById("langEsBtn");

  // Intro modal (gate gameplay start)
  const introOverlay = document.getElementById("introOverlay");
  const introStartBtn = document.getElementById("introStartBtn");

  const showIntro = () => {
    if (!introOverlay) {
      gameStarted = true;
      return;
    }
    introOverlay.hidden = false;
    requestAnimationFrame(() => introStartBtn?.focus?.());
  };

  currentLang = getLang();
  applyI18nToDom();

  const hasStoredLang = (() => {
    try {
      return Boolean(localStorage.getItem(LANG_KEY));
    } catch {
      return false;
    }
  })();

  const chooseLang = (lang) => {
    setLang(lang);
    applyI18nToDom();
    if (langOverlay) langOverlay.hidden = true;
    showIntro();
  };

  if (langOverlay && !hasStoredLang) {
    langOverlay.hidden = false;
    requestAnimationFrame(() => langEnBtn?.focus?.());
  } else {
    if (langOverlay) langOverlay.hidden = true;
    showIntro();
  }

  langEnBtn?.addEventListener("click", () => chooseLang("en"));
  langEsBtn?.addEventListener("click", () => chooseLang("es"));

  const town = buildTown();
  const camera = { x: 0, y: 0 };
  let debugCollision = false;
  let joyVec = { x: 0, y: 0 };
  let joyActive = false;

  // Sprite assets (optional). If missing, we fall back to procedural pixel cars.
  const sprites = {
    challenger: { img: null, ready: false },
  };
  try {
    const img = new Image();
    img.onload = () => {
      sprites.challenger.ready = true;
    };
    img.onerror = () => {
      sprites.challenger.ready = false;
    };
    // Put the user's challenger sprite here:
    // /assets/dodge-challenger.png
    img.src = "./assets/dodge-challenger.png";
    sprites.challenger.img = img;
  } catch {
    // ignore
  }

  const player = {
    x: WORLD.spawn.x * WORLD.tile,
    y: WORLD.spawn.y * WORLD.tile,
    w: 14,
    h: 14,
    baseSpeed: 120, // px/s
    dir: "down",
    isMoving: false,
    animTime: 0,
    mountedVehicleId: null,
  };

  const keys = new Set();
  let last = performance.now();
  let nearbyHouse = null;
  let nearbySign = null;
  let nearbyVehicle = null;
  let nearbyWater = null;

  const bubble = {
    text: "",
    until: 0,
  };

  function showBubble(text, ms = 900) {
    bubble.text = String(text ?? "");
    bubble.until = performance.now() + ms;
  }

  const fishing = {
    active: false,
    timers: [],
  };

  function clearFishingTimers() {
    fishing.timers.forEach((id) => clearTimeout(id));
    fishing.timers = [];
  }

  function cancelFishing(message = t("fishCancelled")) {
    if (!fishing.active) return;
    fishing.active = false;
    clearFishingTimers();
    showBubble(message, 900);
  }

  function isVehicleUnlocked(v) {
    // A vehicle is rideable after you complete its house (house N complete => state.unlockedStep >= N+1)
    return state.unlockedStep >= (v.unlockStep + 1);
  }

  function getMountedVehicle() {
    if (!player.mountedVehicleId) return null;
    return (town.vehicles ?? []).find((v) => v.id === player.mountedVehicleId) ?? null;
  }

  function playerSpeed() {
    const v = getMountedVehicle();
    return player.baseSpeed * (v?.speedMult ?? 1);
  }

  // Touch UI (mobile joystick + action button)
  const touchControls = document.getElementById("touchControls");
  const joyBase = document.getElementById("joyBase");
  const joyKnob = document.getElementById("joyKnob");
  const actionBtn = document.getElementById("actionBtn");
  const supportsPointer = typeof window !== "undefined" && "PointerEvent" in window;
  const mobileControlsPanel = document.getElementById("mobileControlsPanel");
  const joyBaseInline = document.getElementById("joyBaseInline");
  const joyKnobInline = document.getElementById("joyKnobInline");
  const actionBtnInline = document.getElementById("actionBtnInline");

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

  function shouldUseInlineControls() {
    // Under-game joystick for small screens; floating overlay for larger touch screens.
    return window.matchMedia?.("(pointer: coarse) and (max-width: 720px)").matches ?? false;
  }

  function updateTouchControlsLayout() {
    if (!isTouchDevice()) return;
    const inline = shouldUseInlineControls();
    if (touchControls) touchControls.hidden = inline; // hide overlay on small screens
    if (mobileControlsPanel) mobileControlsPanel.hidden = !inline; // show under-game panel on small screens
  }

  // HUD D-pad buttons (click/press the arrow keys shown under "Controls")
  function wireHudDpad() {
    const btns = Array.from(document.querySelectorAll("[data-vkey]"));
    if (!btns.length) return;

    const activePointers = new Map(); // pointerId -> key
    const activeTouches = new Set(); // key strings

    const press = (key) => keys.add(key);
    const release = (key) => keys.delete(key);

    btns.forEach((btn) => {
      const key = btn.getAttribute("data-vkey");
      if (!key) return;

      if (supportsPointer) {
        btn.addEventListener("pointerdown", (e) => {
          if (modal.isOpen) return;
          e.preventDefault();
          try {
            btn.setPointerCapture?.(e.pointerId);
          } catch {
            // ignore
          }
          activePointers.set(e.pointerId, key);
          press(key);
        });

        btn.addEventListener("pointerup", (e) => {
          const k = activePointers.get(e.pointerId);
          if (k) release(k);
          activePointers.delete(e.pointerId);
        });

        btn.addEventListener("pointercancel", (e) => {
          const k = activePointers.get(e.pointerId);
          if (k) release(k);
          activePointers.delete(e.pointerId);
        });
      } else {
        // Touch fallback (older mobile Safari)
        btn.addEventListener(
          "touchstart",
          (e) => {
            if (modal.isOpen) return;
            e.preventDefault();
            activeTouches.add(key);
            press(key);
          },
          { passive: false },
        );
        btn.addEventListener(
          "touchend",
          (e) => {
            e.preventDefault();
            activeTouches.delete(key);
            release(key);
          },
          { passive: false },
        );
        btn.addEventListener(
          "touchcancel",
          (e) => {
            e.preventDefault();
            activeTouches.delete(key);
            release(key);
          },
          { passive: false },
        );
      }

      btn.addEventListener("pointerleave", () => {
        // If a pointer leaves without a clean up, the window handler below will release.
      });
    });

    if (supportsPointer) {
      window.addEventListener("pointerup", (e) => {
        const k = activePointers.get(e.pointerId);
        if (k) release(k);
        activePointers.delete(e.pointerId);
      });

      window.addEventListener("pointercancel", (e) => {
        const k = activePointers.get(e.pointerId);
        if (k) release(k);
        activePointers.delete(e.pointerId);
      });
    }

    // Safety: if focus changes, stop movement
    window.addEventListener("blur", () => {
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].forEach((k) => keys.delete(k));
      activePointers.clear();
      activeTouches.clear();
    });
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
    const step = playerSpeed() * dt;
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

  function computeNearbyVehicle() {
    let best = null;
    let bestD = Infinity;
    for (const v of town.vehicles ?? []) {
      // If mounted, treat it as not nearby (it moves with player visually)
      if (player.mountedVehicleId === v.id) continue;
      const d = dist(player.x, player.y, v.x, v.y);
      if (d < bestD) {
        bestD = d;
        best = v;
      }
    }
    if (best && bestD <= 34) return best;
    return null;
  }

  function computeNearbyWater() {
    // Check distance from player to the nearest point on any water rect.
    // Collision prevents entering water; this detects when you are close enough to fish from shore.
    let best = null;
    let bestD = Infinity;
    for (const w of town.waters ?? []) {
      const cx = clamp(player.x, w.x, w.x + w.w);
      const cy = clamp(player.y, w.y, w.y + w.h);
      const d = dist(player.x, player.y, cx, cy);
      if (d < bestD) {
        bestD = d;
        best = w;
      }
    }
    if (best && bestD <= 26) return best;
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
    if (!gameStarted) return;
    if (fishing.active) return;
    // If mounted, Enter/A should prioritize entering houses; otherwise dismount.
    if (player.mountedVehicleId) {
      if (!nearbyHouse) {
        player.mountedVehicleId = null;
        setMessage(t("msgDismounted"));
        return;
      }
      // if near a house, continue to house interaction
    } else if (nearbyVehicle) {
      if (!isVehicleUnlocked(nearbyVehicle)) {
        setMessage(t("msgVehicleLocked", nearbyVehicle.unlockStep, nearbyVehicle.label));
        return;
      }
      player.mountedVehicleId = nearbyVehicle.id;
      setMessage(t("msgMounted", nearbyVehicle.label));
      return;
    }

    if (!nearbyHouse) {
      if (nearbyWater) {
        startFishing();
        return;
      }
      setMessage(t("msgNothingHere"));
      return;
    }

    const status = houseStatus(nearbyHouse);
    if (status === "locked") {
      setMessage(t("msgLockedHouse", nearbyHouse.name));
      return;
    }

    if (nearbyHouse.step === CONFIG.stepsTotal + 1) {
      setMessage(t("msgEnteringFinale"));
    } else {
      setMessage(t("msgEntering", nearbyHouse.name));
    }
    modalOpen(nearbyHouse.step, state);
  }

  function startFishing() {
    if (fishing.active) return;
    fishing.active = true;
    clearFishingTimers();

    const fishTypes = ["Bluegill", "Bass", "Catfish", "Trout", "Carp"];
    const caught = fishTypes[Math.floor(Math.random() * fishTypes.length)];

    showBubble(t("fish1"), 700);
    fishing.timers.push(
      setTimeout(() => {
        if (!fishing.active) return;
        showBubble(t("fish2"), 700);
      }, 550),
    );
    fishing.timers.push(
      setTimeout(() => {
        if (!fishing.active) return;
        showBubble(t("fish3"), 700);
      }, 1100),
    );
    fishing.timers.push(
      setTimeout(() => {
        if (!fishing.active) return;
        fishing.active = false;
        state.fishCaught = (state.fishCaught ?? 0) + 1;
        writeState(state);
        showBubble(t("fishBoom", caught), 1600);
      }, 1650),
    );
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

    // Allgood Neighborhood mobile homes (trailers)
    for (const t of town.trailerHomes ?? []) {
      drawTrailerHome(ctx, t);
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

    // Parked vehicles (rideable after completing the matching house)
    for (const v of town.vehicles ?? []) {
      if (player.mountedVehicleId === v.id) continue; // mounted vehicle moves with player
      drawVehicle(ctx, v, isVehicleUnlocked(v));
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
    const mounted = getMountedVehicle();
    if (mounted) {
      // Draw the vehicle under the player
      drawVehicleAt(ctx, mounted, player.x, player.y + 6, true);
    }
    drawPlayerSprite(ctx, player);

    // Bubble dialogue above player (for fishing + other short popups)
    if (bubble.text && performance.now() < bubble.until) {
      drawBubble(ctx, player.x, player.y - 24, bubble.text);
    }

    // Interaction prompt marker
    if (nearbyHouse) {
      const st = houseStatus(nearbyHouse);
      const vd = getHouseDoorVisual(nearbyHouse);
      ctx.fillStyle = st === "locked" ? "rgba(255,255,255,0.35)" : "rgba(245,158,11,0.9)";
      ctx.beginPath();
      ctx.arc(vd.x + vd.w / 2, vd.y - 6, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Vehicle prompt marker
    if (!player.mountedVehicleId && nearbyVehicle) {
      ctx.fillStyle = isVehicleUnlocked(nearbyVehicle) ? "rgba(34,197,94,0.9)" : "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(nearbyVehicle.x, nearbyVehicle.y - 18, 5, 0, Math.PI * 2);
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

  function drawTrailerHome(ctx2, t) {
    // Tiny mobile home / trailer (solid). Visual matches a 3x2 tile rect.
    const x = t.x;
    const y = t.y;
    const w = t.w;
    const h = t.h;

    // roof
    ctx2.fillStyle = "rgba(148, 163, 184, 0.28)";
    ctx2.fillRect(x, y, w, 8);
    // body
    ctx2.fillStyle = "rgba(214, 199, 168, 0.28)";
    ctx2.fillRect(x, y + 8, w, h - 8);
    // door + window
    ctx2.fillStyle = "rgba(120, 82, 45, 0.40)";
    ctx2.fillRect(x + 6, y + h - 14, 8, 12);
    ctx2.fillStyle = "rgba(59, 130, 246, 0.20)";
    ctx2.fillRect(x + w - 18, y + h - 16, 12, 10);

    // outline
    ctx2.strokeStyle = "rgba(0,0,0,0.20)";
    ctx2.lineWidth = 2;
    ctx2.strokeRect(x + 1, y + 1, w - 2, h - 2);
  }

  function drawBubble(ctx2, x, y, text) {
    ctx2.save();
    ctx2.font = "800 12px Inter, system-ui";
    const maxW = 260;
    const padX = 10;
    const padY = 8;
    const lines = wrapText(ctx2, text, maxW - padX * 2);
    const lineH = 16;
    const w = Math.min(
      maxW,
      Math.max(...lines.map((l) => ctx2.measureText(l).width)) + padX * 2,
    );
    const h = lines.length * lineH + padY * 2;
    const bx = Math.round(x - w / 2);
    const by = Math.round(y - h);

    // bubble background
    ctx2.fillStyle = "rgba(0, 0, 0, 0.55)";
    drawRoundedRect(ctx2, bx, by, w, h, 10);
    ctx2.fill();
    ctx2.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx2.lineWidth = 2;
    ctx2.stroke();

    // tail
    ctx2.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx2.beginPath();
    ctx2.moveTo(x - 6, by + h);
    ctx2.lineTo(x + 6, by + h);
    ctx2.lineTo(x, by + h + 10);
    ctx2.closePath();
    ctx2.fill();

    // text
    ctx2.fillStyle = "rgba(255, 255, 255, 0.92)";
    lines.forEach((l, i) => {
      ctx2.fillText(l, bx + padX, by + padY + lineH * (i + 1) - 4);
    });
    ctx2.restore();
  }

  function wrapText(ctx2, text, maxWidth) {
    const words = String(text ?? "").split(/\s+/g);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx2.measureText(test).width <= maxWidth) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function vehicleColor(v) {
    if (v.color === "orange") return { body: "rgba(245, 158, 11, 0.85)", trim: "rgba(120, 82, 45, 0.9)" };
    if (v.color === "maroon") return { body: "rgba(128, 30, 62, 0.9)", trim: "rgba(255,255,255,0.12)" };
    if (v.color === "silver") return { body: "rgba(148, 163, 184, 0.85)", trim: "rgba(30, 41, 59, 0.35)" };
    if (v.color === "white") return { body: "rgba(248, 250, 252, 0.85)", trim: "rgba(30, 41, 59, 0.25)" };
    return { body: "rgba(255,255,255,0.2)", trim: "rgba(0,0,0,0.2)" };
  }

  function drawRoundedRect(ctx2, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx2.beginPath();
    ctx2.moveTo(x + rr, y);
    ctx2.arcTo(x + w, y, x + w, y + h, rr);
    ctx2.arcTo(x + w, y + h, x, y + h, rr);
    ctx2.arcTo(x, y + h, x, y, rr);
    ctx2.arcTo(x, y, x + w, y, rr);
    ctx2.closePath();
  }

  function drawCarChallenger(ctx2, x, y, c) {
    // Wide muscle car look: boxier body + hood scoop + side stripe
    // Shadow
    ctx2.fillStyle = "rgba(0,0,0,0.24)";
    ctx2.beginPath();
    ctx2.ellipse(x, y + 10, 20, 6, 0, 0, Math.PI * 2);
    ctx2.fill();

    // Body
    ctx2.fillStyle = c.body;
    drawRoundedRect(ctx2, x - 20, y - 12, 40, 24, 6);
    ctx2.fill();

    // Hood scoop
    ctx2.fillStyle = "rgba(0,0,0,0.18)";
    drawRoundedRect(ctx2, x - 6, y - 10, 12, 6, 3);
    ctx2.fill();

    // Windows (smaller, muscle car)
    ctx2.fillStyle = c.trim;
    drawRoundedRect(ctx2, x - 14, y - 6, 28, 10, 4);
    ctx2.fill();

    // Racing stripe
    ctx2.fillStyle = "rgba(255,255,255,0.10)";
    ctx2.fillRect(x - 2, y - 12, 4, 24);

    // Wheels
    ctx2.fillStyle = "rgba(0,0,0,0.28)";
    ctx2.fillRect(x - 22, y - 10, 4, 6);
    ctx2.fillRect(x + 18, y - 10, 4, 6);
    ctx2.fillRect(x - 22, y + 4, 4, 6);
    ctx2.fillRect(x + 18, y + 4, 4, 6);

    // Headlights (top)
    ctx2.fillStyle = "rgba(255,255,255,0.18)";
    ctx2.fillRect(x - 14, y - 12, 8, 2);
    ctx2.fillRect(x + 6, y - 12, 8, 2);

    // Outline
    ctx2.strokeStyle = "rgba(0,0,0,0.28)";
    ctx2.lineWidth = 2;
    drawRoundedRect(ctx2, x - 20 + 1, y - 12 + 1, 40 - 2, 24 - 2, 6);
    ctx2.stroke();
  }

  function drawCarMustang(ctx2, x, y, c) {
    // Sporty fastback: tapered rear + stronger roofline
    ctx2.fillStyle = "rgba(0,0,0,0.24)";
    ctx2.beginPath();
    ctx2.ellipse(x, y + 10, 18, 6, 0, 0, Math.PI * 2);
    ctx2.fill();

    // Body (slightly narrower)
    ctx2.fillStyle = c.body;
    drawRoundedRect(ctx2, x - 18, y - 12, 36, 24, 8);
    ctx2.fill();

    // Fastback roof (diagonal highlight)
    ctx2.fillStyle = c.trim;
    drawRoundedRect(ctx2, x - 12, y - 7, 24, 11, 5);
    ctx2.fill();
    ctx2.fillStyle = "rgba(255,255,255,0.08)";
    ctx2.beginPath();
    ctx2.moveTo(x - 10, y - 6);
    ctx2.lineTo(x + 10, y - 6);
    ctx2.lineTo(x + 6, y + 2);
    ctx2.lineTo(x - 10, y + 2);
    ctx2.closePath();
    ctx2.fill();

    // Hood bulge
    ctx2.fillStyle = "rgba(0,0,0,0.16)";
    drawRoundedRect(ctx2, x - 5, y - 10, 10, 8, 3);
    ctx2.fill();

    // Wheels
    ctx2.fillStyle = "rgba(0,0,0,0.28)";
    ctx2.fillRect(x - 20, y - 10, 4, 6);
    ctx2.fillRect(x + 16, y - 10, 4, 6);
    ctx2.fillRect(x - 20, y + 4, 4, 6);
    ctx2.fillRect(x + 16, y + 4, 4, 6);

    // Outline
    ctx2.strokeStyle = "rgba(0,0,0,0.28)";
    ctx2.lineWidth = 2;
    drawRoundedRect(ctx2, x - 18 + 1, y - 12 + 1, 36 - 2, 24 - 2, 8);
    ctx2.stroke();
  }

  function drawCarTeslaModel3(ctx2, x, y, c) {
    // Smooth sedan: rounder body + glass roof
    ctx2.fillStyle = "rgba(0,0,0,0.24)";
    ctx2.beginPath();
    ctx2.ellipse(x, y + 10, 18, 6, 0, 0, Math.PI * 2);
    ctx2.fill();

    // Body
    ctx2.fillStyle = c.body;
    drawRoundedRect(ctx2, x - 18, y - 12, 36, 24, 10);
    ctx2.fill();

    // Glass roof (dark)
    ctx2.fillStyle = "rgba(30, 41, 59, 0.30)";
    drawRoundedRect(ctx2, x - 13, y - 7, 26, 12, 7);
    ctx2.fill();
    // Roof highlight
    ctx2.fillStyle = "rgba(255,255,255,0.08)";
    drawRoundedRect(ctx2, x - 10, y - 5, 20, 4, 4);
    ctx2.fill();

    // Minimal wheels
    ctx2.fillStyle = "rgba(0,0,0,0.26)";
    ctx2.fillRect(x - 20, y - 9, 4, 5);
    ctx2.fillRect(x + 16, y - 9, 4, 5);
    ctx2.fillRect(x - 20, y + 4, 4, 5);
    ctx2.fillRect(x + 16, y + 4, 4, 5);

    // Outline
    ctx2.strokeStyle = "rgba(0,0,0,0.26)";
    ctx2.lineWidth = 2;
    drawRoundedRect(ctx2, x - 18 + 1, y - 12 + 1, 36 - 2, 24 - 2, 10);
    ctx2.stroke();
  }

  function drawBike(ctx2, x, y, c) {
    // Slightly more bike-y: wheels + frame triangle
    ctx2.fillStyle = "rgba(0,0,0,0.24)";
    ctx2.beginPath();
    ctx2.ellipse(x, y + 8, 10, 4, 0, 0, Math.PI * 2);
    ctx2.fill();

    // Wheels
    ctx2.fillStyle = "rgba(0,0,0,0.30)";
    drawRoundedRect(ctx2, x - 14, y - 2, 8, 8, 2);
    ctx2.fill();
    drawRoundedRect(ctx2, x + 6, y - 2, 8, 8, 2);
    ctx2.fill();

    // Frame
    ctx2.strokeStyle = c.body;
    ctx2.lineWidth = 3;
    ctx2.beginPath();
    ctx2.moveTo(x - 10, y + 2);
    ctx2.lineTo(x - 2, y - 4);
    ctx2.lineTo(x + 10, y + 2);
    ctx2.lineTo(x - 2, y + 2);
    ctx2.closePath();
    ctx2.stroke();

    // Handle + seat
    ctx2.strokeStyle = c.trim;
    ctx2.lineWidth = 3;
    ctx2.beginPath();
    ctx2.moveTo(x + 2, y - 6);
    ctx2.lineTo(x + 10, y - 6);
    ctx2.stroke();
    ctx2.fillStyle = c.trim;
    ctx2.fillRect(x - 4, y - 8, 6, 3);
  }

  function drawVehicle(ctx2, v, unlocked) {
    drawVehicleAt(ctx2, v, v.x, v.y, unlocked);
  }

  function drawVehicleAt(ctx2, v, x, y, unlocked) {
    const c = vehicleColor(v);
    const alpha = unlocked ? 1 : 0.55;
    ctx2.save();
    ctx2.globalAlpha = alpha;

    if (v.type === "bike") {
      drawBike(ctx2, x, y, c);
    } else if (v.id === "car_challenger") {
      // Prefer user-provided sprite if available
      if (sprites.challenger.ready && sprites.challenger.img) {
        drawChallengerSprite(ctx2, sprites.challenger.img, x, y);
      } else {
        drawCarChallenger(ctx2, x, y, c);
      }
    } else if (v.id === "car_mustang") {
      drawCarMustang(ctx2, x, y, c);
    } else if (v.id === "car_tesla") {
      drawCarTeslaModel3(ctx2, x, y, c);
    } else {
      // fallback car
      drawCarTeslaModel3(ctx2, x, y, c);
    }

    // Label badge
    ctx2.font = "800 10px Inter, system-ui";
    const label = v.type === "bike" ? "BIKE" : (v.label ?? "CAR").toUpperCase();
    const tw = ctx2.measureText(label).width;
    ctx2.fillStyle = "rgba(0,0,0,0.30)";
    ctx2.fillRect(x - tw / 2 - 6, y - 26, tw + 12, 14);
    ctx2.fillStyle = "rgba(255,255,255,0.85)";
    ctx2.fillText(label, x - tw / 2, y - 15);
    if (!unlocked) {
      const lock = "LOCKED";
      const lw = ctx2.measureText(lock).width;
      ctx2.fillStyle = "rgba(0,0,0,0.30)";
      ctx2.fillRect(x - lw / 2 - 6, y + 18, lw + 12, 14);
      ctx2.fillStyle = "rgba(255,255,255,0.75)";
      ctx2.fillText(lock, x - lw / 2, y + 29);
    }

    ctx2.restore();
  }

  function drawChallengerSprite(ctx2, img, x, y) {
    // The provided sprite sheet has 3 views + a title.
    // We'll crop the middle third (side view) and ignore the title area.
    // This keeps the game self-contained without requiring a separate crop file.
    const sw = img.width;
    const sh = img.height;
    if (!sw || !sh) return;

    const sx = Math.floor(sw / 3);
    const sy = Math.floor(sh * 0.22); // skip title region
    const sW = Math.floor(sw / 3);
    const sH = Math.floor(sh * 0.78);

    // Draw scaled to fit our world footprint nicely
    const drawW = 44;
    const drawH = 24;
    const dx = Math.round(x - drawW / 2);
    const dy = Math.round(y - drawH / 2);

    // shadow
    ctx2.fillStyle = "rgba(0,0,0,0.22)";
    ctx2.beginPath();
    ctx2.ellipse(x, y + 10, 20, 6, 0, 0, Math.PI * 2);
    ctx2.fill();

    // sprite
    ctx2.imageSmoothingEnabled = false; // keep it crisp/pixelated
    ctx2.drawImage(img, sx, sy, sW, sH, dx, dy - 6, drawW, drawH);

    // outline to match our style
    ctx2.strokeStyle = "rgba(0,0,0,0.28)";
    ctx2.lineWidth = 2;
    ctx2.strokeRect(dx + 1, dy - 6 + 1, drawW - 2, drawH - 2);
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

    // Move unless modal open (or fishing)
    if (gameStarted && !modal.isOpen && !fishing.active) {
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
      nearbyVehicle = computeNearbyVehicle();
      nearbyWater = computeNearbyWater();
      if (nearbyHouse) {
        const st = houseStatus(nearbyHouse);
        if (nearbyHouse.step === CONFIG.stepsTotal + 1) {
          $("#tipText").textContent =
            st === "locked" ? t("finaleLockedTip") : t("pressEnterSeeFinale");
        } else {
          $("#tipText").textContent =
            st === "locked"
              ? t("houseLockedTip", nearbyHouse.name)
              : t("pressEnterEnterHouse", nearbyHouse.name);
        }
      } else {
        const nextStep = clampInt(state.unlockedStep, 1, CONFIG.stepsTotal + 1);
        const nextName =
          nextStep === CONFIG.stepsTotal + 1
            ? CONFIG.houses.find((h) => h.step === 8)?.name ?? "Finale"
            : CONFIG.houses.find((h) => h.step === nextStep)?.name ?? `House ${nextStep}`;
        if (player.mountedVehicleId) {
          $("#tipText").textContent = t("tipRiding");
        } else if (nearbyVehicle) {
          $("#tipText").textContent = isVehicleUnlocked(nearbyVehicle)
            ? t("tipRidePrompt", nearbyVehicle.label)
            : t("msgVehicleLocked", nearbyVehicle.unlockStep, nearbyVehicle.label);
        } else if (nearbyWater) {
          $("#tipText").textContent = t("tipFish");
        } else if (nearbySign?.text) $("#tipText").textContent = `${t("signPrefix")} ${nearbySign.text}`;
        else $("#tipText").textContent = t("tipNextDestination", nextName);
      }
    }
    if (modal.isOpen) {
      player.isMoving = false;
      player.animTime = 0;
    }
    if (fishing.active) {
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
    if (!gameStarted) return;

    // Debug: toggle collision overlay
    if (e.key === "c" || e.key === "C") {
      debugCollision = !debugCollision;
      setMessage(debugCollision ? t("debugCollisionOn") : t("debugCollisionOff"));
      return;
    }

    if (e.key === "Escape") {
      if (modal.isOpen) modalClose();
      if (fishing.active) cancelFishing();
      return;
    }

    if (modal.isOpen) return;
    if (fishing.active) return;

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
  modal.backBtn?.addEventListener("click", () => {
    if (!modal.wizard) return;
    if (modal.wizard.idx <= 0) return;
    wizardStoreCurrentAnswer();
    modal.wizard.idx -= 1;
    renderWizardQuestion();
  });
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
    cancelFishing("");
    localStorage.removeItem(STORAGE_KEY);
    const fresh = readState();
    state.unlockedStep = fresh.unlockedStep;
    state.solved = fresh.solved;
    state.fishCaught = fresh.fishCaught ?? 0;
    writeState(state);
    setProgressUI(state);
    setMessage(t("msgReset"));
    player.x = WORLD.spawn.x * WORLD.tile;
    player.y = WORLD.spawn.y * WORLD.tile;
    if (modal.isOpen) modalClose();
  });

  // Start intro
  if (introStartBtn && introOverlay) {
    introStartBtn.addEventListener("click", () => {
      introOverlay.hidden = true;
      gameStarted = true;
      setMessage(t("tipWalkToDoor"));
      canvas.focus();
    });
  }

  // Touch controls visibility (mobile/responsive)
  if (isTouchDevice()) {
    updateTouchControlsLayout();
    window.addEventListener("resize", updateTouchControlsLayout);
  }

  function wireJoystick(baseEl, knobEl) {
    if (!baseEl || !knobEl) return;

    const radius = 44; // px from center
    let activePointerId = null;
    let activeTouchId = null;

    const getCenter = () => {
      const r = baseEl.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    };

    const applyJoyFromClient = (clientX, clientY) => {
      const { cx, cy } = getCenter();
      const dx = clientX - cx;
      const dy = clientY - cy;
      const mag = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(radius, mag);
      const nx = (dx / mag) * clamped;
      const ny = (dy / mag) * clamped;
      // Move the knob inside THIS joystick
      knobEl.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
      // Control the shared movement vector
      joyVec = { x: nx / radius, y: ny / radius };
    };

    const reset = () => {
      activePointerId = null;
      activeTouchId = null;
      knobEl.style.transform = "translate(-50%, -50%)";
      resetJoystick();
    };

    if (supportsPointer) {
      baseEl.addEventListener("pointerdown", (e) => {
        if (modal.isOpen) return;
        // Prevent page scroll while interacting with joystick on mobile browsers
        e.preventDefault();
        joyActive = true;
        activePointerId = e.pointerId;
        baseEl.setPointerCapture?.(e.pointerId);
        applyJoyFromClient(e.clientX, e.clientY);
      });

      window.addEventListener("pointermove", (e) => {
        if (!joyActive) return;
        if (activePointerId !== null && e.pointerId !== activePointerId) return;
        if (e.pointerType === "touch") e.preventDefault();
        applyJoyFromClient(e.clientX, e.clientY);
      }, { passive: false });

      window.addEventListener("pointerup", (e) => {
        if (activePointerId !== null && e.pointerId !== activePointerId) return;
        reset();
      }, { passive: true });

      window.addEventListener("pointercancel", (e) => {
        if (activePointerId !== null && e.pointerId !== activePointerId) return;
        reset();
      }, { passive: true });
    } else {
      // Touch fallback
      baseEl.addEventListener(
        "touchstart",
        (e) => {
          if (modal.isOpen) return;
          const t = e.changedTouches[0];
          if (!t) return;
          joyActive = true;
          activeTouchId = t.identifier;
          applyJoyFromClient(t.clientX, t.clientY);
          e.preventDefault();
        },
        { passive: false },
      );

      baseEl.addEventListener(
        "touchmove",
        (e) => {
          if (!joyActive) return;
          const t = Array.from(e.changedTouches).find((tt) => tt.identifier === activeTouchId);
          if (!t) return;
          applyJoyFromClient(t.clientX, t.clientY);
          e.preventDefault();
        },
        { passive: false },
      );

      const endTouch = (e) => {
        const t = Array.from(e.changedTouches).find((tt) => tt.identifier === activeTouchId);
        if (!t) return;
        reset();
        e.preventDefault();
      };

      baseEl.addEventListener("touchend", endTouch, { passive: false });
      baseEl.addEventListener("touchcancel", endTouch, { passive: false });
    }
  }

  // Wire both joysticks (overlay + under-game panel). Only one is visible at a time.
  wireJoystick(joyBase, joyKnob);
  wireJoystick(joyBaseInline, joyKnobInline);

  // Extra safety: while joystick is active, prevent page scrolling on touchmove (especially iOS Safari).
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!joyActive) return;
      e.preventDefault();
    },
    { passive: false },
  );

  if (actionBtn) {
    actionBtn.addEventListener("click", () => {
      if (modal.isOpen) return;
      interact();
    });
  }
  if (actionBtnInline) {
    actionBtnInline.addEventListener("click", () => {
      if (modal.isOpen) return;
      interact();
    });
  }

  wireHudDpad();

  // Initial focus + message
  setMessage(currentLang === "es" ? "Presiona Empezar para comenzar." : "Press Start to begin.");
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


