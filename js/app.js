"use strict";

const CYCLE_MS = 10 * 60 * 1000;
const SHORT_STEP_MS = 30 * 1000;
const LONG_STEP_MS = 5 * 60 * 1000;

const ui = {
  clock: document.getElementById("current-time"),
  counter30: document.getElementById("counter-30"),
  counter5: document.getElementById("counter-5"),
  counter10: document.getElementById("counter-10"),
  remaining: document.getElementById("remaining-time"),
  state: document.getElementById("state-label"),
  control: document.getElementById("start-pause"),
  tabs: [...document.querySelectorAll(".cycle-tab")],
  sound: document.getElementById("cricket-sound")
};

let selectedCycles = 2;
let phase = "ready";
let elapsedBeforeRun = 0;
let startedAt = 0;
let previousElapsed = 0;
let tickHandle = 0;
let soundStopHandle = 0;
let beepContext;
let activeBeeps = [];

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatClock(date) {
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}.${pad(date.getSeconds())}`;
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
}

function totalDuration() {
  return selectedCycles * CYCLE_MS;
}

function currentElapsed() {
  if (phase !== "running") return elapsedBeforeRun;
  return elapsedBeforeRun + (Date.now() - startedAt);
}

function updateClock() {
  const now = new Date();
  ui.clock.textContent = formatClock(now);
  ui.clock.dateTime = now.toISOString();
}

function getBeepContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!beepContext) beepContext = new AudioContextClass();
  return beepContext;
}

function stopTripleBeep() {
  activeBeeps.forEach((oscillator) => {
    try { oscillator.stop(); } catch (_) { /* Oscillator has already ended. */ }
  });
  activeBeeps = [];
}

function stopSound() {
  window.clearTimeout(soundStopHandle);
  stopTripleBeep();
  ui.sound.pause();
  ui.sound.currentTime = 0;
  ui.sound.loop = false;
}

function playSound(durationMs) {
  stopSound();
  ui.sound.loop = true;
  ui.sound.currentTime = 0;
  const promise = ui.sound.play();
  if (promise) promise.catch(() => {});
  soundStopHandle = window.setTimeout(stopSound, durationMs);
}

function playTripleBeep() {
  stopSound();
  const context = getBeepContext();
  if (!context || context.state !== "running") return;

  const firstBeepAt = context.currentTime + 0.02;
  [0, 0.25, 0.5].forEach((offset) => {
    const startedAt = firstBeepAt + offset;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, startedAt);
    gain.gain.setValueAtTime(0.0001, startedAt);
    gain.gain.exponentialRampToValueAtTime(0.14, startedAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startedAt + 0.14);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => {
      activeBeeps = activeBeeps.filter((item) => item !== oscillator);
    };
    activeBeeps.push(oscillator);
    oscillator.start(startedAt);
    oscillator.stop(startedAt + 0.15);
  });
}

function crossedBoundary(before, after, interval) {
  return Math.floor(after / interval) > Math.floor(before / interval);
}

function render(elapsed = currentElapsed()) {
  const clamped = Math.min(elapsed, totalDuration());
  ui.counter30.textContent = String(Math.floor(clamped / SHORT_STEP_MS));
  ui.counter5.textContent = String(Math.floor(clamped / LONG_STEP_MS) % 10);
  ui.counter10.textContent = String(Math.min(2, Math.floor(clamped / CYCLE_MS)));
  ui.remaining.textContent = formatDuration(totalDuration() - clamped);
}

function setPhase(nextPhase) {
  phase = nextPhase;
  const running = phase === "running";
  const done = phase === "done";

  ui.tabs.forEach((tab) => { tab.disabled = running || phase === "paused"; });
  ui.control.classList.toggle("is-running", running);
  ui.control.classList.toggle("is-done", done);
  ui.control.textContent = running ? "PAUSE" : phase === "paused" ? "RESUME" : done ? "START AGAIN" : "START";
  ui.state.textContent = running ? "RUNNING" : phase === "paused" ? "PAUSED" : done ? "DONE" : "READY";
}

function finish() {
  elapsedBeforeRun = totalDuration();
  previousElapsed = elapsedBeforeRun;
  window.clearInterval(tickHandle);
  setPhase("done");
  render(elapsedBeforeRun);
  playSound(30000);
}

function tick() {
  const elapsed = currentElapsed();
  if (elapsed >= totalDuration()) {
    finish();
    return;
  }

  const crossedLong = crossedBoundary(previousElapsed, elapsed, LONG_STEP_MS);
  const crossedShort = crossedBoundary(previousElapsed, elapsed, SHORT_STEP_MS);
  if (crossedLong) playSound(10000);
  else if (crossedShort) playTripleBeep();

  previousElapsed = elapsed;
  render(elapsed);
}

function unlockAudio() {
  ui.sound.volume = 0.55;
  const context = getBeepContext();
  if (context && context.state === "suspended") context.resume().catch(() => {});
  const promise = ui.sound.play();
  if (promise) {
    promise.then(() => {
      ui.sound.pause();
      ui.sound.currentTime = 0;
    }).catch(() => {});
  }
}

function start() {
  if (phase === "done") {
    elapsedBeforeRun = 0;
    previousElapsed = 0;
  }
  unlockAudio();
  startedAt = Date.now();
  setPhase("running");
  tickHandle = window.setInterval(tick, 100);
  tick();
}

function pause() {
  elapsedBeforeRun = currentElapsed();
  previousElapsed = elapsedBeforeRun;
  window.clearInterval(tickHandle);
  stopSound();
  setPhase("paused");
  render(elapsedBeforeRun);
}

function selectCycles(cycles) {
  if (phase === "running" || phase === "paused") return;
  selectedCycles = cycles;
  elapsedBeforeRun = 0;
  previousElapsed = 0;
  setPhase("ready");
  ui.tabs.forEach((tab) => {
    const selected = Number(tab.dataset.cycles) === cycles;
    tab.classList.toggle("is-selected", selected);
    tab.setAttribute("aria-pressed", String(selected));
  });
  render(0);
}

ui.control.addEventListener("click", () => {
  if (phase === "running") pause();
  else start();
});

ui.tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectCycles(Number(tab.dataset.cycles)));
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && phase === "running") tick();
});

window.__fasciaTest = {
  render,
  selectCycles,
  getState: () => ({ phase, selectedCycles, elapsed: currentElapsed(), duration: totalDuration() })
};

updateClock();
window.setInterval(updateClock, 1000);
selectCycles(2);
