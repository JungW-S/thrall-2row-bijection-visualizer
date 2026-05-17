function key(cell) {
  return `${cell[0]},${cell[1]}`;
}

function cellFromKey(k) {
  return k.split(",").map((x) => Number.parseInt(x, 10));
}

function compareCells(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

function compareDominoData(a, b) {
  if (a[0] !== b[0]) return a[0] - b[0];
  const ac = a[1];
  const bc = b[1];
  for (let i = 0; i < 2; i += 1) {
    const c = compareCells(ac[i], bc[i]);
    if (c !== 0) return c;
  }
  return 0;
}

function cloneTableau(tableau) {
  return new Map(tableau);
}

function tableauEntries(tableau) {
  return Array.from(tableau.entries()).map(([k, value]) => ({
    cell: cellFromKey(k),
    value,
  }));
}

function sortedCellsFromTableau(tableau) {
  return tableauEntries(tableau).map((entry) => entry.cell).sort(compareCells);
}

function cellsFromKeys(keys) {
  return Array.from(keys).map(cellFromKey).sort(compareCells);
}

function normalizePartition(partition, name = "partition") {
  const part = partition.map((x) => Number.parseInt(x, 10)).filter((x) => x !== 0);
  if (part.some((x) => !Number.isInteger(x) || x < 0)) {
    throw new Error(`${name} has a negative or non-integral part`);
  }
  for (let i = 0; i + 1 < part.length; i += 1) {
    if (part[i] < part[i + 1]) {
      throw new Error(`${name} is not weakly decreasing`);
    }
  }
  return part;
}

export function shapeCells(partition) {
  const part = normalizePartition(partition);
  const cells = [];
  part.forEach((rowLength, rowIndex) => {
    for (let j = 1; j <= rowLength; j += 1) {
      cells.push([rowIndex + 1, j]);
    }
  });
  return cells;
}

export function deltaPartition(k) {
  if (k < 1) throw new Error("delta_k requires k >= 1");
  const out = [];
  for (let row = k - 1; row >= 1; row -= 1) out.push(row);
  return out;
}

export function deltaCells(k) {
  return shapeCells(deltaPartition(k));
}

export function lambdaSquare(lambdaPart) {
  const lam = normalizePartition(lambdaPart, "lambda");
  const out = [];
  lam.forEach((rowLength) => out.push(2 * rowLength, 2 * rowLength));
  return out;
}

export function partitionFromCells(cells) {
  const unique = new Set(cells.map(key));
  const list = cellsFromKeys(unique);
  if (list.length === 0) return [];
  if (list.some(([i, j]) => i < 1 || j < 1)) {
    throw new Error("partition cells must have positive coordinates");
  }

  const maxRow = Math.max(...list.map(([i]) => i));
  const rowLengths = [];
  let previous = null;
  for (let i = 1; i <= maxRow; i += 1) {
    const cols = list.filter(([r]) => r === i).map(([, j]) => j).sort((a, b) => a - b);
    const rowLength = cols.length === 0 ? 0 : Math.max(...cols);
    if (cols.length > 0) {
      const expected = Array.from({ length: rowLength }, (_, idx) => idx + 1);
      if (JSON.stringify(cols) !== JSON.stringify(expected)) {
        throw new Error(`cells are not left-justified in row ${i}`);
      }
    }
    if (previous !== null && rowLength > previous) {
      throw new Error(`cells are not a partition shape at row ${i}`);
    }
    rowLengths.push(rowLength);
    previous = rowLength;
  }
  while (rowLengths.length > 0 && rowLengths[rowLengths.length - 1] === 0) {
    rowLengths.pop();
  }
  return rowLengths;
}

export function isSkewShape(cells) {
  const unique = new Set(cells.map(key));
  const list = cellsFromKeys(unique);
  if (list.length === 0) return true;
  if (list.some(([i, j]) => i < 1 || j < 1)) return false;

  const maxRow = Math.max(...list.map(([i]) => i));
  const maxCol = Math.max(...list.map(([, j]) => j));
  let upperBeta = maxCol;
  let upperGamma = maxCol;

  for (let i = 1; i <= maxRow; i += 1) {
    const cols = list.filter(([r]) => r === i).map(([, j]) => j).sort((a, b) => a - b);
    if (cols.length === 0) {
      const x = Math.min(upperBeta, upperGamma);
      upperBeta = x;
      upperGamma = x;
      continue;
    }
    const left = cols[0];
    const right = cols[cols.length - 1];
    const expected = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);
    if (JSON.stringify(cols) !== JSON.stringify(expected)) return false;

    const beta = right;
    const gamma = left - 1;
    if (beta > upperBeta || gamma > upperGamma) return false;
    upperBeta = beta;
    upperGamma = gamma;
  }
  return true;
}

export function tableauFromRows(rows, skipNull = true) {
  const tableau = new Map();
  rows.forEach((row, rowIndex) => {
    row.forEach((entry, colIndex) => {
      if (skipNull && (entry === null || entry === undefined || entry === "")) return;
      tableau.set(key([rowIndex + 1, colIndex + 1]), Number.parseInt(entry, 10));
    });
  });
  return tableau;
}

export function parseStraightTableau(text) {
  const rows = text
    .trim()
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[\s,]+/).filter(Boolean).map((x) => {
      if (!/^-?\d+$/.test(x)) throw new Error(`Invalid entry "${x}". Use integers separated by spaces or commas.`);
      return Number.parseInt(x, 10);
    }));
  if (rows.length === 0) throw new Error("Enter at least one row.");
  if (rows.some((row) => row.length === 0)) throw new Error("Empty rows are not allowed.");
  if (rows.some((row) => row.some((x) => !Number.isInteger(x)))) {
    throw new Error("All entries must be integers.");
  }
  return tableauFromRows(rows);
}

export function tableauCells(tableau) {
  return sortedCellsFromTableau(tableau);
}

export function tableauSize(tableau) {
  return tableau.size;
}

export function tableauData(tableau) {
  return tableauEntries(tableau)
    .sort((a, b) => compareCells(a.cell, b.cell) || a.value - b.value)
    .map(({ cell, value }) => [cell, value]);
}

export function equalTableaux(a, b) {
  return JSON.stringify(tableauData(a)) === JSON.stringify(tableauData(b));
}

export function straightShape(tableau) {
  return partitionFromCells(tableauCells(tableau));
}

export function tableauToRows(tableau) {
  if (tableau.size === 0) return [];
  const cells = tableauCells(tableau);
  const maxRow = Math.max(...cells.map(([i]) => i));
  const rows = [];
  for (let i = 1; i <= maxRow; i += 1) {
    const rowCells = cells.filter(([r]) => r === i);
    const maxCol = rowCells.length === 0 ? 0 : Math.max(...rowCells.map(([, j]) => j));
    const row = [];
    for (let j = 1; j <= maxCol; j += 1) {
      row.push(tableau.get(key([i, j])) ?? null);
    }
    rows.push(row);
  }
  return rows;
}

export function tableauToInputText(tableau) {
  return tableauToRows(tableau)
    .map((row) => row.filter((entry) => entry !== null).join(" "))
    .join("\n");
}

function partitionSize(partition) {
  return partition.reduce((sum, part) => sum + part, 0);
}

function* partitionsOfSize(n, maxPart = n) {
  if (n === 0) {
    yield [];
    return;
  }
  for (let first = Math.min(n, maxPart); first >= 1; first -= 1) {
    for (const rest of partitionsOfSize(n - first, first)) {
      yield [first, ...rest];
    }
  }
}

function removableCorners(partition) {
  const corners = [];
  partition.forEach((rowLength, rowIndex) => {
    const nextLength = partition[rowIndex + 1] ?? 0;
    if (rowLength > nextLength) {
      const smaller = partition.slice();
      smaller[rowIndex] -= 1;
      while (smaller.length > 0 && smaller[smaller.length - 1] === 0) smaller.pop();
      corners.push({
        cell: [rowIndex + 1, rowLength],
        smaller,
      });
    }
  });
  return corners;
}

function* standardTableauxOfShape(shape) {
  const size = partitionSize(shape);
  if (size === 0) {
    yield new Map();
    return;
  }
  for (const { cell, smaller } of removableCorners(shape)) {
    for (const tableau of standardTableauxOfShape(smaller)) {
      const next = cloneTableau(tableau);
      next.set(key(cell), size);
      yield next;
    }
  }
}

function* standardTableauxOfSize(size) {
  for (const shape of partitionsOfSize(size)) {
    yield* standardTableauxOfShape(shape);
  }
}

function randomIndex(length, random) {
  return Math.min(length - 1, Math.floor(random() * length));
}

function randomChoice(items, random) {
  if (items.length === 0) throw new Error("cannot choose from an empty list");
  return items[randomIndex(items.length, random)];
}

function weightedIndex(weights, random) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (!(total > 0)) return randomIndex(weights.length, random);
  let target = random() * total;
  for (let idx = 0; idx < weights.length; idx += 1) {
    target -= weights[idx];
    if (target <= 0) return idx;
  }
  return weights.length - 1;
}

const logFactorialCache = [0];

function logFactorial(n) {
  for (let i = logFactorialCache.length; i <= n; i += 1) {
    logFactorialCache[i] = logFactorialCache[i - 1] + Math.log(i);
  }
  return logFactorialCache[n];
}

const logSYTCountCache = new Map();

function logStandardTableauxCount(shape) {
  const lam = normalizePartition(shape, "shape");
  const cacheKey = lam.join(",");
  if (logSYTCountCache.has(cacheKey)) return logSYTCountCache.get(cacheKey);
  const size = partitionSize(lam);
  let value = logFactorial(size);
  lam.forEach((rowLength, rowIndex) => {
    for (let j = 1; j <= rowLength; j += 1) {
      let below = 0;
      for (let r = rowIndex + 1; r < lam.length; r += 1) {
        if (lam[r] >= j) below += 1;
      }
      value -= Math.log((rowLength - j) + below + 1);
    }
  });
  logSYTCountCache.set(cacheKey, value);
  return value;
}

function randomPartitionOfSize(size, random) {
  return randomOuterPartitionContaining([], size, random);
}

function randomStandardTableauOfShape(shape, random) {
  let current = normalizePartition(shape, "shape");
  const out = new Map();
  for (let value = partitionSize(current); value >= 1; value -= 1) {
    const corners = removableCorners(current);
    const logs = corners.map(({ smaller }) => logStandardTableauxCount(smaller));
    const maxLog = Math.max(...logs);
    const idx = weightedIndex(logs.map((x) => Math.exp(x - maxLog)), random);
    out.set(key(corners[idx].cell), value);
    current = corners[idx].smaller;
  }
  return out;
}

function containsPartition(outer, inner) {
  for (let idx = 0; idx < inner.length; idx += 1) {
    if ((outer[idx] ?? 0) < inner[idx]) return false;
  }
  return true;
}

function randomOuterPartitionContaining(inner, extraSize, random) {
  let outer = inner.slice();
  for (let step = 0; step < extraSize; step += 1) {
    const choices = [];
    for (let row = 0; row <= outer.length; row += 1) {
      const next = (outer[row] ?? 0) + 1;
      const above = row === 0 ? Number.POSITIVE_INFINITY : outer[row - 1];
      const below = outer[row + 1] ?? 0;
      if (next > above || next < below) continue;
      const candidate = outer.slice();
      while (candidate.length <= row) candidate.push(0);
      candidate[row] = next;
      while (candidate.length > 0 && candidate[candidate.length - 1] === 0) candidate.pop();
      if (containsPartition(candidate, inner)) choices.push(candidate);
    }
    outer = randomChoice(choices, random);
  }
  return outer;
}

function skewCells(outer, inner) {
  const mu = normalizePartition(outer, "outer shape");
  const lam = normalizePartition(inner, "inner shape");
  if (!containsPartition(mu, lam)) throw new Error("outer shape does not contain inner shape");
  const cells = [];
  mu.forEach((rowLength, rowIndex) => {
    const innerLength = lam[rowIndex] ?? 0;
    for (let j = innerLength + 1; j <= rowLength; j += 1) {
      cells.push([rowIndex + 1, j]);
    }
  });
  return cells;
}

function canonicalLRTableau(lambdaPart) {
  const lam = normalizePartition(lambdaPart, "lambda");
  const out = new Map();
  lam.forEach((rowLength, rowIndex) => {
    for (let j = 1; j <= rowLength; j += 1) {
      out.set(key([rowIndex + 1, rowLength + j]), rowIndex + 1);
    }
  });
  return out;
}

function shuffled(items, random) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1, random);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function randomLRFilling(inner, outer, content, random, nodeLimit = 20000) {
  const cells = skewCells(outer, inner);
  if (cells.length !== partitionSize(content)) return null;
  const cellSet = new Set(cells.map(key));
  const order = cells.slice().sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const values = new Map();
  const remaining = [0, ...content];
  const used = Array.from({ length: content.length + 1 }, () => 0);
  let nodes = 0;

  function isBallotPrefix() {
    for (let i = 1; i + 1 < used.length; i += 1) {
      if (used[i] < used[i + 1]) return false;
    }
    return true;
  }

  function localSemistandardAllows(cell, value) {
    const [i, j] = cell;
    const right = key([i, j + 1]);
    if (cellSet.has(right) && values.has(right) && value > values.get(right)) return false;
    const above = key([i - 1, j]);
    if (cellSet.has(above) && values.has(above) && values.get(above) >= value) return false;
    return true;
  }

  function search(pos) {
    nodes += 1;
    if (nodes > nodeLimit) return false;
    if (pos === order.length) return remaining.every((count) => count === 0);

    const cell = order[pos];
    const candidates = [];
    for (let value = 1; value < remaining.length; value += 1) {
      if (remaining[value] === 0) continue;
      if (!localSemistandardAllows(cell, value)) continue;
      remaining[value] -= 1;
      used[value] += 1;
      if (isBallotPrefix()) candidates.push(value);
      used[value] -= 1;
      remaining[value] += 1;
    }

    for (const value of shuffled(candidates, random)) {
      values.set(key(cell), value);
      remaining[value] -= 1;
      used[value] += 1;
      if (search(pos + 1)) return true;
      used[value] -= 1;
      remaining[value] += 1;
      values.delete(key(cell));
    }
    return false;
  }

  return search(0) ? values : null;
}

function randomLRTableau(lambdaPart, random) {
  const lam = normalizePartition(lambdaPart, "lambda");
  const size = partitionSize(lam);
  const attempts = size <= 30 ? 50 : size <= 60 ? 16 : 4;
  const nodeLimit = size <= 30 ? 20000 : size <= 60 ? 8000 : 2000;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const outer = randomOuterPartitionContaining(lam, size, random);
    const filling = randomLRFilling(lam, outer, lam, random, nodeLimit);
    if (filling !== null) return filling;
  }
  return canonicalLRTableau(lam);
}

function inversePsiU(U, L) {
  const lam = straightShape(U);
  const reverseSecond = tableauSwitching(qTableau(lam), L, false);
  const reverseFirst = tableauSwitching(U, reverseSecond.second, false);
  return reverseFirst.second;
}

function assembleEqualSYT(U, S, n) {
  const out = cloneTableau(U);
  tableauEntries(S).forEach(({ cell, value }) => {
    out.set(key(cell), value + n);
  });
  return out;
}

function constructedRandomEqualSYT(n, random) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const lambdaPart = randomPartitionOfSize(n, random);
    const U = randomStandardTableauOfShape(lambdaPart, random);
    const L = randomLRTableau(lambdaPart, random);
    const T = assembleEqualSYT(U, inversePsiU(U, L), n);
    if (xiReadiness(T).ok) return T;
  }
  throw new Error(`Could not generate an element of SYT^=(2n) for n=${n}.`);
}

export const maxExactRandomEqualN = 5;
export const maxRandomEqualN = 100;
const randomEqualSYTCache = new Map();

function equalSYTList(n) {
  if (randomEqualSYTCache.has(n)) return randomEqualSYTCache.get(n);
  const candidates = [];
  for (const tableau of standardTableauxOfSize(2 * n)) {
    if (xiReadiness(tableau).ok) candidates.push(tableau);
  }
  randomEqualSYTCache.set(n, candidates);
  return candidates;
}

export function randomEqualSYT(n, random = Math.random) {
  const value = Number.parseInt(n, 10);
  if (!Number.isInteger(value) || value < 1) {
    throw new Error("Choose a positive integer n.");
  }
  if (value > maxRandomEqualN) {
    throw new Error(`Random generation is currently enabled for n <= ${maxRandomEqualN}.`);
  }
  if (value > maxExactRandomEqualN) return constructedRandomEqualSYT(value, random);
  const candidates = equalSYTList(value);
  if (candidates.length === 0) {
    throw new Error(`No tableaux found in SYT^=(2n) for n=${value}.`);
  }
  const idx = randomIndex(candidates.length, random);
  return cloneTableau(candidates[idx]);
}

export function qTableau(lambdaPart) {
  const lam = normalizePartition(lambdaPart, "lambda");
  const out = new Map();
  let value = 1;
  lam.forEach((rowLength, rowIndex) => {
    for (let j = 1; j <= rowLength; j += 1) {
      out.set(key([rowIndex + 1, j]), value);
      value += 1;
    }
  });
  return out;
}

export function oneTableau(lambdaPart) {
  const lam = normalizePartition(lambdaPart, "lambda");
  const out = new Map();
  lam.forEach((rowLength, rowIndex) => {
    for (let j = 1; j <= rowLength; j += 1) {
      out.set(key([rowIndex + 1, j]), rowIndex + 1);
    }
  });
  return out;
}

export function oneTableauRows(lambdaPart) {
  const lam = normalizePartition(lambdaPart, "lambda");
  return lam.map((rowLength, rowIndex) => Array(rowLength).fill(rowIndex + 1));
}

export function isColumnStrict(tableau) {
  const items = tableauEntries(tableau);
  for (const x of items) {
    for (const y of items) {
      const [i, j] = x.cell;
      const [i2, j2] = y.cell;
      if (i === i2 && j === j2) continue;
      if (i <= i2 && j <= j2 && x.value > y.value) return false;
      if (i < i2 && j === j2 && x.value >= y.value) return false;
    }
  }
  return true;
}

export function standardizeTableau(tableau) {
  const ordered = tableauEntries(tableau).sort((a, b) => (
    a.value - b.value || a.cell[1] - b.cell[1] || a.cell[0] - b.cell[0]
  ));
  const out = new Map();
  ordered.forEach(({ cell }, idx) => out.set(key(cell), idx + 1));
  return out;
}

export function subtableauByEntries(tableau, lo, hi, standardize = false) {
  const out = new Map();
  tableauEntries(tableau).forEach(({ cell, value }) => {
    if (lo <= value && value <= hi) out.set(key(cell), value);
  });
  return standardize ? standardizeTableau(out) : out;
}

export function tableauWeight(tableau) {
  const counts = new Map();
  tableauEntries(tableau).forEach(({ value }) => counts.set(value, (counts.get(value) ?? 0) + 1));
  if (counts.size === 0) return [];
  const maxEntry = Math.max(...counts.keys());
  return Array.from({ length: maxEntry }, (_, idx) => counts.get(idx + 1) ?? 0);
}

export function readingWord(tableau) {
  const cells = tableauCells(tableau);
  if (cells.length === 0) return [];
  const rows = Array.from(new Set(cells.map(([i]) => i))).sort((a, b) => b - a);
  const word = [];
  rows.forEach((i) => {
    cells.filter(([r]) => r === i).sort(compareCells).forEach((cell) => {
      word.push(tableau.get(key(cell)));
    });
  });
  return word;
}

export function validateSYT(tableau) {
  const shape = straightShape(tableau);
  const n = tableauSize(tableau);
  const values = tableauEntries(tableau).map(({ value }) => value).sort((a, b) => a - b);
  for (let i = 0; i < n; i += 1) {
    if (values[i] !== i + 1) {
      throw new Error(`The entries must be exactly 1,2,...,${n}.`);
    }
  }
  shape.forEach((rowLength, rowIndex) => {
    for (let j = 1; j < rowLength; j += 1) {
      const a = tableau.get(key([rowIndex + 1, j]));
      const b = tableau.get(key([rowIndex + 1, j + 1]));
      if (!(a < b)) throw new Error("Rows must be strictly increasing.");
    }
  });
  const maxCol = Math.max(...shape, 0);
  for (let j = 1; j <= maxCol; j += 1) {
    for (let i = 1; i < shape.length; i += 1) {
      if (j <= shape[i - 1] && j <= shape[i]) {
        const a = tableau.get(key([i, j]));
        const b = tableau.get(key([i + 1, j]));
        if (!(a < b)) throw new Error("Columns must be strictly increasing.");
      }
    }
  }
  return { size: n, shape };
}

function rawTableauSwitching(innerInput, outerInput, trace = false) {
  let inner = cloneTableau(innerInput);
  let outer = cloneTableau(outerInput);
  const states = [{ inner: cloneTableau(inner), outer: cloneTableau(outer), move: null }];
  const seen = new Set();

  while (true) {
    const stateKey = `${JSON.stringify(tableauData(inner))}|${JSON.stringify(tableauData(outer))}`;
    if (seen.has(stateKey)) throw new Error("tableau switching entered a repeated state");
    seen.add(stateKey);

    let nextState = null;
    for (const cell of sortedCellsFromTableau(outer)) {
      const [i, j] = cell;
      for (const innerCell of [[i - 1, j], [i, j - 1]]) {
        const innerKey = key(innerCell);
        if (!inner.has(innerKey)) continue;
        const cellKey = key(cell);
        const newInner = cloneTableau(inner);
        const newOuter = cloneTableau(outer);
        const innerLabel = newInner.get(innerKey);
        const outerLabel = newOuter.get(cellKey);
        newInner.delete(innerKey);
        newOuter.delete(cellKey);
        newInner.set(cellKey, innerLabel);
        newOuter.set(innerKey, outerLabel);
        if (isColumnStrict(newInner) && isColumnStrict(newOuter)) {
          nextState = {
            inner: newInner,
            outer: newOuter,
            move: {
              innerCell,
              outerCell: cell,
              innerLabel,
              outerLabel,
            },
          };
          break;
        }
      }
      if (nextState !== null) break;
    }

    if (nextState === null) {
      return { inner, outer, states: trace ? states : [] };
    }

    inner = nextState.inner;
    outer = nextState.outer;
    if (trace) {
      states.push({
        inner: cloneTableau(inner),
        outer: cloneTableau(outer),
        move: nextState.move,
      });
    }
  }
}

export function tableauSwitching(S, T, trace = false) {
  const result = rawTableauSwitching(S, T, trace);
  return {
    first: result.outer,
    second: result.inner,
    states: result.states.map((state) => ({
      first: state.outer,
      second: state.inner,
      move: state.move,
    })),
    rawStates: result.states.map((state) => ({
      inner: state.inner,
      outer: state.outer,
      move: state.move,
    })),
  };
}

export function psiU(U, S, check = true) {
  const lam = straightShape(U);
  const Q = qTableau(lam);
  const first = tableauSwitching(Q, S, true);
  if (check && !equalTableaux(first.first, U)) {
    throw new Error("S is not in SYT^U(mu/lambda): rect(S) is not U.");
  }

  const one = oneTableau(lam);
  const second = tableauSwitching(one, first.second, true);
  if (check && !equalTableaux(second.first, Q)) {
    throw new Error("The second tableau switching did not recover Q_lambda.");
  }

  return {
    lambda: lam,
    Q,
    one,
    B: first.second,
    L: second.second,
    firstSwitch: first,
    secondSwitch: second,
  };
}

export function omega(lambdaPart, L) {
  const lam = normalizePartition(lambdaPart, "lambda");
  const rows = lam.map(() => []);
  tableauEntries(L).sort((a, b) => compareCells(a.cell, b.cell)).forEach(({ cell, value }) => {
    const rowIndex = value - 1;
    if (rowIndex < 0 || rowIndex >= lam.length) {
      throw new Error(`entry ${value} is outside the rows of lambda`);
    }
    rows[rowIndex].push(cell[0]);
  });

  const lowerLeft = rows.map((row, idx) => {
    const sorted = row.slice().sort((a, b) => a - b);
    if (sorted.length !== lam[idx]) {
      throw new Error(`Omega row ${idx + 1} has length ${sorted.length}, expected ${lam[idx]}`);
    }
    return sorted;
  });
  return {
    lowerLeft,
    upperRight: oneTableauRows(lam),
  };
}

function checkTableauRows(rows, shape, name) {
  if (rows.length !== shape.length) {
    throw new Error(`${name} has ${rows.length} rows, expected ${shape.length}`);
  }
  rows.forEach((row, idx) => {
    if (row.length !== shape[idx]) {
      throw new Error(`${name} row ${idx + 1} has length ${row.length}, expected ${shape[idx]}`);
    }
  });
}

function normalizeDomino(label, cells) {
  const normalized = cells.map(([i, j]) => [Number.parseInt(i, 10), Number.parseInt(j, 10)]);
  if (normalized.length !== 2) throw new Error("a domino must have exactly two cells");
  const unique = new Set(normalized.map(key));
  if (unique.size !== 2) throw new Error("a domino must have exactly two distinct cells");
  if (normalized.some(([i, j]) => i < 1 || j < 1)) {
    throw new Error("domino cells must have positive coordinates");
  }
  const [[a, b], [c, d]] = normalized;
  if (Math.abs(a - c) + Math.abs(b - d) !== 1) {
    throw new Error("domino cells are not adjacent");
  }
  return {
    label: Number.parseInt(label, 10),
    cells: normalized.sort(compareCells),
  };
}

function dominoTableau(innerK, dominoes) {
  const kValue = Number.parseInt(innerK, 10);
  if (kValue < 1) throw new Error("inner_k must be at least 1");
  const normalized = dominoes.map((d) => normalizeDomino(d.label, d.cells));
  const occupied = new Set();
  normalized.forEach((domino) => {
    domino.cells.forEach((cell) => {
      const cellKey = key(cell);
      if (occupied.has(cellKey)) throw new Error(`overlapping dominoes at cell ${cellKey}`);
      occupied.add(cellKey);
    });
  });
  const inner = new Set(deltaCells(kValue).map(key));
  for (const cellKey of occupied) {
    if (inner.has(cellKey)) throw new Error(`domino cells overlap delta_${kValue}`);
  }
  partitionFromCells(cellsFromKeys(new Set([...occupied, ...inner])));
  return { innerK: kValue, dominoes: normalized };
}

export function dMap(lambdaPart, lowerLeft, upperRight) {
  const lam = normalizePartition(lambdaPart, "lambda");
  if (lam.length === 0) return dominoTableau(1, []);
  checkTableauRows(lowerLeft, lam, "lower_left");
  checkTableauRows(upperRight, lam, "upper_right");

  const kValue = lam[0] + lam.length;
  const lowerEntries = tableauEntries(tableauFromRows(lowerLeft));
  const upperEntries = tableauEntries(tableauFromRows(upperRight));
  const dominoes = [];

  lowerEntries.sort((a, b) => compareCells(a.cell, b.cell)).forEach(({ cell, value }) => {
    const [i, j] = cell;
    dominoes.push({
      label: value,
      cells: [[kValue + 2 * i - j - 1, j], [kValue + 2 * i - j, j]],
    });
  });

  upperEntries.sort((a, b) => compareCells(a.cell, b.cell)).forEach(({ cell, value }) => {
    const [i, j] = cell;
    dominoes.push({
      label: value,
      cells: [[i, kValue + 2 * j - i - 1], [i, kValue + 2 * j - i]],
    });
  });

  return dominoTableau(kValue, dominoes);
}

function neighbors(cell) {
  const [i, j] = cell;
  return {
    N: [i - 1, j],
    E: [i, j + 1],
    S: [i + 1, j],
    W: [i, j - 1],
  };
}

export function dominoOccupiedCells(tableau) {
  return tableau.dominoes.flatMap((domino) => domino.cells.map((cell) => cell.slice()));
}

export function dominoInnerCells(tableau) {
  return deltaCells(tableau.innerK);
}

export function dominoOuterCells(tableau) {
  return cellsFromKeys(new Set([...dominoOccupiedCells(tableau), ...dominoInnerCells(tableau)].map(key)));
}

export function dominoOuterPartition(tableau) {
  return partitionFromCells(dominoOuterCells(tableau));
}

export function cellToDominoId(tableau) {
  const out = new Map();
  tableau.dominoes.forEach((domino, idx) => {
    domino.cells.forEach((cell) => out.set(key(cell), idx));
  });
  return out;
}

export function dominoData(tableau) {
  return tableau.dominoes
    .map((domino) => [domino.label, domino.cells.map((cell) => cell.slice()).sort(compareCells)])
    .sort(compareDominoData);
}

export function verticalCount(tableau) {
  return tableau.dominoes.filter((domino) => domino.cells[0][1] === domino.cells[1][1]).length;
}

export function horizontalCount(tableau) {
  return tableau.dominoes.length - verticalCount(tableau);
}

export function spin(tableau) {
  const vertical = verticalCount(tableau);
  return vertical % 2 === 0 ? vertical / 2 : vertical / 2;
}

export function evaluation(tableau) {
  const counts = new Map();
  tableau.dominoes.forEach((domino) => {
    counts.set(domino.label, (counts.get(domino.label) ?? 0) + 1);
  });
  if (counts.size === 0) return [];
  const maxLabel = Math.max(...counts.keys());
  return Array.from({ length: maxLabel }, (_, idx) => counts.get(idx + 1) ?? 0);
}

function thetaArrowToCell(tableau, target) {
  const alpha = new Set(dominoOuterCells(tableau).map(key));
  const cellToId = cellToDominoId(tableau);
  const targetId = cellToId.get(key(target));
  const nbs = neighbors(target);

  const outsideAlpha = (cell) => !alpha.has(key(cell));
  const inDisjointDomino = (cell) => {
    const dominoId = cellToId.get(key(cell));
    return dominoId !== undefined && dominoId !== targetId;
  };
  const labelAt = (cell) => tableau.dominoes[cellToId.get(key(cell))].label;

  const { N, W, S, E } = nbs;
  const nOk = inDisjointDomino(N);
  const wOk = inDisjointDomino(W);
  if (nOk && wOk) return { source: labelAt(N) >= labelAt(W) ? N : W, target };
  if (nOk && outsideAlpha(W)) return { source: N, target };
  if (wOk && outsideAlpha(N)) return { source: W, target };

  const sOk = inDisjointDomino(S);
  const eOk = inDisjointDomino(E);
  if (sOk && eOk) return { source: labelAt(S) <= labelAt(E) ? S : E, target };
  if (sOk && outsideAlpha(E)) return { source: S, target };
  if (eOk && outsideAlpha(S)) return { source: E, target };
  return null;
}

function mod2(value) {
  return ((value % 2) + 2) % 2;
}

export function thetaArrows(tableau) {
  const kValue = tableau.innerK;
  const occupied = dominoOccupiedCells(tableau);
  const candidateKeys = new Set();
  occupied.forEach((cell) => {
    Object.values(neighbors(cell)).forEach((candidate) => {
      if (candidate[0] >= 1 && candidate[1] >= 1) candidateKeys.add(key(candidate));
    });
  });

  const arrows = [];
  const outgoing = new Map();
  const cellToId = cellToDominoId(tableau);
  for (const target of cellsFromKeys(candidateKeys)) {
    if (mod2(target[1] - target[0]) !== mod2(kValue)) continue;
    if (!isSkewShape([...occupied, target])) continue;
    const arrow = thetaArrowToCell(tableau, target);
    if (arrow === null) continue;
    const sourceId = cellToId.get(key(arrow.source));
    const previous = outgoing.get(sourceId);
    const arrowData = { dominoId: sourceId, source: arrow.source, target: arrow.target };
    if (previous && JSON.stringify(previous) !== JSON.stringify(arrowData)) {
      throw new Error(`domino ${sourceId} has more than one outgoing arrow`);
    }
    outgoing.set(sourceId, arrowData);
    arrows.push(arrowData);
  }
  return arrows;
}

export function openDominoIds(tableau, arrows) {
  const cellToId = cellToDominoId(tableau);
  const outgoing = new Map(arrows.map((arrow) => [arrow.dominoId, arrow]));
  const memo = new Map();

  const isOpen = (idx) => {
    if (memo.has(idx)) return memo.get(idx);
    const seen = new Set();
    let current = idx;
    let result = false;
    while (true) {
      if (memo.has(current)) {
        result = memo.get(current);
        break;
      }
      if (seen.has(current)) {
        result = false;
        break;
      }
      seen.add(current);
      const arrow = outgoing.get(current);
      if (!arrow) {
        result = false;
        break;
      }
      const nextId = cellToId.get(key(arrow.target));
      if (nextId === undefined) {
        result = true;
        break;
      }
      current = nextId;
    }
    seen.forEach((seenId) => memo.set(seenId, result));
    return result;
  };

  return Array.from(outgoing.keys()).filter(isOpen).sort((a, b) => a - b);
}

export function thetaChains(tableau, arrows) {
  return thetaChainDetails(tableau, arrows).filter((chain) => chain.type === "open").map((chain) => chain.dominoIds);
}

export function thetaChainDetails(tableau, arrows) {
  const cellToId = cellToDominoId(tableau);
  const targetBySource = new Map();
  const incoming = new Map();
  const adjacency = new Map();
  const touchesOutside = new Set();

  const addAdjacency = (a, b) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a).add(b);
    adjacency.get(b).add(a);
  };

  arrows.forEach((arrow) => {
    const targetId = cellToId.get(key(arrow.target));
    if (!adjacency.has(arrow.dominoId)) adjacency.set(arrow.dominoId, new Set());
    targetBySource.set(arrow.dominoId, targetId ?? null);
    if (targetId === undefined) {
      touchesOutside.add(arrow.dominoId);
    } else {
      addAdjacency(arrow.dominoId, targetId);
      if (!incoming.has(targetId)) incoming.set(targetId, []);
      incoming.get(targetId).push(arrow.dominoId);
    }
  });

  const visited = new Set();
  const components = [];
  for (const start of adjacency.keys()) {
    if (visited.has(start)) continue;
    const stack = [start];
    const ids = [];
    visited.add(start);
    while (stack.length > 0) {
      const current = stack.pop();
      ids.push(current);
      for (const next of adjacency.get(current) ?? []) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
    components.push(ids.sort((a, b) => a - b));
  }

  const walkIncoming = (start, allowed) => {
    const chain = [start];
    const seen = new Set([start]);
    let current = start;
    while ((incoming.get(current) ?? []).length > 0) {
      const next = incoming.get(current).find((id) => allowed.has(id) && !seen.has(id));
      if (next === undefined) break;
      if (seen.has(next)) break;
      chain.push(next);
      seen.add(next);
      current = next;
    }
    return chain;
  };

  return components.map((ids) => {
    const allowed = new Set(ids);
    const openHeads = ids.filter((id) => touchesOutside.has(id));
    if (openHeads.length > 0) {
      const ordered = [];
      openHeads.sort((a, b) => a - b).forEach((head) => {
        walkIncoming(head, allowed).forEach((id) => {
          if (!ordered.includes(id)) ordered.push(id);
        });
      });
      ids.forEach((id) => {
        if (!ordered.includes(id)) ordered.push(id);
      });
      return {
        type: "open",
        dominoIds: ordered,
        exits: openHeads,
      };
    }
    return {
      type: "closed",
      dominoIds: ids,
      exits: [],
      cycle: ids.every((id) => targetBySource.has(id)),
    };
  }).sort((a, b) => {
    if (a.type !== b.type) return a.type === "open" ? -1 : 1;
    return a.dominoIds[0] - b.dominoIds[0];
  });
}

export function theta(tableau) {
  if (tableau.innerK === 1) {
    throw new Error("theta is not defined once the inner staircase is empty");
  }
  const arrows = thetaArrows(tableau);
  const openIds = openDominoIds(tableau, arrows);
  const openSet = new Set(openIds);
  const arrowById = new Map(arrows.map((arrow) => [arrow.dominoId, arrow]));
  const newDominoes = tableau.dominoes.map((domino, idx) => {
    if (!openSet.has(idx)) return { label: domino.label, cells: domino.cells.map((cell) => cell.slice()) };
    const arrow = arrowById.get(idx);
    return { label: domino.label, cells: [arrow.source.slice(), arrow.target.slice()] };
  });
  const after = dominoTableau(tableau.innerK - 1, newDominoes);
  return {
    before: tableau,
    after,
    arrows,
    openIds,
    chains: thetaChains(tableau, arrows),
    chainDetails: thetaChainDetails(tableau, arrows),
  };
}

export function phi0(lambdaPart, lowerLeft, upperRight) {
  let tableau = dMap(lambdaPart, lowerLeft, upperRight);
  const steps = [{ kind: "d-map", tableau }];
  for (let s = tableau.innerK; s > 1; s -= 1) {
    const thetaStep = theta(tableau);
    steps.push({ kind: "theta", ...thetaStep });
    tableau = thetaStep.after;
  }
  return { result: tableau, steps };
}

function finalSpinInfo(n, lambdaPart, mu, result, xiDefined) {
  const spinValue = spin(result);
  const spinParity = ((spinValue % 2) + 2) % 2;
  const nParity = n % 2;
  return {
    n,
    lambda: lambdaPart,
    mu,
    spin: spinValue,
    spinParity,
    nParity,
    inY: spinParity === nParity,
    xiDefined,
  };
}

function omegaBuildInfo(lambdaPart, L, lowerLeftRows) {
  const maxLRow = Math.max(...tableauEntries(L).map(({ cell }) => cell[0]), 0);
  const maxEntry = lambdaPart.length;
  const counts = Array.from({ length: maxLRow }, () => Array.from({ length: maxEntry }, () => 0));
  tableauEntries(L).forEach(({ cell, value }) => {
    if (value >= 1 && value <= maxEntry) {
      counts[cell[0] - 1][value - 1] += 1;
    }
  });
  return {
    counts,
    mRows: lowerLeftRows.map((row, kIndex) => ({
      row: kIndex + 1,
      entries: row.slice(),
      pieces: counts
        .map((countRow, lIndex) => ({
          value: lIndex + 1,
          count: countRow[kIndex],
        }))
        .filter(({ count }) => count > 0),
    })),
  };
}

export function vartheta(T) {
  const size = tableauSize(T);
  if (size % 2 !== 0) throw new Error("The input tableau must have even size.");
  const n = size / 2;
  return {
    n,
    U: subtableauByEntries(T, 1, n),
    S: subtableauByEntries(T, n + 1, 2 * n, true),
  };
}

export function computeXiTrace(T) {
  const validation = validateSYT(T);
  if (validation.size % 2 !== 0) {
    throw new Error("The input SYT must have even size 2n.");
  }
  const { n, U, S } = vartheta(T);
  const lam = straightShape(U);
  const steps = [
    {
      phase: "Input",
      title: "Input standard Young tableau",
      description: "Input standard Young tableau T.",
      tableaux: [{ label: "T", tableau: T }],
    },
    {
      phase: "Input",
      title: "Split T into U and S",
      description: "Let U=T_[n] and S=st(T_[n+1,2n]). The map xi is defined when S rectifies to U.",
      tableaux: [
        { label: "U", tableau: U },
        { label: "S", tableau: S },
      ],
    },
  ];

  const psi = psiU(U, S, true);
  steps.push({
    phase: "Psi_U",
    title: "First tableau switching",
    description: "Let X(Q_lambda,S)=(A,B). Since S is in SYT^U(mu/lambda), we have A=rect(S)=U.",
    switching: {
      innerLabel: "Q_lambda",
      outerLabel: "S",
      finalInnerLabel: "B",
      finalOuterLabel: "U",
      states: psi.firstSwitch.rawStates,
    },
    tableaux: [
      { label: "Q_lambda", tableau: psi.Q },
      { label: "S", tableau: S },
      { label: "U", tableau: psi.firstSwitch.first },
      { label: "B", tableau: psi.B },
    ],
  });
  steps.push({
    phase: "Psi_U",
    title: "Second tableau switching",
    description: "Let X(1_lambda,B)=(C,D). Then C=Q_lambda and D=Psi_U(S).",
    switching: {
      innerLabel: "1_lambda",
      outerLabel: "B",
      finalInnerLabel: "L=Psi_U(S)",
      finalOuterLabel: "Q_lambda",
      states: psi.secondSwitch.rawStates,
    },
    tableaux: [
      { label: "1_lambda", tableau: psi.one },
      { label: "B", tableau: psi.B },
      { label: "Q_lambda", tableau: psi.secondSwitch.first },
      { label: "L=Psi_U(S)", tableau: psi.L },
    ],
  });

  const { omega: om, phi } = appendOmegaPhiSteps(steps, lam, psi.L);
  steps.push({
    phase: "Phi_0",
    title: "Final Yamanouchi domino tableau",
    description: `The output D has outer shape lambda^square=(${lambdaSquare(lam).join(",")}), evaluation (${evaluation(phi.result).join(",")}), and spin ${spin(phi.result)}.`,
    domino: phi.result,
    finalInfo: finalSpinInfo(n, lam, validation.shape, phi.result, true),
  });

  return {
    mode: "xi",
    warning: "",
    n,
    lambda: lam,
    U,
    S,
    L: psi.L,
    omega: om,
    result: phi.result,
    steps,
  };
}

function appendOmegaPhiSteps(steps, lam, L) {
  const om = omega(lam, L);
  const lowerLeftTableau = tableauFromRows(om.lowerLeft);
  const upperRightTableau = tableauFromRows(om.upperRight);
  steps.push({
    phase: "Omega",
    title: "Omega",
    description: "To form M, read each cell of L as follows: an entry k in row l of L contributes an entry l to row k of M. Then Omega(L) is obtained by placing M in the lower-left component and 1_lambda in the upper-right component.",
    tableaux: [
      { label: "L", tableau: L },
    ],
    omegaTableau: {
      lambda: lam,
      lowerLeft: lowerLeftTableau,
      upperRight: upperRightTableau,
    },
    omegaBuildInfo: omegaBuildInfo(lam, L, om.lowerLeft),
  });

  const phi = phi0(lam, om.lowerLeft, om.upperRight);
  phi.steps.forEach((step, idx) => {
    if (step.kind === "d-map") {
      steps.push({
        phase: "Phi_0",
        title: "d-map",
        description: `Apply d to Omega(L): the lower-left component gives vertical dominoes, and the upper-right component gives horizontal dominoes, with inner shape delta_${step.tableau.innerK}.`,
        domino: step.tableau,
        dMapView: {
          lambda: lam,
          lowerLeft: lowerLeftTableau,
          upperRight: upperRightTableau,
        },
      });
    } else {
      steps.push({
        phase: "Phi_0",
        title: `theta step ${idx}`,
        description: `Apply theta: draw arrows, decompose the dominoes into open and closed chains, move the open chains, and change the inner shape from delta_${step.before.innerK} to delta_${step.after.innerK}.`,
        dominoBefore: step.before,
        dominoAfter: step.after,
        arrows: step.arrows,
        openIds: step.openIds,
        chains: step.chains,
        chainDetails: step.chainDetails,
      });
    }
  });
  return { omega: om, phi };
}

export function computeContinuedTrace(T) {
  const validation = validateSYT(T);
  if (validation.size % 2 !== 0) {
    throw new Error("The input SYT must have even size 2n.");
  }
  const { n, U, S } = vartheta(T);
  const inputLambda = straightShape(U);
  const first = tableauSwitching(qTableau(inputLambda), S, true);
  const rectified = first.first;
  const rectifiedLambda = straightShape(rectified);

  const warning = "Warning: T is not in SYT^=(2n). The displayed continuation replaces U by rect(S), so the final domino tableau is not xi(T).";
  const steps = [
    {
      phase: "Input",
      title: "Input standard Young tableau",
      description: "Input standard Young tableau T.",
      tableaux: [{ label: "T", tableau: T }],
    },
    {
      phase: "Input",
      title: "Split T into U and S",
      description: warning,
      tableaux: [
        { label: "U = T_[n]", tableau: U },
        { label: "S = st(T_[n+1,2n])", tableau: S },
        { label: "rect(S)", tableau: rectified },
      ],
    },
    {
      phase: "Psi_U",
      title: "First tableau switching",
      description: "Let X(Q_lambda,S)=(A,B). Here A=rect(S) is not U; equivalently, T is not in SYT^=(2n).",
      switching: {
        innerLabel: "Q_lambda",
        outerLabel: "S",
        finalInnerLabel: "B",
        finalOuterLabel: "A=rect(S)",
        states: first.rawStates,
      },
    },
  ];

  const second = tableauSwitching(oneTableau(rectifiedLambda), first.second, true);
  const L = second.second;
  steps.push({
    phase: "Psi_U",
    title: "Second tableau switching",
    description: "Let X(1_lambda,B)=(C,D), with lambda=sh(rect(S)). Continue with D.",
    switching: {
      innerLabel: "1_lambda",
      outerLabel: "B",
      finalInnerLabel: "D",
      finalOuterLabel: "C",
      states: second.rawStates,
    },
  });

  const { omega: om, phi } = appendOmegaPhiSteps(steps, rectifiedLambda, L);
  steps.push({
    phase: "Phi_0",
    title: "Final Yamanouchi domino tableau",
    description: `Here lambda=sh(rect(S))=(${rectifiedLambda.join(",")}). The displayed output has outer shape (${dominoOuterPartition(phi.result).join(",")}), evaluation (${evaluation(phi.result).join(",")}), and spin ${spin(phi.result)}.`,
    domino: phi.result,
    finalInfo: finalSpinInfo(n, rectifiedLambda, validation.shape, phi.result, false),
  });

  return {
    mode: "continued",
    warning,
    n,
    lambda: rectifiedLambda,
    inputLambda,
    U,
    S,
    rectifiedS: rectified,
    L,
    omega: om,
    result: phi.result,
    steps,
  };
}

export function xiReadiness(T) {
  const validation = validateSYT(T);
  if (validation.size % 2 !== 0) {
    return {
      ok: false,
      kind: "odd-size",
      message: `This is a valid SYT of size ${validation.size}, but xi is defined for even size 2n.`,
      size: validation.size,
      shape: validation.shape,
    };
  }

  const { n, U, S } = vartheta(T);
  const lam = straightShape(U);
  const firstSwitch = tableauSwitching(qTableau(lam), S, true);
  const rectifiedS = firstSwitch.first;
  const ok = equalTableaux(rectifiedS, U);
  return {
    ok,
    kind: ok ? "xi-ready" : "not-in-SYT-eq",
    message: ok
      ? "T is in SYT^=(2n), so ξ is defined."
      : "T is not in SYT^=(2n): rect(st(T_[n+1,2n])) is not T_[n].",
    size: validation.size,
    shape: validation.shape,
    n,
    lambda: lam,
    U,
    S,
    rectifiedS,
  };
}

export const defaultExample = `1 2 4 7 9
3 5 10
6 8`;
