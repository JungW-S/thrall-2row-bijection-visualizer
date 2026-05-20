import {
  computeContinuedTrace,
  computeXiTrace,
  defaultExample,
  dominoOuterPartition,
  evaluation,
  maxRandomEqualN,
  parseStraightTableau,
  randomEqualSYT,
  spin,
  tableauToInputText,
  xiReadiness,
} from "./core.mjs?v=20260520-story-polish-44";
import { renderStep, renderStepList } from "./render.mjs?v=20260520-story-polish-44";
import { renderStory } from "./story.mjs?v=20260520-story-polish-44";

const input = document.querySelector("#tableau-input");
const runButton = document.querySelector("#run-button");
const randomNInput = document.querySelector("#random-n");
const randomButton = document.querySelector("#random-button");
const errorBox = document.querySelector("#error-box");
const storyModeButton = document.querySelector("#story-mode-button");
const detailModeButton = document.querySelector("#detail-mode-button");
const storyView = document.querySelector("#story-view");
const detailView = document.querySelector("#detail-view");
const metaBox = document.querySelector("#meta-box");
const stepContainer = document.querySelector("#step-container");
const stepList = document.querySelector("#step-list");
const prevButton = document.querySelector("#prev-step");
const nextButton = document.querySelector("#next-step");
const counter = document.querySelector("#step-counter");

let currentTrace = null;
let currentIndex = 0;
let currentMode = "story";

storyView.tabIndex = -1;
detailView.tabIndex = -1;

function setMode(mode) {
  currentMode = mode;
  const storyActive = mode === "story";
  storyView.hidden = !storyActive;
  detailView.hidden = storyActive;
  storyModeButton.classList.toggle("active", storyActive);
  detailModeButton.classList.toggle("active", !storyActive);
}

function setError(message) {
  errorBox.textContent = message;
  errorBox.hidden = message === "";
  errorBox.className = "error";
}

function setWarning(message) {
  errorBox.textContent = message;
  errorBox.hidden = message === "";
  errorBox.className = "error warning";
}

function updateMeta(trace) {
  const outShape = dominoOuterPartition(trace.result).join(",");
  const evalText = evaluation(trace.result).join(",");
  metaBox.innerHTML = `
    <span><strong>T</strong> ${trace.mode === "continued" ? "∉" : "∈"} SYT<sup>=</sup>(2n)</span>
    <span><strong>n</strong> = ${trace.n}</span>
    <span><strong>λ</strong> = (${trace.lambda.join(",")})</span>
    <span><strong>sh(D)</strong> = (${outShape})</span>
    <span><strong>evaluation</strong> = (${evalText})</span>
    <span><strong>spin(D)</strong> = ${spin(trace.result)}</span>
  `;
}

function showStep(index) {
  if (!currentTrace) return;
  currentIndex = Math.max(0, Math.min(index, currentTrace.steps.length - 1));
  renderStep(currentTrace.steps[currentIndex], stepContainer);
  renderStepList(currentTrace, currentIndex, stepList, showStep);
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === currentTrace.steps.length - 1;
  counter.textContent = `${currentIndex + 1} / ${currentTrace.steps.length}`;
}

function isTextEntryTarget(target) {
  if (!(target instanceof Element)) return false;
  if (target.closest("textarea, input, select")) return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

function handleKeyboardNavigation(event) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (isTextEntryTarget(event.target)) return;
  const previousKeys = new Set(["ArrowLeft", "ArrowUp", "PageUp"]);
  const nextKeys = new Set(["ArrowRight", "ArrowDown", "PageDown"]);
  const isPrevious = previousKeys.has(event.key);
  const isNext = nextKeys.has(event.key);
  const isBoundary = event.key === "Home" || event.key === "End";
  if (!isPrevious && !isNext && !isBoundary) return;
  if (!currentTrace) return;
  event.preventDefault();
  if (currentMode === "story") {
    if (typeof storyView._storyGo !== "function") return;
    if (event.key === "Home") storyView._storyGo("start");
    else if (event.key === "End") storyView._storyGo("end");
    else storyView._storyGo(isNext ? 1 : -1);
    return;
  }
  if (event.key === "Home") showStep(0);
  else if (event.key === "End") showStep(currentTrace.steps.length - 1);
  else showStep(currentIndex + (isNext ? 1 : -1));
}

function initialStepIndex(trace) {
  const raw = new URLSearchParams(window.location.search).get("step");
  if (raw === null) return 0;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed)) return 0;
  return Math.max(0, Math.min(parsed - 1, trace.steps.length - 1));
}

function run() {
  try {
    setError("");
    const tableau = parseStraightTableau(input.value);
    const readiness = xiReadiness(tableau);
    if (!readiness.ok) {
      if (readiness.kind !== "not-in-SYT-eq") {
        currentTrace = null;
        stepList.replaceChildren();
        prevButton.disabled = true;
        nextButton.disabled = true;
        counter.textContent = "0 / 0";
        renderStory(null, storyView);
        metaBox.innerHTML = `
          <span><strong>size</strong> = ${readiness.size}</span>
          <span><strong>shape</strong> = (${readiness.shape.join(",")})</span>
          ${readiness.n ? `<span><strong>n</strong> = ${readiness.n}</span>` : ""}
        `;
        setError(readiness.message);
        return;
      }
      currentTrace = computeContinuedTrace(tableau);
      updateMeta(currentTrace);
      renderStory(currentTrace, storyView);
      setWarning(currentTrace.warning);
      showStep(initialStepIndex(currentTrace));
      return;
    }
    currentTrace = computeXiTrace(tableau);
    updateMeta(currentTrace);
    renderStory(currentTrace, storyView);
    showStep(initialStepIndex(currentTrace));
  } catch (err) {
    currentTrace = null;
    metaBox.replaceChildren();
    stepContainer.replaceChildren();
    stepList.replaceChildren();
    renderStory(null, storyView);
    counter.textContent = "0 / 0";
    setError(err.message);
  }
}

async function loadRandomTableau() {
  const originalText = randomButton.textContent;
  try {
    setError("");
    randomButton.disabled = true;
    randomButton.textContent = "Choosing...";
    await new Promise((resolve) => setTimeout(resolve, 0));
    const previous = input.value.trim();
    let nextText = "";
    for (let attempt = 0; attempt < 10; attempt += 1) {
      nextText = tableauToInputText(randomEqualSYT(randomNInput.value));
      if (nextText.trim() !== previous) break;
    }
    input.value = nextText;
    run();
  } catch (err) {
    setError(err.message);
  } finally {
    randomButton.disabled = false;
    randomButton.textContent = originalText;
  }
}

runButton.addEventListener("click", run);
randomNInput.max = String(maxRandomEqualN);
randomButton.addEventListener("click", loadRandomTableau);
prevButton.addEventListener("click", () => showStep(currentIndex - 1));
nextButton.addEventListener("click", () => showStep(currentIndex + 1));
storyModeButton.addEventListener("click", () => setMode("story"));
detailModeButton.addEventListener("click", () => setMode("detail"));
document.addEventListener("keydown", handleKeyboardNavigation, { capture: true });

input.value = defaultExample;
setMode("story");
run();
