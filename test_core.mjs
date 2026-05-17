import {
  computeContinuedTrace,
  computeXiTrace,
  defaultExample,
  dominoData,
  dominoOuterPartition,
  evaluation,
  maxRandomEqualN,
  parseStraightTableau,
  randomEqualSYT,
  spin,
  tableauToInputText,
  xiReadiness,
} from "./src/core.mjs";

function assertEqual(actual, expected, message) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`${message}\nactual: ${actualText}\nexpected: ${expectedText}`);
  }
}

function assertThrows(fn, pattern, message) {
  try {
    fn();
  } catch (error) {
    if (!pattern.test(error.message)) {
      throw new Error(`${message}\nwrong error: ${error.message}`);
    }
    return;
  }
  throw new Error(`${message}\nexpected an error`);
}

const T = parseStraightTableau(defaultExample);
const trace = computeXiTrace(T);

assertEqual(xiReadiness(T).ok, true, "default example is xi-ready");
assertEqual(trace.lambda, [3, 2], "lambda");
assertEqual(dominoOuterPartition(trace.result), [6, 6, 4, 4], "outer partition");
assertEqual(evaluation(trace.result), [5, 3, 2], "evaluation");
assertEqual(spin(trace.result), 3, "spin");

const expected = [
  [1, [[1, 1], [2, 1]]],
  [1, [[1, 2], [2, 2]]],
  [1, [[1, 3], [2, 3]]],
  [1, [[1, 4], [2, 4]]],
  [1, [[1, 5], [1, 6]]],
  [2, [[2, 5], [2, 6]]],
  [2, [[3, 1], [4, 1]]],
  [2, [[3, 2], [3, 3]]],
  [3, [[3, 4], [4, 4]]],
  [3, [[4, 2], [4, 3]]],
];
assertEqual(dominoData(trace.result), expected, "final domino data");
assertEqual(trace.steps[2].switching.states.length > 1, true, "first switching trace");

const thetaSteps = trace.steps.filter((step) => step.title.startsWith("theta step"));
assertEqual(thetaSteps.length, 4, "theta step count");
thetaSteps.forEach((step, idx) => {
  assertEqual(Array.isArray(step.chainDetails), true, `theta ${idx + 1} chain details`);
  const openDominoIds = new Set(step.chainDetails.filter((chain) => chain.type === "open").flatMap((chain) => chain.dominoIds));
  step.openIds.forEach((id) => {
    if (!openDominoIds.has(id)) {
      throw new Error(`theta ${idx + 1}: open domino D${id} missing from open chains`);
    }
  });
});

assertThrows(
  () => computeXiTrace(parseStraightTableau("1 2\n3")),
  /even size/,
  "odd-size tableaux should be rejected",
);

const nonEqual = parseStraightTableau(`1 3 5
2 4 6`);
assertEqual(xiReadiness(nonEqual).ok, false, "non-equal example should be diagnosed");
const continued = computeContinuedTrace(nonEqual);
assertEqual(continued.mode, "continued", "non-equal continued mode");
assertEqual(continued.steps.length > 4, true, "non-equal trace should continue");
assertEqual(dominoOuterPartition(continued.result), [4, 4, 2, 2], "continued output shape");

const randomT = randomEqualSYT(3, () => 0);
assertEqual(xiReadiness(randomT).ok, true, "random equal tableau should be xi-ready");
assertEqual(xiReadiness(parseStraightTableau(tableauToInputText(randomT))).ok, true, "random text should parse back to xi-ready");
assertThrows(
  () => randomEqualSYT(maxRandomEqualN + 1),
  /currently enabled/,
  "random generator should reject large n",
);

assertThrows(
  () => parseStraightTableau("1 2a\n3 4"),
  /Invalid entry/,
  "parser should reject non-integer tokens",
);

(globalThis.print ?? console.log)("core tests passed");
