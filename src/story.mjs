import { tableauCells } from "./core.mjs?v=20260520-story-polish-44";

const CELL_STEP = 40;
const STORY_FIT_PADDING = 32;

function el(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatStoryMath(text) {
  let html = escapeHtml(text);
  html = html
    .replaceAll("D=(Phi_0 o Omega o Psi_U)(S)", "<span class=\"math\">D=(Φ<sub>0</sub>∘Ω∘Ψ<sub>U</sub>)(S)</span>")
    .replaceAll("vartheta(T)", "<span class=\"math\">ϑ(T)</span>")
    .replaceAll("theta(D)", "<span class=\"math\">θ(D)</span>")
    .replaceAll("xi(T)=(U,D)", "<span class=\"math\">ξ(T)=(U,D)</span>")
    .replaceAll("X(Q_λ,S)", "<span class=\"math\">X(Q<sub>λ</sub>,S)</span>")
    .replaceAll("X(1_λ,B)", "<span class=\"math\">X(1<sub>λ</sub>,B)</span>")
    .replaceAll("X(Q_lambda,S)", "<span class=\"math\">X(Q<sub>λ</sub>,S)</span>")
    .replaceAll("X(1_lambda,B)", "<span class=\"math\">X(1<sub>λ</sub>,B)</span>")
    .replaceAll("Q_lambda and Psi_U(S)", "<span class=\"math\">Q<sub>λ</sub></span> and <span class=\"math\">Ψ<sub>U</sub>(S)</span>")
    .replaceAll("Q_λ", "<span class=\"math\">Q<sub>λ</sub></span>")
    .replaceAll("1_λ", "<span class=\"math\">1<sub>λ</sub></span>")
    .replaceAll("Q_lambda", "<span class=\"math\">Q<sub>λ</sub></span>")
    .replaceAll("1_lambda", "<span class=\"math\">1<sub>λ</sub></span>")
    .replaceAll("YDT(lambda^square,mu)", "<span class=\"math\">YDT(λ<sup>□</sup>,μ)</span>")
    .replaceAll("lambda^square", "<span class=\"math\">λ<sup>□</sup></span>")
    .replaceAll("sh(rect(S))", "<span class=\"math\">sh(rect(S))</span>")
    .replaceAll("rect(S)", "<span class=\"math\">rect(S)</span>")
    .replaceAll("rect(B)", "<span class=\"math\">rect(B)</span>")
    .replaceAll("a_{l,k}", "<span class=\"math\">a<sub>l,k</sub></span>")
    .replaceAll("S in SYT^U(mu/lambda)", "<span class=\"math\">S∈SYT<sup>U</sup>(μ/λ)</span>")
    .replaceAll("SYT^U(mu/lambda)", "<span class=\"math\">SYT<sup>U</sup>(μ/λ)</span>")
    .replaceAll("mu/lambda", "<span class=\"math\">μ/λ</span>")
    .replaceAll("lambda", "<span class=\"math\">λ</span>")
    .replaceAll("d(Omega(L))", "<span class=\"math\">d(Ω(L))</span>")
    .replaceAll("Psi_U(S)", "<span class=\"math\">Ψ<sub>U</sub>(S)</span>")
    .replaceAll("Omega(L)", "<span class=\"math\">Ω(L)</span>")
    .replaceAll("Phi_0", "<span class=\"math\">Φ<sub>0</sub></span>")
    .replaceAll("Psi_U", "<span class=\"math\">Ψ<sub>U</sub></span>")
    .replaceAll("Omega", "<span class=\"math\">Ω</span>")
    .replaceAll("SYT^=(2n)", "<span class=\"math\">SYT<sup>=</sup>(2n)</span>")
    .replaceAll("T^[n+1,2n]", "<span class=\"math\">T<sup>[n+1,2n]</sup></span>")
    .replaceAll("SYT_{(n,n)}(mu)", "<span class=\"math\">SYT<sub>(n,n)</sub>(μ)</span>")
    .replaceAll("SYT_{(n,n)}^spin(mu)", "<span class=\"math\">SYT<sup>spin</sup><sub>(n,n)</sub>(μ)</span>")
    .replaceAll("st(T_[n+1,2n])", "<span class=\"math\">st(T<sub>[n+1,2n]</sub>)</span>")
    .replaceAll("T_[n]", "<span class=\"math\">T<sub>[n]</sub></span>")
    .replaceAll("V(D)", "<span class=\"math\">V(D)</span>")
    .replaceAll("spin(T)", "<span class=\"math\">spin(T)</span>")
    .replaceAll("spin(D) mod 2", "<span class=\"math\">spin(D) mod 2</span>")
    .replaceAll("spin(D)", "<span class=\"math\">spin(D)</span>")
    .replaceAll("maj(U)", "<span class=\"math\">maj(U)</span>")
    .replaceAll("maj(T_[n])", "<span class=\"math\">maj(T<sub>[n]</sub>)</span>")
    .replaceAll("n mod 2", "<span class=\"math\">n mod 2</span>")
    .replaceAll("xi(T)", "<span class=\"math\">ξ(T)</span>")
    .replace(/\bxi\b/g, "<span class=\"math\">ξ</span>");
  html = html
    .replace(/delta_([0-9]+)/g, "<span class=\"math\">δ<sub>$1</sub></span>")
    .replace(/SYT_\{\(([0-9]+),([0-9]+)\)\}\^spin\(\(([^)]+)\)\)/g, "<span class=\"math\">SYT<sup>spin</sup><sub>($1,$2)</sub>($3)</span>")
    .replace(/SYT_\{\(([0-9]+),([0-9]+)\)\}\(\(([^)]+)\)\)/g, "<span class=\"math\">SYT<sub>($1,$2)</sub>($3)</span>")
    .replace(/Q_<span class="math">λ<\/span>/g, "<span class=\"math\">Q<sub>λ</sub></span>")
    .replace(/1_<span class="math">λ<\/span>/g, "<span class=\"math\">1<sub>λ</sub></span>")
    .replace(/\btheta\b/g, "<span class=\"math\">θ</span>");
  return html;
}

function setMathHtml(node, text) {
  node.innerHTML = formatStoryMath(text);
}

function svgEl(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function key(cell) {
  return `${cell[0]},${cell[1]}`;
}

function compareCells(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}

function clamp(x, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, x));
}

function ease(t) {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function valueAt(tableau, cell) {
  return tableau.get(key(cell));
}

function cellPosition(origin, cell) {
  return {
    x: origin.x + (cell[1] - 1) * CELL_STEP,
    y: origin.y + (cell[0] - 1) * CELL_STEP,
  };
}

function dominoPosition(origin, domino) {
  const rows = domino.cells.map(([i]) => i);
  const cols = domino.cells.map(([, j]) => j);
  const rowStart = Math.min(...rows);
  const colStart = Math.min(...cols);
  const rowSpan = Math.max(...rows) - rowStart + 1;
  const colSpan = Math.max(...cols) - colStart + 1;
  return {
    x: origin.x + (colStart - 1) * CELL_STEP,
    y: origin.y + (rowStart - 1) * CELL_STEP,
    width: colSpan * CELL_STEP - 2,
    height: rowSpan * CELL_STEP - 2,
  };
}

function tableauExtent(tableaux) {
  const cells = tableaux.flatMap((tableau) => tableauCells(tableau));
  return {
    rows: Math.max(...cells.map(([i]) => i), 1),
    cols: Math.max(...cells.map(([, j]) => j), 1),
  };
}

function cellForLabel(tableau, label) {
  for (const cell of tableauCells(tableau)) {
    if (valueAt(tableau, cell) === label) return cell;
  }
  return null;
}

function addObject(scene, id, state) {
  scene.objects.set(id, state);
}

function addFormulaObject(scene, id, text, box, role = "primary", opacity = 1) {
  addObject(scene, id, {
    kind: "formula",
    display: text,
    role,
    opacity,
    ...box,
  });
}

function addRegion(scene, label, origin, tableaux, className = "") {
  const extent = tableauExtent(tableaux);
  scene.regions.push({
    label,
    className,
    x: origin.x - 14,
    y: origin.y - 36,
    width: extent.cols * CELL_STEP + 28,
    height: extent.rows * CELL_STEP + 52,
  });
}

function addFixedRegion(scene, label, box, className = "") {
  scene.regions.push({
    label,
    className,
    ...box,
  });
}

function addCallout(scene, box, lines, className = "") {
  scene.callouts.push({
    ...box,
    lines,
    className,
  });
}

function finalMembershipLine(info) {
  if (!info.xiDefined) return "xi(T) is not defined.";
  const muText = `(${info.mu.join(",")})`;
  if (!info.inTwoRowRefined) return `T ∉ SYT_{(${info.n},${info.n})}(${muText})`;
  return `T ${info.inSpinSubset ? "∈" : "∉"} SYT_{(${info.n},${info.n})}^spin(${muText})`;
}

function baseMembershipLine(info) {
  if (!info?.xiDefined) return "";
  const muText = `(${info.mu.join(",")})`;
  return `T ${info.inTwoRowRefined ? "∈" : "∉"} SYT_{(${info.n},${info.n})}(${muText})`;
}

function baseMembershipReasonLine(info) {
  if (!info?.xiDefined) return "";
  const relation = info.inTwoRowRefined ? "≡" : "≢";
  return `maj(U) = ${info.blockMajor} ${relation} 1 (mod ${info.n}) ⇒ ${baseMembershipLine(info)}`;
}

function splitMajorLine(info) {
  if (!info?.xiDefined) return "";
  const relation = info.inTwoRowRefined ? "≡" : "≢";
  return `maj(U) = ${info.blockMajor} ${relation} 1 (mod ${info.n})`;
}

function formulaFragmentWidth(text, minimum = 44) {
  const weight = Array.from(String(text)).reduce((sum, ch) => {
    const code = ch.codePointAt(0) ?? 0;
    if (code > 0x3000) return sum + 1.12;
    if (code > 0x7f) return sum + 1.02;
    if ("il.,() ".includes(ch)) return sum + 0.46;
    if ("=≡≢+-".includes(ch)) return sum + 0.78;
    return sum + 0.92;
  }, 0);
  return Math.ceil(Math.max(minimum, weight * 12 + 8));
}

function addEntries(scene, entries, mapper) {
  entries.forEach((entry) => {
    const mapped = mapper(entry);
    if (!mapped) return;
    addObject(scene, `entry:${entry.value}`, {
      display: String(mapped.display),
      role: mapped.role,
      opacity: mapped.opacity ?? 1,
      ...mapped.position,
    });
  });
}

function addTableauObjects(scene, prefix, tableau, origin, role, options = {}) {
  tableauCells(tableau).forEach((cell) => {
    const label = valueAt(tableau, cell);
    addObject(scene, `${prefix}:${label}`, {
      display: String(label),
      role,
      opacity: options.opacity ?? 1,
      ...cellPosition(origin, cell),
    });
  });
}

function cloneCellMap(map) {
  return new Map(map);
}

function updateSwitchMaps(innerIds, outerIds, move) {
  if (!move) return;
  const innerCellKey = key(move.innerCell);
  const outerCellKey = key(move.outerCell);
  const innerId = innerIds.get(innerCellKey);
  const outerId = outerIds.get(outerCellKey);
  innerIds.delete(innerCellKey);
  outerIds.delete(outerCellKey);
  if (innerId) innerIds.set(outerCellKey, innerId);
  if (outerId) outerIds.set(innerCellKey, outerId);
}

function makeScene(title, subtitle, stage = "") {
  return {
    title,
    subtitle,
    stage,
    anchor: "",
    weight: 1,
    rule: "",
    card: null,
    factTray: [],
    objects: new Map(),
    regions: [],
    callouts: [],
    arrows: [],
  };
}

function sceneWeight(scene) {
  const value = Number(scene?.weight ?? 1);
  return Number.isFinite(value) ? Math.max(0.25, value) : 1;
}

function setCard(scene, card) {
  scene.card = card;
  return scene;
}

function setFactTray(scene, facts) {
  scene.factTray = (facts ?? []).filter((fact) => fact?.text);
  return scene;
}

function addHiddenInputEntries(scene, entries, n, origin) {
  entries.forEach((entry) => {
    if (entry.value <= n) {
      addObject(scene, `entry:${entry.value}`, {
        display: String(entry.value),
        role: "u",
        opacity: 0,
        ...cellPosition(origin, entry.cell),
      });
    }
  });
}

function buildSecondSwitchScenes(secondStates, origins, entries, n) {
  const innerIds = new Map();
  const outerIds = new Map();
  tableauCells(secondStates[0].inner).forEach((cell) => {
    innerIds.set(key(cell), `unit:${key(cell)}`);
  });
  tableauCells(secondStates[0].outer).forEach((cell) => {
    const label = valueAt(secondStates[0].outer, cell);
    outerIds.set(key(cell), `q:${label}`);
  });

  const scenes = [];
  secondStates.forEach((state, idx) => {
    if (idx > 0) updateSwitchMaps(innerIds, outerIds, state.move);
    const isLast = idx === secondStates.length - 1;
    const scene = makeScene(
      idx === 0
        ? "X(1_lambda,B)"
        : isLast
          ? "L=Psi_U(S)"
          : "X(1_lambda,B)",
      "",
      "psi",
    );
    if (isLast) {
      scene.weight = 2.3;
      scene.anchor = "L";
    } else if (idx === secondStates.length - 2) {
      scene.weight = 1.55;
    } else if (idx > 0) {
      scene.weight = 0.58;
    }
    if (idx === 0) {
      setCard(scene, {
        title: "X(1_lambda,B)",
        items: [
          "1_lambda: row i is filled with i.",
          "X(1_lambda,B)=(C,L).",
        ],
      });
    } else if (isLast) {
      setCard(scene, {
        title: "L=Psi_U(S)",
        items: [
          "C=rect(B)=Q_lambda.",
          "L=Psi_U(S).",
        ],
      });
    } else {
      setCard(scene, {
        title: "Tableau switching",
        items: [
          "X(1_lambda,B).",
          "Result: (Q_lambda,L).",
        ],
      });
    }
    addRegion(scene, isLast ? "L" : "X(1_lambda,B)", origins.secondSwitch, isLast ? [state.inner] : [state.inner, state.outer], "second-switch");
    tableauCells(state.inner).forEach((cell) => {
      const id = innerIds.get(key(cell));
      if (!id) return;
      addObject(scene, id, {
        display: String(valueAt(state.inner, cell)),
        role: isLast ? "lower" : "unit",
        opacity: 1,
        ...cellPosition(origins.secondSwitch, cell),
      });
    });
    if (!isLast) {
      tableauCells(state.outer).forEach((cell) => {
        const id = outerIds.get(key(cell));
        if (!id) return;
        addObject(scene, id, {
          display: String(valueAt(state.outer, cell)),
          role: "inner",
          opacity: 1,
          ...cellPosition(origins.secondSwitch, cell),
        });
      });
    }
    addHiddenInputEntries(scene, entries, n, origins.u);
    scenes.push(scene);
  });

  return {
    scenes,
    finalInnerIdsByCell: cloneCellMap(innerIds),
    finalOuterIdsByCell: cloneCellMap(outerIds),
  };
}

function buildSecondSwitchBridge(firstState, secondState, origins, entries, n, sLabelToEntry, isContinued) {
  const scene = makeScene("X(1_lambda,B)", "", "psi");
  scene.weight = 0.95;
  setCard(scene, {
    title: "X(1_lambda,B)",
    items: isContinued
      ? [
        "Keep B.",
        "Bring in 1_lambda of shape sh(rect(S)).",
      ]
      : [
        "Keep B.",
        "Bring in 1_lambda.",
      ],
  });
  addRegion(scene, "B", origins.secondSwitch, [firstState.inner], "second-switch");

  tableauCells(firstState.inner).forEach((cell) => {
    const label = valueAt(firstState.inner, cell);
    addObject(scene, `q:${label}`, {
      display: String(label),
      role: "inner",
      opacity: 1,
      ...cellPosition(origins.secondSwitch, cell),
    });
  });

  const leavingOrigin = {
    x: origins.secondSwitch.x - 96,
    y: origins.secondSwitch.y - 36,
  };
  tableauCells(firstState.outer).forEach((cell) => {
    const label = valueAt(firstState.outer, cell);
    const entryValue = sLabelToEntry.get(label) ?? n + label;
    addObject(scene, `entry:${entryValue}`, {
      display: String(label),
      role: isContinued ? "outer leaving" : "u leaving",
      opacity: 0,
      ...cellPosition(leavingOrigin, cell),
    });
  });

  const enteringOrigin = {
    x: origins.secondSwitch.x - 96,
    y: origins.secondSwitch.y + 34,
  };
  tableauCells(secondState.inner).forEach((cell) => {
    const label = valueAt(secondState.inner, cell);
    addObject(scene, `unit:${key(cell)}`, {
      display: String(label),
      role: "unit entering",
      opacity: 0,
      ...cellPosition(enteringOrigin, cell),
    });
  });

  addHiddenInputEntries(scene, entries, n, origins.u);
  return scene;
}

function omegaTargetsForL(L, lowerLeft) {
  const grouped = new Map();
  tableauCells(L).sort(compareCells).forEach((cell) => {
    const k = valueAt(L, cell);
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k).push({ sourceCell: cell, sourceRow: cell[0] });
  });

  const targets = [];
  grouped.forEach((items, row) => {
    items
      .sort((a, b) => a.sourceRow - b.sourceRow || compareCells(a.sourceCell, b.sourceCell))
      .forEach((item, idx) => {
        targets.push({
          sourceCell: item.sourceCell,
          targetCell: [row, idx + 1],
          display: item.sourceRow,
          check: valueAt(lowerLeft, [row, idx + 1]),
        });
      });
  });
  return targets;
}

function thetaExtent(thetaStep) {
  const cells = [
    ...thetaStep.dominoBefore.dominoes.flatMap((domino) => domino.cells),
    ...thetaStep.dominoAfter.dominoes.flatMap((domino) => domino.cells),
    ...(thetaStep.arrows ?? []).flatMap((arrow) => [arrow.source, arrow.target]),
  ];
  return {
    rows: Math.max(...cells.map(([row]) => row), 1),
    cols: Math.max(...cells.map(([, col]) => col), 1),
  };
}

function dominoExtent(tableau) {
  const cells = tableau.dominoes.flatMap((domino) => domino.cells);
  return {
    rows: Math.max(...cells.map(([row]) => row), 1),
    cols: Math.max(...cells.map(([, col]) => col), 1),
  };
}

function verticalDominoIds(tableau) {
  return new Set(
    tableau.dominoes
      .map((domino, dominoId) => ({ domino, dominoId }))
      .filter(({ domino }) => domino.cells[0][1] === domino.cells[1][1])
      .map(({ dominoId }) => dominoId),
  );
}

function addFinalDominoObjects(scene, tableau, origin, objectIdByDominoId, roleByDominoId, highlightedIds = new Set()) {
  tableau.dominoes.forEach((domino, dominoId) => {
    const objectId = objectIdByDominoId.get(dominoId);
    if (!objectId) return;
    const baseRole = roleByDominoId.get(dominoId) ?? "domino-lower";
    const roleParts = [baseRole];
    if (highlightedIds.has(dominoId)) roleParts.push("domino-spin-vertical");
    addObject(scene, objectId, {
      display: String(domino.label),
      role: roleParts.join(" "),
      opacity: highlightedIds.size === 0 || highlightedIds.has(dominoId) ? 1 : 0.34,
      ...dominoPosition(origin, domino),
    });
  });
}

function addDominoObjectsFromTableau(scene, tableau, origin, objectIdByDominoId, roleByDominoId, openIds = new Set(), mutedIds = new Set()) {
  tableau.dominoes.forEach((domino, dominoId) => {
    const objectId = objectIdByDominoId.get(dominoId);
    if (!objectId) return;
    const baseRole = roleByDominoId.get(dominoId) ?? "domino-lower";
    const roleParts = [baseRole];
    if (openIds.has(dominoId)) roleParts.push("domino-open");
    if (mutedIds.has(dominoId)) roleParts.push("domino-muted");
    addObject(scene, objectId, {
      display: String(domino.label),
      role: roleParts.join(" "),
      opacity: mutedIds.has(dominoId) ? 0.45 : 1,
      ...dominoPosition(origin, domino),
    });
  });
}

function addDominoObjectsWithChains(scene, tableau, origin, objectIdByDominoId, roleByDominoId, chainByDominoId) {
  tableau.dominoes.forEach((domino, dominoId) => {
    const objectId = objectIdByDominoId.get(dominoId);
    if (!objectId) return;
    const baseRole = roleByDominoId.get(dominoId) ?? "domino-lower";
    const chain = chainByDominoId.get(dominoId);
    const roleParts = [baseRole];
    if (chain?.type === "open") roleParts.push("domino-open");
    else if (chain?.type === "closed") roleParts.push("domino-closed");
    else roleParts.push("domino-muted");
    addObject(scene, objectId, {
      display: String(domino.label),
      role: roleParts.join(" "),
      opacity: chain ? 1 : 0.34,
      ...dominoPosition(origin, domino),
    });
  });
}

function storyArrowPoints(source, target, origin) {
  const sx = origin.x + (source[1] - 0.5) * CELL_STEP;
  const sy = origin.y + (source[0] - 0.5) * CELL_STEP;
  const tx = origin.x + (target[1] - 0.5) * CELL_STEP;
  const ty = origin.y + (target[0] - 0.5) * CELL_STEP;
  const dx = tx - sx;
  const dy = ty - sy;
  const shift = 4;
  const inset = 5;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const sign = dx >= 0 ? 1 : -1;
    return {
      x1: sx + sign * inset,
      y1: sy - shift,
      x2: tx - sign * inset,
      y2: ty - shift,
    };
  }
  const sign = dy >= 0 ? 1 : -1;
  return {
    x1: sx + shift,
    y1: sy + sign * inset,
    x2: tx + shift,
    y2: ty - sign * inset,
  };
}

function thetaArrowsForStory(arrows, origin, openIds = null) {
  return (arrows ?? []).map((arrow) => ({
    ...storyArrowPoints(arrow.source, arrow.target, origin),
    kind: openIds === null ? "strong" : openIds.has(arrow.dominoId) ? "strong" : "muted",
  }));
}

function thetaChainArrowsForStory(arrows, origin) {
  return (arrows ?? []).map((arrow) => ({
    ...storyArrowPoints(arrow.source, arrow.target, origin),
    kind: arrow.chainType === "closed"
      ? "chain-closed"
      : `chain-open chain-${((arrow.chainId - 1) % 4) + 1}`,
  }));
}

function chainData(thetaStep) {
  const chainByDominoId = new Map();
  const arrows = [];
  (thetaStep.chainDetails ?? [])
    .forEach((chain, chainIndex) => {
      chain.dominoIds.forEach((dominoId) => {
        chainByDominoId.set(dominoId, {
          id: chainIndex + 1,
          type: chain.type,
        });
      });
    });
  (thetaStep.arrows ?? []).forEach((arrow) => {
    const chain = chainByDominoId.get(arrow.dominoId);
    if (!chain) return;
    arrows.push({ ...arrow, chainId: chain.id, chainType: chain.type });
  });
  return { chainByDominoId, arrows };
}

function buildStoryScenes(trace) {
  if (!trace?.steps?.[0] || !trace?.steps?.[1]?.split || !trace?.steps?.[2]?.switching) {
    return [];
  }

  const split = trace.steps[1].split;
  const isContinued = trace.mode === "continued";
  const firstSwitching = trace.steps[2].switching;
  const firstStates = firstSwitching.states ?? [];
  const secondSwitching = trace.steps[3]?.switching ?? null;
  const secondStates = secondSwitching?.states ?? [];
  const omegaStep = trace.steps.find((step) => step.phase === "Omega" && step.omegaTableau);
  const dMapStep = trace.steps.find((step) => step.dMapView && step.domino);
  const finalStep = trace.steps.find((step) => step.finalInfo && step.domino);
  if (firstStates.length === 0) return [];

  const n = split.n;
  const entries = tableauCells(split.T)
    .map((cell) => ({ cell, value: valueAt(split.T, cell) }))
    .sort((a, b) => a.value - b.value);
  const sLabelToEntry = new Map();
  entries.forEach((entry) => {
    if (entry.value > n) {
      const sLabel = valueAt(split.S, entry.cell);
      sLabelToEntry.set(sLabel, entry.value);
    }
  });

  const origins = {
    input: { x: 235, y: 170 },
    u: { x: 90, y: 210 },
    s: { x: 435, y: 210 },
    switch: { x: 285, y: 195 },
    secondSwitch: { x: 285, y: 195 },
    omega: { x: 245, y: 145 },
    dmap: { x: 130, y: 45 },
  };
  const finalInfoForFacts = finalStep?.finalInfo ?? null;
  const baseFactLine = baseMembershipLine(finalInfoForFacts);
  const splitMajLine = splitMajorLine(finalInfoForFacts);
  const uExtent = tableauExtent([split.U]);
  const splitMajorBox = {
    x: origins.u.x - 20,
    y: origins.u.y + uExtent.rows * CELL_STEP + 14,
    width: Math.max(280, uExtent.cols * CELL_STEP + 58),
    height: 30,
  };
  const baseFactClass = finalInfoForFacts?.inTwoRowRefined ? "ok" : "fail";
  const addSplitFact = (scene, text, opacity = 1) => {
    if (!text) return;
    addFormulaObject(
      scene,
      "fact:base-membership",
      text,
      splitMajorBox,
      `fact major ${baseFactClass}`,
      opacity,
    );
  };
  const setBaseFactTray = (scene) => setFactTray(scene, [
    { text: baseFactLine, className: baseFactClass },
  ]);

  const input = makeScene(
    isContinued ? "T ∉ SYT^=(2n)" : "T ∈ SYT^=(2n)",
    "",
    "vartheta",
  );
  input.anchor = "T";
  const inputItems = [
    isContinued
      ? "T_[n]≠T^[n+1,2n]."
      : "T_[n]=T^[n+1,2n].",
  ];
  setCard(input, {
    title: isContinued ? "T ∉ SYT^=(2n)" : "T ∈ SYT^=(2n)",
    items: inputItems,
  });
  addRegion(input, "T", origins.input, [split.T], "input");
  addEntries(input, entries, (entry) => ({
    display: entry.value,
    role: "input",
    position: cellPosition(origins.input, entry.cell),
  }));
  addSplitFact(input, splitMajLine, 0);

  const splitScene = makeScene(
    "vartheta(T)=(U,S)",
    "",
    "vartheta",
  );
  splitScene.anchor = "US";
  setCard(splitScene, {
    title: "vartheta(T)=(U,S)",
    items: isContinued
      ? [
        "Set U=T_[n].",
        "Set S=st(T_[n+1,2n]).",
        "Use rect(S) only for comparison.",
      ]
      : [
        "Set U=T_[n].",
        "Set S=st(T_[n+1,2n]).",
        "Then S in SYT^U(mu/lambda).",
      ],
  });
  addRegion(splitScene, "U = T_[n]", origins.u, [split.U], "u");
  addRegion(splitScene, "S = st(T_[n+1,2n])", origins.s, [split.S], "s");
  addEntries(splitScene, entries, (entry) => {
    if (entry.value <= n) {
      return {
        display: entry.value,
        role: "u",
        position: cellPosition(origins.u, entry.cell),
      };
    }
    return {
      display: valueAt(split.S, entry.cell),
      role: "s",
      position: cellPosition(origins.s, entry.cell),
    };
  });
  addSplitFact(splitScene, splitMajLine);

  const setup = makeScene(
    "X(Q_lambda,S)",
    "",
    "psi",
  );
  setCard(setup, {
    title: "X(Q_lambda,S)",
    items: [
      "Q_lambda: row-by-row standard tableau of shape lambda.",
      "X(Q_lambda,S)=(A,B).",
    ],
  });
  addRegion(setup, "X(Q_lambda,S)", origins.switch, [firstStates[0].inner, firstStates[0].outer], "switch");
  addEntries(setup, entries, (entry) => {
    if (entry.value <= n) {
      return {
        display: entry.value,
        role: "u",
        opacity: 0,
        position: cellPosition(origins.u, entry.cell),
      };
    }
    const sLabel = valueAt(split.S, entry.cell);
    const targetCell = cellForLabel(firstStates[0].outer, sLabel);
    return {
      display: sLabel,
      role: "outer",
      position: cellPosition(origins.switch, targetCell ?? entry.cell),
    };
  });
  addTableauObjects(setup, "q", firstStates[0].inner, origins.switch, "inner");
  setBaseFactTray(setup);

  const firstResultTitle = "X(Q_lambda,S)";
  const firstResultRegion = "B";

  const firstSwitchScenes = firstStates.map((state, idx) => {
    const isLast = idx === firstStates.length - 1;
    const scene = makeScene(
      isLast ? firstResultTitle : "X(Q_lambda,S)",
      "",
      "psi",
    );
    if (isLast) {
      scene.weight = 1.45;
    } else if (idx > 0) {
      scene.weight = 0.58;
    }
    setCard(scene, isLast
      ? {
        title: firstResultTitle,
        items: [
          "Let X(Q_lambda,S)=(A,B).",
          "Use B in X(1_lambda,B).",
        ],
      }
      : {
        title: "Tableau switching",
        items: [
          "X(Q_lambda,S).",
        ],
      });
    addRegion(scene, isLast ? firstResultRegion : "X(Q_lambda,S)", origins.switch, isLast ? [state.inner] : [state.inner, state.outer], "switch");
    entries.forEach((entry) => {
      if (entry.value <= n) {
        addObject(scene, `entry:${entry.value}`, {
          display: String(entry.value),
          role: "u",
          opacity: 0,
          ...cellPosition(origins.u, entry.cell),
        });
      }
    });
    tableauCells(state.outer).forEach((cell) => {
      const label = valueAt(state.outer, cell);
      const entryValue = sLabelToEntry.get(label) ?? n + label;
      addObject(scene, `entry:${entryValue}`, {
        display: String(label),
        role: isLast ? "outer auxiliary" : "outer",
        opacity: isLast ? 0.18 : 1,
        ...cellPosition(origins.switch, cell),
      });
    });
    addTableauObjects(scene, "q", state.inner, origins.switch, "inner");
    setBaseFactTray(scene);
    return scene;
  });

  if (secondStates.length === 0) {
    return [input, splitScene, setup, ...firstSwitchScenes.slice(1)];
  }

  const secondData = buildSecondSwitchScenes(secondStates, origins, entries, n);
  const secondBridge = buildSecondSwitchBridge(
    firstStates[firstStates.length - 1],
    secondStates[0],
    origins,
    entries,
    n,
    sLabelToEntry,
    isContinued,
  );

  const storyScenes = [
    input,
    splitScene,
    setup,
    ...firstSwitchScenes.slice(1),
    secondBridge,
    ...secondData.scenes,
  ];
  storyScenes.forEach((scene) => {
    if (scene === input) {
      addSplitFact(scene, splitMajLine, 0);
    } else if (scene === splitScene) {
      addSplitFact(scene, splitMajLine);
      setBaseFactTray(scene);
    } else {
      setBaseFactTray(scene);
    }
  });

  if (omegaStep?.omegaTableau) {
    const omegaScene = makeScene(
      "Omega(L)",
      "",
      "omega",
    );
    omegaScene.anchor = "OmegaL";
    setCard(omegaScene, {
      title: "Omega(L)",
      items: [
        "L: a_{l,k} copies of k in row l.",
        "M: a_{l,k} copies of l in row k.",
        "Omega(L): lower-left M, upper-right 1_lambda.",
      ],
    });
    setBaseFactTray(omegaScene);
    const { lambda, lowerLeft, upperRight } = omegaStep.omegaTableau;
    const maxRows = Math.max(lambda.length * 2, 1);
    const maxCols = Math.max((lambda[0] ?? 1) * 2, 1);
    addFixedRegion(omegaScene, "Omega(L)", {
      x: origins.omega.x - 14,
      y: origins.omega.y - 36,
      width: maxCols * CELL_STEP + 28,
      height: maxRows * CELL_STEP + 52,
    }, "omega");

    const targets = omegaTargetsForL(secondStates[secondStates.length - 1].inner, lowerLeft);
    const unitIdByLowerCell = new Map();
    targets.forEach((target) => {
      const id = secondData.finalInnerIdsByCell.get(key(target.sourceCell));
      if (!id) return;
      unitIdByLowerCell.set(key(target.targetCell), id);
      addObject(omegaScene, id, {
        display: String(target.display),
        role: "omega-lower",
        opacity: 1,
        ...cellPosition(origins.omega, [
          target.targetCell[0] + lambda.length,
          target.targetCell[1],
        ]),
      });
    });
    tableauCells(upperRight).forEach((cell) => {
      const label = valueAt(upperRight, cell);
      addObject(omegaScene, `upper:${key(cell)}`, {
        display: String(label),
        role: "omega-upper",
        opacity: 1,
        ...cellPosition(origins.omega, [
          cell[0],
          cell[1] + (lambda[0] ?? 0),
        ]),
      });
    });
    addHiddenInputEntries(omegaScene, entries, n, origins.u);
    storyScenes.push(omegaScene);

    if (dMapStep?.domino) {
      const dScene = makeScene(
        "d(Omega(L))",
        "",
        "phi",
      );
      setCard(dScene, {
        title: "d(Omega(L))",
        items: [
          "M → vertical dominoes.",
          "1_lambda → horizontal dominoes.",
        ],
      });
      addFixedRegion(dScene, "d(Omega(L))", {
        x: origins.dmap.x - 14,
        y: origins.dmap.y - 36,
        width: Math.max(...dMapStep.domino.dominoes.flatMap((domino) => domino.cells.map(([, col]) => col))) * CELL_STEP + 28,
        height: Math.max(...dMapStep.domino.dominoes.flatMap((domino) => domino.cells.map(([row]) => row))) * CELL_STEP + 52,
      }, "dmap");
      const lowerCells = tableauCells(lowerLeft).sort(compareCells);
      const upperCells = tableauCells(upperRight).sort(compareCells);
      const objectIdByDominoId = new Map();
      const roleByDominoId = new Map();
      lowerCells.forEach((cell, idx) => {
        const id = unitIdByLowerCell.get(key(cell));
        const domino = dMapStep.domino.dominoes[idx];
        if (!id || !domino) return;
        objectIdByDominoId.set(idx, id);
        roleByDominoId.set(idx, "domino-lower");
        addObject(dScene, id, {
          display: String(domino.label),
          role: "domino-lower",
          opacity: 1,
          ...dominoPosition(origins.dmap, domino),
        });
      });
      upperCells.forEach((cell, idx) => {
        const dominoId = lowerCells.length + idx;
        const domino = dMapStep.domino.dominoes[dominoId];
        if (!domino) return;
        const id = `upper:${key(cell)}`;
        objectIdByDominoId.set(dominoId, id);
        roleByDominoId.set(dominoId, "domino-upper");
        addObject(dScene, id, {
          display: String(domino.label),
          role: "domino-upper",
          opacity: 1,
          ...dominoPosition(origins.dmap, domino),
        });
      });
      addHiddenInputEntries(dScene, entries, n, origins.u);
      setBaseFactTray(dScene);
      storyScenes.push(dScene);

      trace.steps
        .filter((step) => step.dominoBefore && step.dominoAfter)
        .forEach((thetaStep, idx) => {
          const openIds = new Set(thetaStep.openIds ?? []);
          const extent = thetaExtent(thetaStep);
          const chainDataForTheta = chainData(thetaStep);
          const regionBox = {
            x: origins.dmap.x - 14,
            y: origins.dmap.y - 36,
            width: extent.cols * CELL_STEP + 28,
            height: extent.rows * CELL_STEP + 52,
          };

          const chainScene = makeScene(
            "theta: chains",
            "",
            "phi",
          );
          setCard(chainScene, {
            title: "theta: chains",
            items: [
              "Open chains are modified.",
              "Closed chains are unchanged.",
            ],
          });
          addFixedRegion(chainScene, `chains for θ`, regionBox, "theta");
          addDominoObjectsWithChains(chainScene, thetaStep.dominoBefore, origins.dmap, objectIdByDominoId, roleByDominoId, chainDataForTheta.chainByDominoId);
          chainScene.arrows = thetaChainArrowsForStory(chainDataForTheta.arrows, origins.dmap);
          addHiddenInputEntries(chainScene, entries, n, origins.u);
          setBaseFactTray(chainScene);
          storyScenes.push(chainScene);

          const moveScene = makeScene(
            "theta(D)",
            "",
            "phi",
          );
          setCard(moveScene, {
            title: "theta(D)",
            items: [
              `Apply theta.`,
              `delta_${thetaStep.dominoBefore.innerK} → delta_${thetaStep.dominoAfter.innerK}.`,
            ],
          });
          addFixedRegion(moveScene, `θ(D)`, regionBox, "theta");
          addDominoObjectsFromTableau(moveScene, thetaStep.dominoAfter, origins.dmap, objectIdByDominoId, roleByDominoId, openIds);
          addHiddenInputEntries(moveScene, entries, n, origins.u);
          setBaseFactTray(moveScene);
          storyScenes.push(moveScene);
        });

      if (finalStep?.domino) {
        const finalInfo = finalStep.finalInfo;
        const extent = dominoExtent(finalStep.domino);
        const regionBox = {
          x: origins.dmap.x - 14,
          y: origins.dmap.y - 36,
          width: extent.cols * CELL_STEP + 28,
          height: extent.rows * CELL_STEP + 52,
        };
        const finalFormulaWidth = Math.max(regionBox.width, 500);
        const finalFormulaX = regionBox.x + (regionBox.width - finalFormulaWidth) / 2;
        const finalFormulaY = regionBox.y + regionBox.height + 42;
        const spinLine = `spin(D) = ${finalInfo.spin}`;
        const paritySuffix = `${finalInfo.inY ? "≡" : "≢"} ${finalInfo.n} = n (mod 2)`;
        const membershipLine = finalMembershipLine(finalInfo);
        const spinCoreWidth = formulaFragmentWidth(spinLine, 104);
        const suffixWidth = formulaFragmentWidth(paritySuffix, 164);
        const formulaGap = 5;
        const parityRowWidth = spinCoreWidth + formulaGap + suffixWidth;
        const spinCoreCenteredX = finalFormulaX + (finalFormulaWidth - spinCoreWidth) / 2;
        const spinCoreLeftX = finalFormulaX + (finalFormulaWidth - parityRowWidth) / 2;
        const paritySuffixX = spinCoreLeftX + spinCoreWidth + formulaGap;
        const verticalIds = verticalDominoIds(finalStep.domino);
        const conclusionInSet = finalInfo.xiDefined && finalInfo.inTwoRowRefined && finalInfo.inSpinSubset;

        const makeFinalScene = (titleText, subtitleText, highlightedIds) => {
          const scene = makeScene(titleText, subtitleText, "phi");
          addFixedRegion(scene, "D", regionBox, "theta");
          addFinalDominoObjects(scene, finalStep.domino, origins.dmap, objectIdByDominoId, roleByDominoId, highlightedIds);
          addHiddenInputEntries(scene, entries, n, origins.u);
          setBaseFactTray(scene);
          return scene;
        };

        const finalDScene = makeFinalScene(
          "Final Yamanouchi domino tableau",
          "",
          new Set(),
        );
        finalDScene.anchor = "D";
        storyScenes.push(finalDScene);
        setCard(storyScenes[storyScenes.length - 1], {
          title: finalInfo.xiDefined ? "D" : "Comparison D",
          items: finalInfo.xiDefined
            ? [
              "D=(Phi_0 o Omega o Psi_U)(S).",
            ]
            : [
              "The displayed D is computed after replacing U by rect(S).",
            ],
        });

        storyScenes.push(makeFinalScene(
          "spin(D)",
          "",
          verticalIds,
        ));
        setCard(storyScenes[storyScenes.length - 1], {
          title: "spin(D)",
          items: [],
        });
        addFormulaObject(storyScenes[storyScenes.length - 1], "final:spin-core", spinLine, {
          x: spinCoreCenteredX,
          y: finalFormulaY + 18,
          width: spinCoreWidth,
          height: 34,
        }, "fragment core");
        addFormulaObject(storyScenes[storyScenes.length - 1], "final:spin-suffix", paritySuffix, {
          x: paritySuffixX - 18,
          y: finalFormulaY + 18,
          width: suffixWidth,
          height: 34,
        }, finalInfo.inY ? "fragment ok" : "fragment fail", 0);

        storyScenes.push(makeFinalScene(
          "mod 2",
          "",
          verticalIds,
        ));
        setCard(storyScenes[storyScenes.length - 1], {
          title: "mod 2",
          items: [],
        });
        addFormulaObject(storyScenes[storyScenes.length - 1], "final:spin-core", spinLine, {
          x: spinCoreLeftX,
          y: finalFormulaY + 18,
          width: spinCoreWidth,
          height: 34,
        }, "fragment core");
        addFormulaObject(storyScenes[storyScenes.length - 1], "final:spin-suffix", paritySuffix, {
          x: paritySuffixX,
          y: finalFormulaY + 18,
          width: suffixWidth,
          height: 34,
        }, finalInfo.inY ? "fragment ok" : "fragment fail");

        storyScenes.push(makeFinalScene(
          finalInfo.xiDefined ? "Membership" : "Comparison output",
          "",
          verticalIds,
        ));
        if (finalInfo.xiDefined) {
          setCard(storyScenes[storyScenes.length - 1], {
            title: "Spin condition",
            items: [
              `spin(D) ${finalInfo.inY ? "≡" : "≢"} n (mod 2).`,
            ],
          });
          setFactTray(storyScenes[storyScenes.length - 1], [
            { text: baseFactLine, className: baseFactClass },
            { text: `${spinLine} ${paritySuffix}`, className: finalInfo.inY ? "ok" : "fail" },
            { text: `⇒ ${membershipLine}`, className: conclusionInSet ? "result in-set" : "result out-set" },
          ]);
        } else {
          setCard(storyScenes[storyScenes.length - 1], {
            title: "Comparison output",
            items: [
              "xi(T) is not defined.",
              "No membership conclusion is drawn from the displayed D.",
            ],
          });
          setFactTray(storyScenes[storyScenes.length - 1], [
            { text: membershipLine, className: "result out-set" },
            { text: "The displayed D is only the comparison output.", className: "muted" },
            { text: `${spinLine} ${paritySuffix}`, className: finalInfo.inY ? "ok" : "fail" },
          ]);
        }
      }
    }
  }

  return storyScenes;
}

function objectIds(scenes) {
  const ids = new Set();
  scenes.forEach((scene) => {
    scene.objects.forEach((_, id) => ids.add(id));
  });
  return Array.from(ids);
}

function addBounds(bounds, x1, y1, x2, y2) {
  if (![x1, y1, x2, y2].every(Number.isFinite)) return;
  bounds.minX = Math.min(bounds.minX, x1);
  bounds.minY = Math.min(bounds.minY, y1);
  bounds.maxX = Math.max(bounds.maxX, x2);
  bounds.maxY = Math.max(bounds.maxY, y2);
}

function storyBounds(scenes) {
  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  scenes.forEach((scene) => {
    scene.regions.forEach((region) => {
      addBounds(bounds, region.x, region.y, region.x + region.width, region.y + region.height);
    });
    scene.objects.forEach((object) => {
      addBounds(
        bounds,
        object.x,
        object.y,
        object.x + (object.width ?? 38),
        object.y + (object.height ?? 38),
      );
    });
    (scene.arrows ?? []).forEach((arrow) => {
      addBounds(
        bounds,
        Math.min(arrow.x1, arrow.x2) - 18,
        Math.min(arrow.y1, arrow.y2) - 18,
        Math.max(arrow.x1, arrow.x2) + 18,
        Math.max(arrow.y1, arrow.y2) + 18,
      );
    });
    (scene.callouts ?? []).forEach((callout) => {
      addBounds(bounds, callout.x, callout.y, callout.x + callout.width, callout.y + callout.height);
    });
  });
  if (!Number.isFinite(bounds.minX)) {
    return { minX: 0, minY: 0, maxX: 720, maxY: 420 };
  }
  return bounds;
}

function renderRegions(regionLayer, scene) {
  regionLayer.replaceChildren();
  scene.regions.forEach((region) => {
    const node = el("div", `story-region ${region.className}`.trim());
    node.style.left = `${region.x}px`;
    node.style.top = `${region.y}px`;
    node.style.width = `${region.width}px`;
    node.style.height = `${region.height}px`;
    const label = el("span", "story-region-label");
    setMathHtml(label, region.label);
    node.appendChild(label);
    regionLayer.appendChild(node);
  });
}

function renderStoryCallouts(calloutLayer, scene) {
  calloutLayer.replaceChildren();
  (scene.callouts ?? []).forEach((callout) => {
    const node = el("div", `story-callout ${callout.className}`.trim());
    node.style.left = `${callout.x}px`;
    node.style.top = `${callout.y}px`;
    node.style.width = `${callout.width}px`;
    node.style.minHeight = `${callout.height}px`;
    if (callout.kind === "formula") {
      node.classList.add("formula-callout");
      callout.lines.forEach((line, idx) => {
        const isResult = callout.className.includes("conclusion") && idx === callout.lines.length - 1;
        const row = el("div", isResult ? "formula-line formula-result" : "formula-line");
        setMathHtml(row, line);
        node.appendChild(row);
      });
      calloutLayer.appendChild(node);
      return;
    }
    callout.lines.forEach((line, idx) => {
      const row = el("div", idx === 0 ? "story-callout-main" : "story-callout-line");
      setMathHtml(row, line);
      node.appendChild(row);
    });
    calloutLayer.appendChild(node);
  });
}

function renderStoryArrows(arrowLayer, scene) {
  arrowLayer.replaceChildren();
  if (!scene.arrows || scene.arrows.length === 0) return;

  const svg = svgEl("svg");
  svg.setAttribute("class", "story-arrow-svg");
  const defs = svgEl("defs");
  const marker = svgEl("marker");
  marker.setAttribute("id", "story-theta-arrow-head");
  marker.setAttribute("markerWidth", "5");
  marker.setAttribute("markerHeight", "5");
  marker.setAttribute("refX", "4.5");
  marker.setAttribute("refY", "2.5");
  marker.setAttribute("orient", "auto");
  const head = svgEl("path");
  head.setAttribute("d", "M 0 0 L 5 2.5 L 0 5 z");
  head.setAttribute("fill", "context-stroke");
  marker.appendChild(head);
  defs.appendChild(marker);
  svg.appendChild(defs);

  scene.arrows.forEach((arrow) => {
    const pathData = arrow.curve
      ? `M ${arrow.x1} ${arrow.y1} Q ${arrow.cx} ${arrow.cy} ${arrow.x2} ${arrow.y2}`
      : `M ${arrow.x1} ${arrow.y1} L ${arrow.x2} ${arrow.y2}`;
    const halo = svgEl("path");
    halo.setAttribute("d", pathData);
    halo.setAttribute("class", "story-theta-arrow-halo");
    svg.appendChild(halo);

    const path = svgEl("path");
    path.setAttribute("d", pathData);
    path.setAttribute("class", `story-theta-arrow ${arrow.kind ?? "strong"}`);
    path.setAttribute("marker-end", "url(#story-theta-arrow-head)");
    svg.appendChild(path);
  });
  arrowLayer.appendChild(svg);
}

function sceneState(scene, id, fallback) {
  const state = scene.objects.get(id);
  if (state) return state;
  return { ...fallback, opacity: 0 };
}

function makeMapProgress() {
  const steps = [
    ["ϑ", "US", "(U,S)"],
    ["Psi_U", "L", "L"],
    ["Omega", "OmegaL", "Omega(L)"],
    ["Phi_0", "D", "D"],
  ];
  const bar = el("div", "map-progress");
  const inputChip = el("button", "map-progress-token");
  inputChip.type = "button";
  inputChip.dataset.anchor = "T";
  inputChip.title = "Go to T";
  setMathHtml(inputChip, "T");
  bar.appendChild(inputChip);
  steps.forEach(([label, anchor, target]) => {
    const chip = el("span", "map-progress-map");
    const map = el("span", "map-progress-map-label");
    setMathHtml(map, label);
    const arrow = el("span", "map-progress-arrow", "⟶");
    chip.append(map, arrow);
    bar.appendChild(chip);
    const token = el("button", "map-progress-token");
    token.type = "button";
    token.dataset.anchor = anchor;
    token.title = `Go to ${target}`;
    setMathHtml(token, target);
    bar.appendChild(token);
  });
  return bar;
}

function updateMapProgress(progressNode, activeAnchor) {
  progressNode.querySelectorAll(".map-progress-token").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.anchor === activeAnchor);
  });
}

function progressForAnchor(scenes, anchor) {
  const weights = scenes.map(sceneWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const index = Math.max(0, scenes.findIndex((scene) => scene.anchor === anchor));
  const before = weights.slice(0, index).reduce((sum, weight) => sum + weight, 0);
  return total === 0 ? 0 : before / total;
}

function activeAnchorForIndex(scenes, activeIndex) {
  for (let index = activeIndex; index >= 0; index -= 1) {
    if (scenes[index]?.anchor) return scenes[index].anchor;
  }
  return "T";
}

function scrollStoryToProgress(root, progress) {
  const scrollable = Math.max(1, root.offsetHeight - window.innerHeight);
  const rootTop = window.scrollY + root.getBoundingClientRect().top;
  window.scrollTo({
    top: rootTop + scrollable * clamp(progress),
    behavior: "smooth",
  });
}

function cardForScene(scene) {
  if (scene.card) return scene.card;
  const items = [];
  if (scene.subtitle) items.push(scene.subtitle);
  if (scene.rule) items.push(scene.rule);
  return {
    title: scene.title,
    items,
  };
}

function renderStoryGuide(card, scene) {
  const cardData = cardForScene(scene);
  card.replaceChildren();
  const heading = el("h3");
  setMathHtml(heading, cardData.title);
  card.appendChild(heading);
  if (cardData.body) {
    const text = el("p");
    setMathHtml(text, cardData.body);
    card.appendChild(text);
  }
  if (cardData.items?.length) {
    const list = el("ul", "story-card-list");
    cardData.items.forEach((item) => {
      const li = el("li");
      setMathHtml(li, item);
      list.appendChild(li);
    });
    card.appendChild(list);
  }
}

function renderFactTray(tray, scene) {
  tray.replaceChildren();
  const facts = scene.factTray ?? [];
  tray.hidden = facts.length === 0;
  facts.forEach((fact) => {
    const line = el("div", `story-fact-line ${fact.className ?? ""}`.trim());
    setMathHtml(line, fact.text);
    tray.appendChild(line);
  });
}

function makeStoryGuide(scenes) {
  const rail = el("div", "story-scroll");
  const guide = el("article", "story-card story-guide");
  renderStoryGuide(guide, scenes[0]);
  rail.appendChild(guide);
  scenes.forEach((scene) => {
    const marker = el("div", "story-scroll-marker");
    marker.style.setProperty("--story-marker-weight", String(sceneWeight(scene)));
    rail.appendChild(marker);
  });
  return { rail, guide };
}

function makeStoryJumpNav() {
  const nav = el("nav", "story-jump-nav");
  const top = el("button", "story-jump-button");
  top.type = "button";
  top.dataset.jump = "top";
  top.title = "Go to the beginning";
  top.setAttribute("aria-label", "Go to the beginning");
  top.textContent = "↑";
  const bottom = el("button", "story-jump-button");
  bottom.type = "button";
  bottom.dataset.jump = "bottom";
  bottom.title = "Go to the conclusion";
  bottom.setAttribute("aria-label", "Go to the conclusion");
  bottom.textContent = "↓";
  nav.append(top, bottom);
  return nav;
}

function storyPosition(scenes, progress) {
  if (scenes.length <= 1) return { index: 0, rawLocal: 0 };
  const weights = scenes.map(sceneWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const scaled = clamp(progress) * total;
  let start = 0;
  for (let index = 0; index < scenes.length; index += 1) {
    const end = start + weights[index];
    if (scaled <= end || index === scenes.length - 1) {
      const rawLocal = weights[index] === 0 ? 0 : (scaled - start) / weights[index];
      return { index, rawLocal: clamp(rawLocal) };
    }
    start = end;
  }
  return { index: scenes.length - 1, rawLocal: 0 };
}

export function renderStory(trace, container) {
  if (container._storyCleanup) {
    container._storyCleanup();
    container._storyCleanup = null;
  }
  container.replaceChildren();

  const scenes = buildStoryScenes(trace);
  if (scenes.length === 0) {
    container.appendChild(el("div", "story-empty", "Choose a standard Young tableau T."));
    return;
  }

  const root = el("div", "story-shell");
  const sticky = el("div", "story-sticky");
  const mapProgress = makeMapProgress();
  const title = el("h2", "story-title");
  const subtitle = el("p", "story-subtitle");
  const rule = el("div", "story-rule");
  const stage = el("div", "story-stage");
  const factTray = el("div", "story-fact-tray");
  const canvas = el("div", "story-canvas");
  const canvasContent = el("div", "story-canvas-content");
  const regionLayer = el("div", "story-region-layer");
  const arrowLayer = el("div", "story-arrow-layer");
  const objectLayer = el("div", "story-object-layer");
  const calloutLayer = el("div", "story-callout-layer");
  canvasContent.append(regionLayer, arrowLayer, objectLayer, calloutLayer);
  canvas.appendChild(canvasContent);
  stage.appendChild(canvas);
  sticky.append(mapProgress, title, subtitle, rule, stage, factTray);
  const { rail: storyRail, guide: storyGuide } = makeStoryGuide(scenes);
  const jumpNav = makeStoryJumpNav();
  root.append(sticky, storyRail);
  container.appendChild(jumpNav);
  container.appendChild(root);

  const ids = objectIds(scenes);
  const nodes = new Map();
  ids.forEach((id) => {
    const node = el("div", "story-cell", "");
    node.dataset.storyObject = id;
    objectLayer.appendChild(node);
    nodes.set(id, node);
  });

  let lastRegionIndex = -1;
  let framePending = false;
  let transitionsEnabled = false;

  mapProgress.addEventListener("click", (event) => {
    const target = event.target.closest("[data-anchor]");
    if (!target) return;
    scrollStoryToProgress(root, progressForAnchor(scenes, target.dataset.anchor));
  });

  jumpNav.addEventListener("click", (event) => {
    const target = event.target.closest("[data-jump]");
    if (!target) return;
    const rootTop = window.scrollY + root.getBoundingClientRect().top;
    const scrollable = Math.max(1, root.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: target.dataset.jump === "bottom" ? rootTop + scrollable : rootTop,
      behavior: "smooth",
    });
  });

  const fitStage = (cameraBounds) => {
    const rawWidth = cameraBounds.maxX - cameraBounds.minX + STORY_FIT_PADDING * 2;
    const rawHeight = cameraBounds.maxY - cameraBounds.minY + STORY_FIT_PADDING * 2;
    const offsetX = STORY_FIT_PADDING - cameraBounds.minX;
    const offsetY = STORY_FIT_PADDING - cameraBounds.minY;
    const availableWidth = Math.max(280, stage.clientWidth - 2);
    const targetHeight = Math.min(720, Math.max(460, window.innerHeight - 210)) - 24;
    const scale = Math.min(1, availableWidth / rawWidth, targetHeight / rawHeight);
    const scaledWidth = rawWidth * scale;
    const scaledHeight = rawHeight * scale;
    const stageHeight = Math.max(440, Math.ceil(scaledHeight + 24));
    canvas.style.width = `${rawWidth}px`;
    canvas.style.height = `${rawHeight}px`;
    canvasContent.style.width = `${rawWidth}px`;
    canvasContent.style.height = `${rawHeight}px`;
    canvasContent.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    canvas.style.left = `${Math.max(0, (availableWidth - scaledWidth) / 2)}px`;
    canvas.style.top = `${Math.max(12, (stageHeight - scaledHeight) / 2)}px`;
    canvas.style.transform = `scale(${scale})`;
    stage.style.height = `${stageHeight}px`;
  };

  const update = () => {
    framePending = false;
    const rect = root.getBoundingClientRect();
    const scrollable = Math.max(1, root.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / scrollable);
    const { index, rawLocal } = storyPosition(scenes, progress);
    const local = ease(rawLocal);
    const aScene = scenes[index];
    const bScene = scenes[Math.min(index + 1, scenes.length - 1)];
    const activeScene = local < 0.55 ? aScene : bScene;
    const objectLocal = (aScene.arrows ?? []).length > 0
      ? (rawLocal < 0.55 ? 0 : ease((rawLocal - 0.55) / 0.45))
      : local;
    fitStage(storyBounds([aScene, bScene]));

    setMathHtml(title, activeScene.title);
    setMathHtml(subtitle, activeScene.subtitle);
    subtitle.hidden = !activeScene.subtitle;
    setMathHtml(rule, activeScene.rule ?? "");
    rule.hidden = !activeScene.rule;
    const activeIndex = scenes.indexOf(activeScene);
    updateMapProgress(mapProgress, activeAnchorForIndex(scenes, activeIndex));
    if (lastRegionIndex !== activeIndex) {
      lastRegionIndex = activeIndex;
      renderRegions(regionLayer, activeScene);
      renderStoryArrows(arrowLayer, activeScene);
      renderStoryCallouts(calloutLayer, activeScene);
      renderStoryGuide(storyGuide, activeScene);
      renderFactTray(factTray, activeScene);
    }

    ids.forEach((id) => {
      const a = aScene.objects.get(id);
      const b = bScene.objects.get(id);
      const fallback = a ?? b ?? { x: 0, y: 0, opacity: 0, display: "", role: "input" };
      const from = sceneState(aScene, id, fallback);
      const to = sceneState(bScene, id, fallback);
      const x = from.x + (to.x - from.x) * objectLocal;
      const y = from.y + (to.y - from.y) * objectLocal;
      const opacity = (from.opacity ?? 1) + ((to.opacity ?? 1) - (from.opacity ?? 1)) * objectLocal;
      const width = (from.width ?? 38) + ((to.width ?? 38) - (from.width ?? 38)) * objectLocal;
      const height = (from.height ?? 38) + ((to.height ?? 38) - (from.height ?? 38)) * objectLocal;
      const visibleState = objectLocal < 0.5 ? from : to;
      const node = nodes.get(id);
      if (visibleState.kind === "formula") {
        setMathHtml(node, visibleState.display ?? "");
        node.className = `story-formula ${visibleState.role ?? "primary"}`;
      } else {
        node.replaceChildren(document.createTextNode(visibleState.display ?? ""));
        node.className = `story-cell ${visibleState.role ?? "input"}`;
      }
      node.style.transform = `translate(${x}px, ${y}px)`;
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      node.style.opacity = String(clamp(opacity));
      node.hidden = opacity < 0.03;
    });

    if (!transitionsEnabled) {
      transitionsEnabled = true;
      window.requestAnimationFrame(() => {
        root.classList.add("story-ready");
      });
    }
  };

  const scheduleUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  container._storyCleanup = () => {
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
  };
  update();
}
