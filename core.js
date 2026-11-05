"use strict";

(function exposeKeyFlowCore(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.KeyFlowCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function chooseStorageMode({
    displayStandalone = false,
    displayWindowControlsOverlay = false,
    navigatorStandalone = false,
    windowControlsOverlayVisible = false,
    protocol = "",
  } = {}) {
    const persistent =
      displayStandalone ||
      displayWindowControlsOverlay ||
      navigatorStandalone ||
      windowControlsOverlayVisible ||
      protocol === "file:";
    return persistent ? "local" : "session";
  }

  function isValidSession(session) {
    if (!session || typeof session !== "object" || typeof session.date !== "string") return false;
    const date = Date.parse(session.date);
    const wpm = Number(session.wpm);
    const accuracy = Number(session.accuracy);
    const duration = Number(session.duration ?? 0);
    const characters = Number(session.characters ?? 0);

    return (
      Number.isFinite(date) &&
      Number.isFinite(wpm) &&
      wpm >= 0 &&
      wpm <= 500 &&
      Number.isFinite(accuracy) &&
      accuracy >= 0 &&
      accuracy <= 100 &&
      Number.isFinite(duration) &&
      duration >= 0 &&
      duration <= 86400 &&
      Number.isFinite(characters) &&
      characters >= 0 &&
      characters <= 1000000
    );
  }

  function calculateMetrics({
    targetText = "",
    typedText = "",
    totalKeystrokes = 0,
    incorrectKeystrokes = 0,
    elapsedSeconds = 0,
    started = false,
  } = {}) {
    let correctCharacters = 0;
    const typedLength = Math.min(typedText.length, targetText.length);

    for (let index = 0; index < typedLength; index += 1) {
      if (typedText[index] === targetText[index]) correctCharacters += 1;
    }

    const safeElapsed = Math.max(0, Number(elapsedSeconds) || 0);
    const minutes = Math.max(safeElapsed / 60, 1 / 60);
    const wpm = started ? Math.max(0, Math.round(correctCharacters / 5 / minutes)) : 0;
    const attempts = Math.max(0, Number(totalKeystrokes) || 0);
    const errors = clamp(Math.max(0, Number(incorrectKeystrokes) || 0), 0, attempts);
    const accuracy = attempts === 0 ? 100 : Math.round(((attempts - errors) / attempts) * 100);
    const progress = targetText.length === 0 ? 0 : Math.round((typedLength / targetText.length) * 100);

    return {
      elapsedSeconds: safeElapsed,
      correctCharacters,
      wpm,
      accuracy: clamp(accuracy, 0, 100),
      progress: clamp(progress, 0, 100),
      complete: targetText.length > 0 && typedText === targetText,
    };
  }

  function calculateStreak(sessions, now = new Date()) {
    if (!Array.isArray(sessions) || sessions.length === 0) return 0;
    const uniqueDays = [
      ...new Set(
        sessions
          .filter(isValidSession)
          .map((session) => localDateKey(new Date(session.date))),
      ),
    ].sort().reverse();
    if (uniqueDays.length === 0) return 0;

    const today = startOfLocalDay(now);
    const latest = parseLocalDateKey(uniqueDays[0]);
    const differenceFromToday = Math.round((today - latest) / 86400000);
    if (differenceFromToday > 1 || differenceFromToday < 0) return 0;

    let streak = 1;
    let previous = latest;

    for (let index = 1; index < uniqueDays.length; index += 1) {
      const current = parseLocalDateKey(uniqueDays[index]);
      const difference = Math.round((previous - current) / 86400000);
      if (difference !== 1) break;
      streak += 1;
      previous = current;
    }

    return streak;
  }

  function startOfLocalDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  }

  function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseLocalDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day, 12);
  }

  return { chooseStorageMode, isValidSession, calculateMetrics, calculateStreak };
});
