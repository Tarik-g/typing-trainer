"use strict";

const { chooseStorageMode, isValidSession, calculateMetrics, calculateStreak } = globalThis.KeyFlowCore;

const EXERCISES = [
  {
    id: "average",
    title: "Durchschnitt berechnen",
    description: "Funktionen, Bedingungen und eine kleine Liste.",
    code: [
      "def calculate_average(numbers):",
      "    if not numbers:",
      "        return 0",
      "",
      "    total = sum(numbers)",
      "    return total / len(numbers)",
      "",
      "scores = [85, 92, 78, 96, 88]",
      "average = calculate_average(scores)",
      "print(round(average, 2))",
    ].join("\n"),
  },
  {
    id: "filter",
    title: "Werte filtern",
    description: "List Comprehension mit Vergleich und Modulo.",
    code: [
      "def keep_even(numbers):",
      "    return [number for number in numbers if number % 2 == 0]",
      "",
      "values = [3, 8, 11, 14, 19, 22]",
      "even_values = keep_even(values)",
      "print(even_values)",
    ].join("\n"),
  },
  {
    id: "frequency",
    title: "Wörter zählen",
    description: "Dictionary-Zugriffe und eine einfache Schleife.",
    code: [
      "def word_frequencies(words):",
      "    counts = {}",
      "",
      "    for word in words:",
      "        counts[word] = counts.get(word, 0) + 1",
      "",
      "    return counts",
      "",
      "items = [\"code\", \"type\", \"code\", \"learn\"]",
      "print(word_frequencies(items))",
    ].join("\n"),
  },
  {
    id: "greeting",
    title: "Begrüßungen erzeugen",
    description: "Strings, f-Strings und saubere Einrückung.",
    code: [
      "def create_greetings(names):",
      "    greetings = []",
      "",
      "    for name in names:",
      "        greetings.append(f\"Hallo, {name}!\")",
      "",
      "    return greetings",
      "",
      "for message in create_greetings([\"Mina\", \"Leo\"]):",
      "    print(message)",
    ].join("\n"),
  },
  {
    id: "counter",
    title: "Kleine Klasse",
    description: "Klassen, Methoden und Unterstriche trainieren.",
    code: [
      "class Counter:",
      "    def __init__(self, start=0):",
      "        self.value = start",
      "",
      "    def increment(self):",
      "        self.value += 1",
      "        return self.value",
      "",
      "counter = Counter(4)",
      "print(counter.increment())",
    ].join("\n"),
  },
  {
    id: "fibonacci",
    title: "Fibonacci-Folge",
    description: "Tupelzuweisung und eine kompakte Schleife.",
    code: [
      "def fibonacci(limit):",
      "    first, second = 0, 1",
      "    sequence = []",
      "",
      "    while first < limit:",
      "        sequence.append(first)",
      "        first, second = second, first + second",
      "",
      "    return sequence",
      "",
      "print(fibonacci(50))",
    ].join("\n"),
  },
  {
    id: "grouping",
    title: "Nach Länge gruppieren",
    description: "Verschachtelte Daten mit setdefault verarbeiten.",
    code: [
      "def group_by_length(words):",
      "    groups = {}",
      "",
      "    for word in words:",
      "        length = len(word)",
      "        groups.setdefault(length, []).append(word)",
      "",
      "    return groups",
      "",
      "words = [\"sun\", \"moon\", \"sky\", \"cloud\"]",
      "print(group_by_length(words))",
    ].join("\n"),
  },
  {
    id: "numpy-array-analysis",
    title: "NumPy · Arrays auswerten",
    description: "Mittelwerte und das beste Ergebnis in einem Array finden.",
    category: "Data & Machine Learning",
    package: "NumPy",
    code: [
      "import numpy as np",
      "",
      "scores = np.array([",
      "    [82, 91, 88],",
      "    [75, 84, 90],",
      "    [93, 89, 95],",
      "])",
      "subject_means = scores.mean(axis=0)",
      "best_student = scores.mean(axis=1).argmax()",
      "",
      "print(subject_means)",
      "print(f\"Best student index: {best_student}\")",
    ].join("\n"),
  },
  {
    id: "pandas-groupby",
    title: "pandas · Umsätze gruppieren",
    description: "Eine Tabelle erstellen und Werte nach Team zusammenfassen.",
    category: "Data & Machine Learning",
    package: "pandas",
    code: [
      "import pandas as pd",
      "",
      "sales = pd.DataFrame({",
      "    \"team\": [\"North\", \"South\", \"North\", \"South\"],",
      "    \"revenue\": [1200, 950, 1430, 1110],",
      "})",
      "average_revenue = sales.groupby(\"team\")[\"revenue\"].mean()",
      "",
      "print(average_revenue)",
    ].join("\n"),
  },
  {
    id: "pytorch-network",
    title: "PyTorch · Kleines Netz",
    description: "Ein kompaktes neuronales Netz definieren und ausführen.",
    category: "Data & Machine Learning",
    package: "PyTorch",
    code: [
      "import torch",
      "from torch import nn",
      "",
      "model = nn.Sequential(",
      "    nn.Linear(4, 8),",
      "    nn.ReLU(),",
      "    nn.Linear(8, 2),",
      ")",
      "inputs = torch.randn(3, 4)",
      "logits = model(inputs)",
      "",
      "print(logits.shape)",
    ].join("\n"),
  },
  {
    id: "sklearn-pipeline",
    title: "scikit-learn · Pipeline",
    description: "Daten skalieren und eine kleine Klassifikation trainieren.",
    category: "Data & Machine Learning",
    package: "scikit-learn",
    code: [
      "from sklearn.linear_model import LogisticRegression",
      "from sklearn.pipeline import make_pipeline",
      "from sklearn.preprocessing import StandardScaler",
      "",
      "features = [[0.2, 1.1], [0.5, 1.4], [1.3, 0.4], [1.6, 0.2]]",
      "labels = [0, 0, 1, 1]",
      "model = make_pipeline(StandardScaler(), LogisticRegression())",
      "model.fit(features, labels)",
      "prediction = model.predict([[1.1, 0.5]])",
      "",
      "print(prediction)",
    ].join("\n"),
  },
  {
    id: "matplotlib-line-chart",
    title: "Matplotlib · Liniendiagramm",
    description: "Übungszeiten als beschriftetes Diagramm darstellen.",
    category: "Web & Visualisierung",
    package: "Matplotlib",
    code: [
      "import matplotlib.pyplot as plt",
      "",
      "days = [\"Mo\", \"Di\", \"Mi\", \"Do\", \"Fr\"]",
      "minutes = [12, 18, 10, 24, 20]",
      "fig, ax = plt.subplots()",
      "ax.plot(days, minutes, marker=\"o\")",
      "ax.set_title(\"Übungszeit\")",
      "ax.set_ylabel(\"Minuten\")",
      "ax.grid(True)",
      "",
      "plt.show()",
    ].join("\n"),
  },
  {
    id: "requests-get-json",
    title: "Requests · JSON abrufen",
    description: "Eine GET-Anfrage senden und die JSON-Antwort lesen.",
    category: "Web & Visualisierung",
    package: "Requests",
    code: [
      "import requests",
      "",
      "params = {\"language\": \"python\", \"limit\": 3}",
      "response = requests.get(",
      "    \"https://httpbin.org/get\",",
      "    params=params,",
      "    timeout=10,",
      ")",
      "response.raise_for_status()",
      "data = response.json()",
      "",
      "print(data[\"args\"])",
    ].join("\n"),
  },
  {
    id: "fastapi-query-route",
    title: "FastAPI · Query-Route",
    description: "Eine API-Route mit Pfad- und Query-Parameter definieren.",
    category: "Web & Visualisierung",
    package: "FastAPI",
    code: [
      "from fastapi import FastAPI",
      "",
      "app = FastAPI()",
      "",
      "@app.get(\"/items/{item_id}\")",
      "async def read_item(item_id: str, q: str | None = None):",
      "    if q:",
      "        return {\"item_id\": item_id, \"q\": q}",
      "",
      "    return {\"item_id\": item_id}",
    ].join("\n"),
  },
];

const KEYBOARD_ROWS = [
  ["^", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ß", "´"],
  ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü", "+"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä", "#"],
  ["Y", "X", "C", "V", "B", "N", "M", ",", ".", "-"],
  ["Leertaste"],
];

const FINGERS = {
  "l-pinky": { label: "linker kleiner Finger", short: "L kl.", hand: "Linke Hand" },
  "l-ring": { label: "linker Ringfinger", short: "L Ring", hand: "Linke Hand" },
  "l-middle": { label: "linker Mittelfinger", short: "L Mitte", hand: "Linke Hand" },
  "l-index": { label: "linker Zeigefinger", short: "L Zeige", hand: "Linke Hand" },
  "r-index": { label: "rechter Zeigefinger", short: "R Zeige", hand: "Rechte Hand" },
  "r-middle": { label: "rechter Mittelfinger", short: "R Mitte", hand: "Rechte Hand" },
  "r-ring": { label: "rechter Ringfinger", short: "R Ring", hand: "Rechte Hand" },
  "r-pinky": { label: "rechter kleiner Finger", short: "R kl.", hand: "Rechte Hand" },
  thumbs: { label: "Daumen", short: "Daumen", hand: "Beide Hände" },
};

const FINGER_KEYS = {
  "l-pinky": ["^", "1", "q", "a", "y", "<"],
  "l-ring": ["2", "w", "s", "x"],
  "l-middle": ["3", "e", "d", "c"],
  "l-index": ["4", "5", "r", "t", "f", "g", "v", "b"],
  "r-index": ["6", "7", "z", "u", "h", "j", "n", "m"],
  "r-middle": ["8", "i", "k", ","],
  "r-ring": ["9", "o", "l", "."],
  "r-pinky": ["0", "ß", "´", "p", "ü", "+", "ö", "ä", "#", "-", "enter"],
  thumbs: ["space"],
};

const SHIFTED_KEY_MAP = {
  "!": "1",
  '"': "2",
  "§": "3",
  "$": "4",
  "%": "5",
  "&": "6",
  "/": "7",
  "(": "8",
  ")": "9",
  "=": "0",
  "?": "ß",
  "`": "´",
  "*": "+",
  "'": "#",
  ";": ",",
  ":": ".",
  "_": "-",
  "[": "8",
  "]": "9",
  "{": "7",
  "}": "0",
  "\\": "ß",
  "|": "<",
  "@": "q",
  "~": "+",
  "\n": "enter",
  " ": "space",
};

const STORAGE_KEY = "keyflow-data-v1";
const storageMode = chooseStorageMode({
  displayStandalone: window.matchMedia("(display-mode: standalone)").matches,
  displayWindowControlsOverlay: window.matchMedia("(display-mode: window-controls-overlay)").matches,
  navigatorStandalone: window.navigator.standalone === true,
  windowControlsOverlayVisible: Boolean(window.navigator.windowControlsOverlay?.visible),
  protocol: window.location.protocol,
});
const isStandalone = storageMode === "local";
const appStorage = isStandalone ? window.localStorage : window.sessionStorage;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const svgNS = "http://www.w3.org/2000/svg";

const elements = {
  themeMeta: $('meta[name="theme-color"]'),
  themeToggle: $("#theme-toggle"),
  themeIcon: $("#theme-icon"),
  installButton: $("#install-button"),
  storageBadge: $("#storage-badge"),
  modeNotice: $("#mode-notice"),
  exerciseMode: $("#exercise-mode"),
  exerciseTitle: $("#exercise-title"),
  exerciseDescription: $("#exercise-description"),
  exerciseSelect: $("#exercise-select"),
  codeDisplay: $("#code-display"),
  typingCard: $("#typing-card"),
  typingSurface: $("#typing-surface"),
  typingInput: $("#typing-input"),
  typingHint: $("#typing-hint"),
  targetCodeAccessible: $("#target-code-accessible"),
  progress: $("#typing-progress"),
  progressBar: $("#typing-progress-bar"),
  wpm: $("#wpm-value"),
  accuracy: $("#accuracy-value"),
  time: $("#time-value"),
  progressValue: $("#progress-value"),
  nextKey: $("#next-key"),
  nextFinger: $("#next-finger"),
  keyboardHand: $("#keyboard-hand"),
  keyboard: $("#keyboard"),
  completionCard: $("#completion-card"),
  completionSummary: $("#completion-summary"),
  customDialog: $("#custom-text-dialog"),
  customForm: $("#custom-text-form"),
  customTitle: $("#custom-title"),
  customText: $("#custom-text"),
  customError: $("#custom-error"),
  analysisEmpty: $("#analysis-empty"),
  analysisContent: $("#analysis-content"),
  characterStats: $("#character-stats"),
  bigramStats: $("#bigram-stats"),
  handSummary: $("#hand-summary"),
  fingerStats: $("#finger-stats"),
  handBalanceLabel: $("#hand-balance-label"),
  bestWpm: $("#best-wpm"),
  streak: $("#streak-value"),
  totalTime: $("#total-time"),
  chart: $("#progress-chart"),
  chartEmpty: $("#chart-empty"),
  chartCaption: $("#chart-caption"),
  goalInput: $("#goal-input"),
  goalOutput: $("#goal-output"),
  goalProgress: $("#goal-progress-bar"),
  goalCopy: $("#goal-copy"),
  history: $("#history-list"),
  resetDialog: $("#reset-dialog"),
  toast: $("#toast"),
};

let appData = readData();
let currentExercise = EXERCISES[0];
let exerciseIndex = 0;
let targetText = "";
let typedText = "";
let startedAt = null;
let lastInputAt = null;
let timerId = null;
let totalKeystrokes = 0;
let incorrectKeystrokes = 0;
let sessionKeyStats = {};
let sessionBigramStats = {};
let sessionFinished = false;
let deferredInstallPrompt = null;
let toastTimer = null;

function defaultData() {
  return {
    version: 1,
    theme: "light",
    goalWpm: 60,
    sessions: [],
    keyStats: {},
    bigramStats: {},
  };
}

function readData() {
  try {
    const parsed = JSON.parse(appStorage.getItem(STORAGE_KEY));
    const fallback = defaultData();

    if (!parsed || parsed.version !== 1) return fallback;

    return {
      ...fallback,
      ...parsed,
      theme: parsed.theme === "dark" ? "dark" : "light",
      goalWpm: clamp(Number(parsed.goalWpm) || 60, 20, 120),
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions.filter(isValidSession).slice(-100) : [],
      keyStats: sanitizeStats(parsed.keyStats),
      bigramStats: sanitizeStats(parsed.bigramStats),
    };
  } catch {
    return defaultData();
  }
}

function sanitizeStats(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const clean = {};

  for (const [key, stat] of Object.entries(value)) {
    if (!stat || typeof stat !== "object") continue;
    clean[key] = {
      attempts: Math.max(0, Number(stat.attempts) || 0),
      errors: Math.max(0, Number(stat.errors) || 0),
      totalMs: Math.max(0, Number(stat.totalMs) || 0),
      timedAttempts: Math.max(0, Number(stat.timedAttempts) || 0),
    };
  }

  return clean;
}

function saveData() {
  try {
    appStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch {
    showToast("Der Fortschritt konnte auf diesem Gerät nicht gespeichert werden.");
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function init() {
  renderKeyboard();
  renderExerciseLibrary();
  bindEvents();
  applyTheme(appData.theme, false);
  updateStorageMode();
  elements.goalInput.value = String(appData.goalWpm);
  loadExercise(EXERCISES[0], { focus: false });
  switchView(getInitialView(), { updateHash: false });
  renderAnalysis();
  renderProgress();
  registerServiceWorker();
}

function bindEvents() {
  $$("[data-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  $$("[data-go-practice]").forEach((button) => {
    button.addEventListener("click", () => switchView("practice"));
  });

  window.addEventListener("hashchange", () => switchView(getInitialView(), { updateHash: false }));
  elements.typingSurface.addEventListener("click", focusTypingInput);
  elements.typingInput.addEventListener("input", handleTypingInput);
  elements.typingInput.addEventListener("keydown", handleTypingKeydown);
  elements.typingInput.addEventListener("paste", (event) => {
    event.preventDefault();
    showToast("Einfügen ist während einer Übung deaktiviert.");
  });
  elements.typingInput.addEventListener("focus", () => elements.typingHint.classList.add("is-hidden"));

  $("#new-exercise-button").addEventListener("click", startNextExercise);
  elements.exerciseSelect.addEventListener("change", () => {
    const selectedIndex = EXERCISES.findIndex((exercise) => exercise.id === elements.exerciseSelect.value);
    if (selectedIndex < 0) return;
    exerciseIndex = selectedIndex;
    loadExercise(EXERCISES[selectedIndex]);
  });
  $("#continue-button").addEventListener("click", startNextExercise);
  $("#review-analysis-button").addEventListener("click", () => switchView("analysis"));
  $("#personalized-button").addEventListener("click", startPersonalizedExercise);

  $("#custom-text-button").addEventListener("click", openCustomDialog);
  $("#close-custom-dialog").addEventListener("click", closeCustomDialog);
  $("#cancel-custom-dialog").addEventListener("click", closeCustomDialog);
  elements.customForm.addEventListener("submit", startCustomExercise);
  elements.customText.addEventListener("input", () => {
    elements.customError.hidden = true;
  });

  elements.themeToggle.addEventListener("click", () => {
    applyTheme(appData.theme === "dark" ? "light" : "dark");
  });

  elements.goalInput.addEventListener("input", () => {
    appData.goalWpm = clamp(Number(elements.goalInput.value) || 60, 20, 120);
    saveData();
    renderGoal();
  });

  $("#reset-progress-button").addEventListener("click", () => elements.resetDialog.showModal());
  elements.resetDialog.addEventListener("close", () => {
    if (elements.resetDialog.returnValue === "confirm") resetProgress();
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    elements.installButton.hidden = false;
  });

  elements.installButton.addEventListener("click", installApp);
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    elements.installButton.hidden = true;
    showToast("KeyFlow wurde installiert. Beim nächsten Start wird der Fortschritt dauerhaft gespeichert.");
  });
}

function getInitialView() {
  const view = window.location.hash.replace("#", "");
  return ["practice", "analysis", "progress"].includes(view) ? view : "practice";
}

function switchView(view, { updateHash = true } = {}) {
  const safeView = ["practice", "analysis", "progress"].includes(view) ? view : "practice";

  $$('[data-view-panel]').forEach((panel) => {
    const active = panel.dataset.viewPanel === safeView;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });

  $$('[data-view]').forEach((button) => {
    const active = button.dataset.view === safeView;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  if (updateHash) history.replaceState(null, "", `#${safeView}`);
  if (safeView === "analysis") renderAnalysis();
  if (safeView === "progress") renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function loadExercise(exercise, { focus = true, modeLabel } = {}) {
  stopTimer();
  currentExercise = exercise;
  targetText = normalizeText(exercise.code).replace(/\n+$/u, "");
  typedText = "";
  startedAt = null;
  lastInputAt = null;
  totalKeystrokes = 0;
  incorrectKeystrokes = 0;
  sessionKeyStats = {};
  sessionBigramStats = {};
  sessionFinished = false;
  elements.typingInput.value = "";
  elements.exerciseTitle.textContent = exercise.title;
  elements.exerciseDescription.textContent = exercise.description;
  elements.exerciseMode.textContent = modeLabel || getModeLabel(exercise);
  elements.targetCodeAccessible.textContent = targetText;
  elements.exerciseSelect.value = EXERCISES.some((item) => item.id === exercise.id) ? exercise.id : "";
  elements.completionCard.hidden = true;
  elements.typingHint.classList.remove("is-hidden");
  renderTypingState();

  if (focus) {
    switchView("practice");
    window.requestAnimationFrame(focusTypingInput);
  }
}

function getModeLabel(exercise) {
  if (exercise.mode === "custom") return "EIGENER TEXT";
  if (exercise.mode === "personalized") return "PYTHON · PERSONALISIERT";
  if (exercise.package) return `PYTHON · ${exercise.package.toUpperCase()}`;
  return "PYTHON · STANDARD";
}

function renderExerciseLibrary() {
  const groups = new Map();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Übung auswählen";
  placeholder.disabled = true;
  const fragment = document.createDocumentFragment();
  fragment.append(placeholder);

  EXERCISES.forEach((exercise) => {
    const category = exercise.category || "Python Basics";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(exercise);
  });

  groups.forEach((exercises, category) => {
    const group = document.createElement("optgroup");
    group.label = category;
    exercises.forEach((exercise) => {
      const option = document.createElement("option");
      option.value = exercise.id;
      option.textContent = exercise.title;
      group.append(option);
    });
    fragment.append(group);
  });

  elements.exerciseSelect.replaceChildren(fragment);
}

function startNextExercise() {
  exerciseIndex = (exerciseIndex + 1) % EXERCISES.length;
  loadExercise(EXERCISES[exerciseIndex]);
}

function startPersonalizedExercise() {
  const weakCharacters = getWeakStats(appData.keyStats, 4).map((item) => item.key);
  const weakBigrams = getWeakStats(appData.bigramStats, 2).map((item) => item.key);
  const targets = [...weakCharacters, ...weakBigrams];

  if (targets.length === 0) {
    showToast("Noch zu wenig Daten – wir starten mit einer normalen Python-Übung.");
    startNextExercise();
    return;
  }

  const exercise = findBestExercise(targets);
  loadExercise({ ...exercise, mode: "personalized" }, { modeLabel: "PYTHON · PERSONALISIERT" });
}

function startTargetExercise(token, kind) {
  const exercise = findBestExercise([token]);
  const readable = prettyToken(token);
  loadExercise(
    { ...exercise, mode: "personalized" },
    { modeLabel: `GEZIELT · ${kind === "bigram" ? "BIGRAMM" : "ZEICHEN"} ${readable}` },
  );
}

function findBestExercise(targets) {
  const scored = EXERCISES.map((exercise) => {
    const code = exercise.code.toLowerCase();
    const score = targets.reduce((total, target) => total + countOccurrences(code, target.toLowerCase()), 0);
    return { exercise, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0].score > 0 ? scored[0].exercise : createTargetExercise(targets[0]);
}

function createTargetExercise(token) {
  const safeToken = token || "_";
  const repeated = Array(8).fill(safeToken).join(" ");
  return {
    id: `target-${Date.now()}`,
    title: `Fokus: ${prettyToken(safeToken)}`,
    description: "Kurze Zielübung für eine persönliche Schwachstelle.",
    code: [
      `# Fokus: ${safeToken}`,
      "def repeat_pattern():",
      `    # ${repeated}`,
      `    pattern = ${JSON.stringify(repeated)}`,
      "    return pattern",
      "",
      "print(repeat_pattern())",
    ].join("\n"),
    mode: "personalized",
  };
}

function countOccurrences(text, token) {
  if (!token) return 0;
  let count = 0;
  let position = 0;

  while ((position = text.indexOf(token, position)) !== -1) {
    count += 1;
    position += Math.max(1, token.length);
  }

  return count;
}

function openCustomDialog() {
  elements.customError.hidden = true;
  elements.customDialog.showModal();
  window.requestAnimationFrame(() => elements.customTitle.focus());
}

function closeCustomDialog() {
  elements.customDialog.close();
}

function startCustomExercise(event) {
  event.preventDefault();
  const code = normalizeText(elements.customText.value).replace(/\n+$/u, "");

  if (code.trim().length < 10) {
    elements.customError.hidden = false;
    elements.customText.focus();
    return;
  }

  const exercise = {
    id: `custom-${Date.now()}`,
    title: elements.customTitle.value.trim() || "Eigene Übung",
    description: "Dein eigener Inhalt – lokal verarbeitet und niemals hochgeladen.",
    code,
    mode: "custom",
  };

  elements.customDialog.close();
  elements.customForm.reset();
  loadExercise(exercise);
}

function focusTypingInput() {
  if (sessionFinished) return;
  elements.typingInput.focus({ preventScroll: true });
}

function handleTypingKeydown(event) {
  if (event.key === "Escape") {
    elements.typingInput.blur();
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    insertIntoTypingInput("    ");
  }
}

function insertIntoTypingInput(text) {
  const input = elements.typingInput;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.setRangeText(text, start, end, "end");
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleTypingInput() {
  if (sessionFinished) return;
  let nextValue = normalizeText(elements.typingInput.value);

  if (nextValue.length > targetText.length) {
    nextValue = nextValue.slice(0, targetText.length);
    elements.typingInput.value = nextValue;
  }

  const now = performance.now();
  const commonLength = commonPrefixLength(typedText, nextValue);
  const commonSuffix = commonSuffixLength(typedText, nextValue, commonLength);
  const changedEnd = nextValue.length - commonSuffix;
  const additions = changedEnd > commonLength ? nextValue.slice(commonLength, changedEnd) : "";

  if (additions.length > 0) {
    if (startedAt === null) {
      startedAt = now;
      startTimer();
    }

    const totalDelay = lastInputAt === null ? 0 : clamp(now - lastInputAt, 0, 2400);
    const perCharacterDelay = additions.length > 0 ? totalDelay / additions.length : 0;

    for (let offset = 0; offset < additions.length; offset += 1) {
      const index = commonLength + offset;
      recordAttempt(index, nextValue[index], offset === 0 ? perCharacterDelay : Math.max(35, perCharacterDelay));
    }

    lastInputAt = now;
  }

  typedText = nextValue;
  renderTypingState();

  if (typedText === targetText && targetText.length > 0) finishSession();
}

function commonPrefixLength(left, right) {
  const limit = Math.min(left.length, right.length);
  let index = 0;
  while (index < limit && left[index] === right[index]) index += 1;
  return index;
}

function commonSuffixLength(left, right, prefixLength) {
  const available = Math.min(left.length, right.length) - prefixLength;
  let count = 0;

  while (count < available && left[left.length - 1 - count] === right[right.length - 1 - count]) {
    count += 1;
  }

  return count;
}

function recordAttempt(index, actualCharacter, delayMs) {
  const expectedCharacter = targetText[index];
  if (typeof expectedCharacter !== "string") return;
  const correct = actualCharacter === expectedCharacter;
  totalKeystrokes += 1;
  if (!correct) incorrectKeystrokes += 1;

  if (!/\s/u.test(expectedCharacter)) {
    updateStat(sessionKeyStats, expectedCharacter.toLowerCase(), correct, delayMs);
  }

  if (index > 0) {
    const expectedBigram = targetText.slice(index - 1, index + 1).toLowerCase();
    const actualBigram = elements.typingInput.value.slice(index - 1, index + 1).toLowerCase();
    if (!/\s/u.test(expectedBigram) && expectedBigram.length === 2) {
      updateStat(sessionBigramStats, expectedBigram, actualBigram === expectedBigram, delayMs);
    }
  }
}

function updateStat(collection, key, correct, delayMs) {
  const stat = collection[key] || { attempts: 0, errors: 0, totalMs: 0, timedAttempts: 0 };
  stat.attempts += 1;
  if (!correct) stat.errors += 1;

  if (delayMs >= 20 && delayMs <= 2400) {
    stat.totalMs += delayMs;
    stat.timedAttempts += 1;
  }

  collection[key] = stat;
}

function renderTypingState() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < targetText.length; index += 1) {
    const span = document.createElement("span");
    const character = targetText[index];
    span.className = "char";
    span.textContent = character;

    if (index < typedText.length) {
      span.classList.add(typedText[index] === character ? "correct" : "incorrect");
      if (character === " ") span.classList.add("is-space");
    } else if (index === typedText.length && !sessionFinished) {
      span.classList.add("current");
    }

    fragment.append(span);
  }

  elements.codeDisplay.replaceChildren(fragment);
  renderLiveMetrics();
  renderFingerGuide();
}

function getLiveMetrics() {
  const elapsedSeconds = startedAt === null ? 0 : Math.max(0, (performance.now() - startedAt) / 1000);
  return calculateMetrics({
    targetText,
    typedText,
    totalKeystrokes,
    incorrectKeystrokes,
    elapsedSeconds,
    started: startedAt !== null,
  });
}

function renderLiveMetrics() {
  const metrics = getLiveMetrics();
  elements.wpm.textContent = String(metrics.wpm);
  elements.accuracy.textContent = `${metrics.accuracy}%`;
  elements.time.textContent = formatDuration(metrics.elapsedSeconds);
  elements.progressValue.textContent = `${metrics.progress}%`;
  elements.progressBar.style.width = `${metrics.progress}%`;
  elements.progress.setAttribute("aria-valuenow", String(metrics.progress));
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(renderLiveMetrics, 250);
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function finishSession() {
  if (sessionFinished) return;
  sessionFinished = true;
  stopTimer();
  const metrics = getLiveMetrics();
  const duration = Math.max(1, Math.round(metrics.elapsedSeconds));
  const session = {
    id: window.crypto?.randomUUID?.() || String(Date.now()),
    date: new Date().toISOString(),
    title: currentExercise.title,
    mode: currentExercise.mode || "standard",
    wpm: metrics.wpm,
    accuracy: metrics.accuracy,
    duration,
    characters: targetText.length,
  };

  appData.sessions = [...appData.sessions, session].slice(-100);
  mergeStats(appData.keyStats, sessionKeyStats);
  mergeStats(appData.bigramStats, sessionBigramStats);
  saveData();
  elements.typingInput.blur();
  elements.completionSummary.textContent = `${metrics.wpm} WPM · ${metrics.accuracy}% Genauigkeit · ${formatDuration(duration)}`;
  elements.completionCard.hidden = false;
  elements.completionCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  renderTypingState();
  renderAnalysis();
  renderProgress();
}

function mergeStats(target, source) {
  for (const [key, sourceStat] of Object.entries(source)) {
    const targetStat = target[key] || { attempts: 0, errors: 0, totalMs: 0, timedAttempts: 0 };
    targetStat.attempts += sourceStat.attempts;
    targetStat.errors += sourceStat.errors;
    targetStat.totalMs += sourceStat.totalMs;
    targetStat.timedAttempts += sourceStat.timedAttempts;
    target[key] = targetStat;
  }
}

function renderKeyboard() {
  const fragment = document.createDocumentFragment();

  KEYBOARD_ROWS.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.className = "keyboard-row";

    row.forEach((label) => {
      const keyElement = document.createElement("span");
      const key = label === "Leertaste" ? "space" : label.toLowerCase();
      keyElement.className = "key";
      keyElement.dataset.key = key;
      keyElement.textContent = label;
      if (key === "space") keyElement.classList.add("key-wide");
      rowElement.append(keyElement);
    });

    fragment.append(rowElement);
  });

  elements.keyboard.replaceChildren(fragment);
}

function renderFingerGuide() {
  const nextCharacter = targetText[typedText.length];
  const baseKey = getBaseKey(nextCharacter);
  const fingerId = getFingerId(baseKey);
  const finger = FINGERS[fingerId] || FINGERS["r-pinky"];
  const keyLabel = formatKeyLabel(nextCharacter, baseKey);

  elements.nextKey.textContent = sessionFinished ? "✓" : keyLabel;
  elements.nextFinger.textContent = sessionFinished ? "Übung abgeschlossen" : finger.label;
  elements.keyboardHand.textContent = sessionFinished ? "Geschafft" : finger.hand;

  $$(".key", elements.keyboard).forEach((keyElement) => {
    keyElement.classList.toggle("is-next", !sessionFinished && keyElement.dataset.key === baseKey);
  });
}

function getBaseKey(character) {
  if (character === undefined) return "";
  return (SHIFTED_KEY_MAP[character] || character).toLowerCase();
}

function getFingerId(baseKey) {
  for (const [fingerId, keys] of Object.entries(FINGER_KEYS)) {
    if (keys.includes(baseKey)) return fingerId;
  }
  return "r-pinky";
}

function formatKeyLabel(character, baseKey) {
  if (character === undefined) return "✓";
  if (character === " ") return "␠";
  if (character === "\n") return "↵";
  if (character === "\t") return "Tab";
  if (character !== baseKey && character.toLowerCase() !== baseKey) return character;
  return character.toUpperCase();
}

function renderAnalysis() {
  const hasData = Object.keys(appData.keyStats).length > 0;
  elements.analysisEmpty.hidden = hasData;
  elements.analysisContent.hidden = !hasData;
  if (!hasData) return;

  renderRankList(elements.characterStats, getWeakStats(appData.keyStats, 6), "character");
  renderRankList(elements.bigramStats, getWeakStats(appData.bigramStats, 6), "bigram");
  renderHandStats();
}

function getWeakStats(collection, limit) {
  return Object.entries(collection)
    .filter(([, stat]) => stat.attempts > 0)
    .map(([key, stat]) => {
      const accuracy = clamp(Math.round(((stat.attempts - stat.errors) / stat.attempts) * 100), 0, 100);
      const averageMs = stat.timedAttempts > 0 ? Math.round(stat.totalMs / stat.timedAttempts) : 0;
      const errorWeight = (100 - accuracy) / 100;
      const speedWeight = averageMs > 0 ? clamp(averageMs / 900, 0, 1) : 0;
      const sampleConfidence = clamp(stat.attempts / 8, 0.35, 1);
      const weakness = (errorWeight * 0.72 + speedWeight * 0.28) * sampleConfidence;
      return { key, ...stat, accuracy, averageMs, weakness };
    })
    .sort((left, right) => right.weakness - left.weakness || right.attempts - left.attempts)
    .slice(0, limit);
}

function renderRankList(container, items, kind) {
  const fragment = document.createDocumentFragment();

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = "Noch nicht genug Daten.";
    fragment.append(empty);
  }

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "rank-row";
    button.setAttribute("aria-label", `${prettyToken(item.key)} gezielt üben`);
    button.addEventListener("click", () => startTargetExercise(item.key, kind));

    const token = document.createElement("span");
    token.className = "rank-token";
    token.textContent = prettyToken(item.key);

    const details = document.createElement("span");
    details.className = "rank-details";
    const caption = document.createElement("span");
    caption.textContent = item.averageMs > 0 ? `${item.averageMs} ms · ${item.attempts} Versuche` : `${item.attempts} Versuche`;
    const track = document.createElement("span");
    track.className = "micro-track";
    const fill = document.createElement("span");
    const errorRate = 100 - item.accuracy;
    fill.style.width = `${errorRate > 0 ? Math.max(4, errorRate) : 0}%`;
    track.append(fill);
    details.append(caption, track);

    const value = document.createElement("span");
    value.className = "rank-value";
    value.textContent = `${item.accuracy}%`;
    button.append(token, details, value);
    fragment.append(button);
  });

  container.replaceChildren(fragment);
}

function renderHandStats() {
  const fingerStats = {};

  for (const fingerId of Object.keys(FINGERS)) {
    fingerStats[fingerId] = { attempts: 0, errors: 0, totalMs: 0, timedAttempts: 0 };
  }

  for (const [character, stat] of Object.entries(appData.keyStats)) {
    const fingerId = getFingerId(getBaseKey(character));
    fingerStats[fingerId].attempts += stat.attempts;
    fingerStats[fingerId].errors += stat.errors;
    fingerStats[fingerId].totalMs += stat.totalMs;
    fingerStats[fingerId].timedAttempts += stat.timedAttempts;
  }

  const left = aggregateFingerSide(fingerStats, "l-");
  const right = aggregateFingerSide(fingerStats, "r-");
  const leftAccuracy = accuracyFromStat(left);
  const rightAccuracy = accuracyFromStat(right);
  const difference = Math.abs(leftAccuracy - rightAccuracy);
  elements.handBalanceLabel.textContent =
    left.attempts === 0 || right.attempts === 0
      ? "Mehr Daten nötig"
      : difference <= 4
        ? "Ausgeglichen"
        : leftAccuracy < rightAccuracy
          ? "Links braucht Fokus"
          : "Rechts braucht Fokus";

  elements.handSummary.replaceChildren(
    createHandCard("Linke Hand", leftAccuracy, left),
    createHandCard("Rechte Hand", rightAccuracy, right),
  );

  const fragment = document.createDocumentFragment();
  Object.entries(fingerStats)
    .filter(([fingerId]) => fingerId !== "thumbs")
    .forEach(([fingerId, stat]) => {
      const accuracy = accuracyFromStat(stat);
      const wrapper = document.createElement("div");
      wrapper.className = "finger-stat";

      const heading = document.createElement("div");
      heading.className = "finger-stat-heading";
      const label = document.createElement("span");
      label.textContent = FINGERS[fingerId].short;
      const value = document.createElement("strong");
      const averageMs = averageMsFromStat(stat);
      value.textContent = stat.attempts > 0 ? `${accuracy}%${averageMs > 0 ? ` · ${averageMs} ms` : ""}` : "–";
      heading.append(label, value);

      const track = document.createElement("div");
      track.className = "finger-track";
      const fill = document.createElement("span");
      fill.style.width = `${stat.attempts > 0 ? accuracy : 0}%`;
      track.append(fill);
      wrapper.append(heading, track);
      fragment.append(wrapper);
    });

  elements.fingerStats.replaceChildren(fragment);
}

function aggregateFingerSide(stats, prefix) {
  return Object.entries(stats)
    .filter(([fingerId]) => fingerId.startsWith(prefix))
    .reduce(
      (result, [, stat]) => ({
        attempts: result.attempts + stat.attempts,
        errors: result.errors + stat.errors,
        totalMs: result.totalMs + stat.totalMs,
        timedAttempts: result.timedAttempts + stat.timedAttempts,
      }),
      { attempts: 0, errors: 0, totalMs: 0, timedAttempts: 0 },
    );
}

function accuracyFromStat(stat) {
  return stat.attempts > 0 ? clamp(Math.round(((stat.attempts - stat.errors) / stat.attempts) * 100), 0, 100) : 0;
}

function averageMsFromStat(stat) {
  return stat.timedAttempts > 0 ? Math.round(stat.totalMs / stat.timedAttempts) : 0;
}

function createHandCard(label, accuracy, stat) {
  const card = document.createElement("div");
  card.className = "hand-card";
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = label;
  const detail = document.createElement("span");
  const averageMs = averageMsFromStat(stat);
  detail.textContent = `${stat.attempts} Anschläge${averageMs > 0 ? ` · Ø ${averageMs} ms` : ""}`;
  copy.append(title, detail);
  const value = document.createElement("strong");
  value.textContent = stat.attempts > 0 ? `${accuracy}%` : "–";
  card.append(copy, value);
  return card;
}

function renderProgress() {
  const sessions = [...appData.sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const bestWpm = sessions.reduce((best, session) => Math.max(best, Number(session.wpm) || 0), 0);
  const totalSeconds = sessions.reduce((total, session) => total + (Number(session.duration) || 0), 0);
  const streak = calculateStreak(sessions);

  elements.bestWpm.textContent = `${bestWpm} WPM`;
  elements.streak.textContent = `${streak} ${streak === 1 ? "Tag" : "Tage"}`;
  elements.totalTime.textContent = `${Math.round(totalSeconds / 60)} Min.`;
  renderGoal(bestWpm);
  renderChart(sessions);
  renderHistory(sessions);
}

function renderGoal(bestWpmOverride) {
  const bestWpm = Number.isFinite(bestWpmOverride)
    ? bestWpmOverride
    : appData.sessions.reduce((best, session) => Math.max(best, Number(session.wpm) || 0), 0);
  const goal = appData.goalWpm;
  const percentage = goal > 0 ? clamp(Math.round((bestWpm / goal) * 100), 0, 100) : 0;
  elements.goalInput.value = String(goal);
  elements.goalOutput.textContent = `${goal} WPM`;
  elements.goalProgress.style.width = `${percentage}%`;

  if (bestWpm === 0) {
    elements.goalCopy.textContent = "Starte mit einer Übung, um deinen Abstand zum Ziel zu sehen.";
  } else if (bestWpm >= goal) {
    elements.goalCopy.textContent = `Ziel erreicht – deine Bestleistung liegt bei ${bestWpm} WPM.`;
  } else {
    elements.goalCopy.textContent = `Noch ${goal - bestWpm} WPM bis zu deinem Ziel.`;
  }
}

function renderChart(sessions) {
  const points = sessions.slice(-10);
  const hasPoints = points.length > 0;
  elements.chart.toggleAttribute("hidden", !hasPoints);
  elements.chartEmpty.hidden = hasPoints;

  if (!hasPoints) {
    elements.chartCaption.textContent = "Noch keine Daten";
    elements.chart.replaceChildren();
    return;
  }

  const width = 720;
  const height = 250;
  const margin = { top: 28, right: 24, bottom: 38, left: 44 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const values = points.map((session) => Number(session.wpm) || 0);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const minValue = Math.max(0, Math.floor((rawMin - 8) / 10) * 10);
  const maxValue = Math.max(minValue + 20, Math.ceil((rawMax + 8) / 10) * 10);
  const xAt = (index) => margin.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
  const yAt = (value) => margin.top + plotHeight - ((value - minValue) / (maxValue - minValue)) * plotHeight;
  const linePoints = points.map((session, index) => `${xAt(index)},${yAt(Number(session.wpm) || 0)}`).join(" ");
  const average = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  const fragment = document.createDocumentFragment();

  for (let step = 0; step <= 3; step += 1) {
    const value = minValue + ((maxValue - minValue) / 3) * step;
    const y = yAt(value);
    const line = createSvg("line", {
      x1: margin.left,
      x2: width - margin.right,
      y1: y,
      y2: y,
      class: "chart-grid",
    });
    const label = createSvg("text", { x: margin.left - 10, y: y + 4, class: "chart-label", "text-anchor": "end" });
    label.textContent = String(Math.round(value));
    fragment.append(line, label);
  }

  const areaPath = `M ${xAt(0)} ${margin.top + plotHeight} L ${linePoints.replaceAll(" ", " L ")} L ${xAt(points.length - 1)} ${margin.top + plotHeight} Z`;
  fragment.append(createSvg("path", { d: areaPath, class: "chart-area" }));
  fragment.append(createSvg("polyline", { points: linePoints, class: "chart-line" }));

  points.forEach((session, index) => {
    const x = xAt(index);
    const y = yAt(Number(session.wpm) || 0);
    const circle = createSvg("circle", { cx: x, cy: y, r: 5, class: "chart-dot" });
    const value = createSvg("text", { x, y: y - 13, class: "chart-value", "text-anchor": "middle" });
    value.textContent = String(Math.round(Number(session.wpm) || 0));
    const date = createSvg("text", {
      x,
      y: height - 12,
      class: "chart-label",
      "text-anchor": index === 0 ? "start" : index === points.length - 1 ? "end" : "middle",
    });
    date.textContent = formatShortDate(session.date);
    fragment.append(circle, value, date);
  });

  elements.chart.replaceChildren(fragment);
  elements.chartCaption.textContent = `${points.length} ${points.length === 1 ? "Session" : "Sessions"} · Ø ${average} WPM`;
}

function createSvg(name, attributes) {
  const element = document.createElementNS(svgNS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
}

function renderHistory(sessions) {
  const recent = [...sessions].reverse().slice(0, 6);
  const fragment = document.createDocumentFragment();

  if (recent.length === 0) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = "Noch keine abgeschlossenen Übungen.";
    fragment.append(empty);
  }

  recent.forEach((session) => {
    const row = document.createElement("div");
    row.className = "history-row";

    const title = document.createElement("div");
    title.className = "history-title";
    const titleStrong = document.createElement("strong");
    titleStrong.textContent = session.title;
    const date = document.createElement("span");
    date.textContent = formatLongDate(session.date);
    title.append(titleStrong, date);
    row.append(
      title,
      createHistoryStat(`${Math.round(Number(session.wpm) || 0)}`, "WPM"),
      createHistoryStat(`${Math.round(Number(session.accuracy) || 0)}%`, "Genauigkeit"),
      createHistoryStat(formatDuration(Number(session.duration) || 0), "Zeit"),
    );
    fragment.append(row);
  });

  elements.history.replaceChildren(fragment);
}

function createHistoryStat(value, label) {
  const stat = document.createElement("div");
  stat.className = "history-stat";
  const strong = document.createElement("strong");
  strong.textContent = value;
  const caption = document.createElement("span");
  caption.textContent = label;
  stat.append(strong, caption);
  return stat;
}

function resetProgress() {
  appStorage.removeItem(STORAGE_KEY);
  appData = defaultData();
  applyTheme("light", false);
  elements.goalInput.value = String(appData.goalWpm);
  loadExercise(EXERCISES[0], { focus: false });
  renderAnalysis();
  renderProgress();
  showToast("Dein Fortschritt wurde gelöscht.");
}

function applyTheme(theme, persist = true) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = safeTheme;
  appData.theme = safeTheme;
  elements.themeIcon.textContent = safeTheme === "dark" ? "☀" : "◐";
  elements.themeToggle.setAttribute(
    "aria-label",
    safeTheme === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren",
  );
  elements.themeMeta.setAttribute("content", safeTheme === "dark" ? "#1a1b26" : "#ffffff");
  if (persist) saveData();
}

function updateStorageMode() {
  if (isStandalone) {
    elements.storageBadge.textContent = "Lokal gespeichert";
    elements.modeNotice.innerHTML = "<strong>Installiert:</strong> Dein Fortschritt wird dauerhaft auf diesem Gerät gespeichert.";
    elements.installButton.hidden = true;
  } else {
    elements.storageBadge.textContent = "Demo-Modus";
    elements.modeNotice.innerHTML = "<strong>Demo:</strong> Dein Fortschritt bleibt nur in diesem Tab. Nach dem Schließen startest du frisch.";
  }
}

async function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  if (choice.outcome === "accepted") showToast("Installation wird vorbereitet …");
  deferredInstallPrompt = null;
  elements.installButton.hidden = true;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return;
  navigator.serviceWorker.register("./sw.js").catch(() => {
    showToast("Offline-Modus ist in diesem Browser nicht verfügbar.");
  });
}

function normalizeText(value) {
  return String(value).replace(/\r\n?/gu, "\n");
}

function prettyToken(token) {
  if (token === " ") return "␠";
  if (token === "\n") return "↵";
  return token;
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit" }).format(new Date(value));
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 3200);
}

init();
