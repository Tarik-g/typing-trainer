import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { chooseStorageMode, isValidSession, calculateMetrics, calculateStreak } = require("../core.js");

const validSession = (date, overrides = {}) => ({
  date: date.toISOString(),
  wpm: 50,
  accuracy: 96,
  duration: 60,
  characters: 250,
  ...overrides,
});

test("ordinary HTTPS uses temporary session storage", () => {
  assert.equal(chooseStorageMode({ protocol: "https:" }), "session");
});

test("installed and local modes use persistent storage", () => {
  assert.equal(chooseStorageMode({ displayStandalone: true, protocol: "https:" }), "local");
  assert.equal(chooseStorageMode({ displayWindowControlsOverlay: true, protocol: "https:" }), "local");
  assert.equal(chooseStorageMode({ navigatorStandalone: true, protocol: "https:" }), "local");
  assert.equal(chooseStorageMode({ protocol: "file:" }), "local");
});

test("typing metrics keep true accuracy after a correction", () => {
  const untouched = calculateMetrics({ targetText: "abc" });
  assert.deepEqual(
    { wpm: untouched.wpm, accuracy: untouched.accuracy, progress: untouched.progress },
    { wpm: 0, accuracy: 100, progress: 0 },
  );

  const normal = calculateMetrics({
    targetText: "a".repeat(25),
    typedText: "a".repeat(25),
    totalKeystrokes: 25,
    elapsedSeconds: 60,
    started: true,
  });
  assert.equal(normal.wpm, 5);
  assert.equal(normal.complete, true);

  const corrected = calculateMetrics({
    targetText: "a",
    typedText: "a",
    totalKeystrokes: 2,
    incorrectKeystrokes: 1,
    elapsedSeconds: 2,
    started: true,
  });
  assert.equal(corrected.accuracy, 50);
  assert.equal(corrected.complete, true);
});

test("stored sessions reject malformed dates and impossible values", () => {
  assert.equal(isValidSession(validSession(new Date("2026-11-05T12:00:00Z"))), true);
  assert.equal(isValidSession({ ...validSession(new Date()), date: "kaputt" }), false);
  assert.equal(isValidSession(validSession(new Date(), { accuracy: 140 })), false);
  assert.equal(isValidSession(validSession(new Date(), { duration: -1 })), false);
});

test("streak counts unique consecutive local days", () => {
  const now = new Date(2026, 10, 5, 12);
  const sessions = [
    validSession(new Date(2026, 10, 5, 9)),
    validSession(new Date(2026, 10, 4, 18)),
    validSession(new Date(2026, 10, 4, 10)),
    validSession(new Date(2026, 10, 3, 16)),
  ];
  assert.equal(calculateStreak(sessions, now), 3);
  assert.equal(calculateStreak([sessions[0], sessions[3]], now), 1);
});
