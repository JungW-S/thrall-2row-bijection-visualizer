import {
  cellToDominoId,
  dominoInnerCells,
  dominoOuterPartition,
  keyForRender,
  tableauCells,
} from "./render_helpers.mjs?v=20260520-story-polish-44";

const palette = [
  "#d8ecff",
  "#ffe0c2",
  "#dff3d8",
  "#f4ddff",
  "#fff1a8",
  "#ffd6df",
  "#d7f3f0",
  "#e2e4ff",
  "#f0e0d0",
  "#e6f2ba",
];

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

function formatMath(text) {
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
    .replaceAll("Psi_U(S)", "<span class=\"math\">Ψ<sub>U</sub>(S)</span>")
    .replaceAll("d(Omega(L))", "<span class=\"math\">d(Ω(L))</span>")
    .replaceAll("Omega(L)", "<span class=\"math\">Ω(L)</span>")
    .replaceAll("Phi_0", "<span class=\"math\">Φ<sub>0</sub></span>")
    .replaceAll("Psi_U", "<span class=\"math\">Ψ<sub>U</sub></span>")
    .replaceAll("Omega", "<span class=\"math\">Ω</span>")
    .replaceAll("Q_lambda", "<span class=\"math\">Q<sub>λ</sub></span>")
    .replaceAll("1_lambda", "<span class=\"math\">1<sub>λ</sub></span>")
    .replaceAll("lambda^square", "<span class=\"math\">λ<sup>□</sup></span>")
    .replaceAll("lambda*lambda", "<span class=\"math\">λ*λ</span>")
    .replaceAll("S in SYT^U(mu/lambda)", "<span class=\"math\">S∈SYT<sup>U</sup>(μ/λ)</span>")
    .replaceAll("SYT^U(mu/lambda)", "<span class=\"math\">SYT<sup>U</sup>(μ/λ)</span>")
    .replaceAll("SYT^=(2n)", "<span class=\"math\">SYT<sup>=</sup>(2n)</span>")
    .replaceAll("T^[n+1,2n]", "<span class=\"math\">T<sup>[n+1,2n]</sup></span>")
    .replaceAll("SYT_{(n,n)}(mu)", "<span class=\"math\">SYT<sub>(n,n)</sub>(μ)</span>")
    .replaceAll("SYT_{(n,n)}^spin(mu)", "<span class=\"math\">SYT<sup>spin</sup><sub>(n,n)</sub>(μ)</span>")
    .replaceAll("YDT(lambda^square,mu)", "<span class=\"math\">YDT(λ<sup>□</sup>,μ)</span>")
    .replaceAll("Y(lambda,mu)", "<span class=\"math\">Y(λ,μ)</span>")
    .replaceAll("a_{l,k}", "<span class=\"math\">a<sub>l,k</sub></span>")
    .replaceAll("spin(T)", "<span class=\"math\">spin(T)</span>")
    .replaceAll("spin(D) mod 2", "<span class=\"math\">spin(D) mod 2</span>")
    .replaceAll("spin(D)", "<span class=\"math\">spin(D)</span>")
    .replaceAll("maj(T_[n])", "<span class=\"math\">maj(T<sub>[n]</sub>)</span>")
    .replaceAll("n mod 2", "<span class=\"math\">n mod 2</span>")
    .replaceAll("sh(rect(S))", "<span class=\"math\">sh(rect(S))</span>")
    .replaceAll("st(T_[n+1,2n])", "<span class=\"math\">st(T<sub>[n+1,2n]</sub>)</span>")
    .replaceAll("T_[n]", "<span class=\"math\">T<sub>[n]</sub></span>")
    .replaceAll("rect(S)", "<span class=\"math\">rect(S)</span>")
    .replaceAll("rect(B)", "<span class=\"math\">rect(B)</span>")
    .replaceAll("maj(U)", "<span class=\"math\">maj(U)</span>")
    .replaceAll("xi(T)", "<span class=\"math\">ξ(T)</span>")
    .replaceAll("xi", "<span class=\"math\">ξ</span>");
  html = html
    .replace(/delta_([0-9]+)/g, "<span class=\"math\">δ<sub>$1</sub></span>")
    .replace(/\blambda\b/g, "<span class=\"math\">λ</span>")
    .replace(/\bmu\b/g, "<span class=\"math\">μ</span>")
    .replace(/Q_<span class="math">λ<\/span>/g, "<span class=\"math\">Q<sub>λ</sub></span>")
    .replace(/1_<span class="math">λ<\/span>/g, "<span class=\"math\">1<sub>λ</sub></span>")
    .replace(/\btheta\b/g, "<span class=\"math\">θ</span>");
  return html;
}

function richEl(tag, className = "", text = "") {
  const node = el(tag, className);
  node.innerHTML = formatMath(text);
  return node;
}

function plainMath(text) {
  return String(text)
    .replaceAll("Q_lambda", "Q_λ")
    .replaceAll("1_lambda", "1_λ")
    .replaceAll("Psi_U", "Ψ_U")
    .replaceAll("Omega", "Ω")
    .replaceAll("Phi_0", "Φ_0")
    .replaceAll("theta", "θ")
    .replaceAll("delta_", "δ_")
    .replaceAll("lambda", "λ")
    .replaceAll("mu", "μ")
    .replaceAll("xi", "ξ");
}

function subscriptNumber(n) {
  const digits = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
  return String(n).split("").map((digit) => digits[Number.parseInt(digit, 10)]).join("");
}

function svgEl(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function cellFromRenderKey(k) {
  return k.split(",").map((x) => Number.parseInt(x, 10));
}

function cellsOfTableau(tableau) {
  return Array.from(tableau.keys()).map(cellFromRenderKey);
}

function renderTableau(tableau, options = {}) {
  const highlights = new Set((options.highlightCells ?? []).map(keyForRender));
  const wrapper = el("div", "tableau");
  const cells = tableauCells(tableau);
  const maxRows = Math.max(...cells.map(([i]) => i), 0);
  const maxCols = Math.max(...cells.map(([, j]) => j), 0);
  wrapper.style.gridTemplateColumns = `repeat(${maxCols}, 38px)`;
  wrapper.style.gridTemplateRows = `repeat(${maxRows}, 38px)`;

  for (let i = 1; i <= maxRows; i += 1) {
    for (let j = 1; j <= maxCols; j += 1) {
      const cellKey = keyForRender([i, j]);
      const value = tableau.get(cellKey);
      const classes = [value === undefined ? "tableau-cell blank" : "tableau-cell"];
      if (highlights.has(cellKey)) classes.push("switched-cell");
      if (value !== undefined && options.cellClass) {
        const extraClass = options.cellClass({ cell: [i, j], value });
        if (extraClass) classes.push(extraClass);
      }
      const cell = el("div", classes.join(" "), value === undefined ? "" : String(value));
      cell.style.gridRow = String(i);
      cell.style.gridColumn = String(j);
      wrapper.appendChild(cell);
    }
  }
  return wrapper;
}

function renderSplitView(split) {
  const stage = el("div", "split-stage");
  const controls = el("div", "split-controls");
  const note = richEl(
    "p",
    "split-note",
    "Entries 1,...,n form U=T_[n]; entries n+1,...,2n form S=st(T_[n+1,2n]).",
  );
  controls.append(note);

  const source = renderPanel("T", renderTableau(split.T, {
    cellClass: ({ value }) => (value <= split.n ? "split-u-cell" : "split-s-cell"),
  }));
  source.classList.add("split-source-panel");

  const targets = el("div", "split-targets");
  const uPanel = renderPanel("U = T_[n]", renderTableau(split.U, {
    cellClass: () => "split-u-cell",
  }));
  uPanel.classList.add("split-target-panel", "split-u-target");
  targets.appendChild(uPanel);

  const sPanel = renderPanel("S = st(T_[n+1,2n])", renderTableau(split.S, {
    cellClass: () => "split-s-cell",
  }));
  sPanel.classList.add("split-target-panel", "split-s-target");
  targets.appendChild(sPanel);

  if (split.rectified) {
    const rectPanel = renderPanel("rect(S)", renderTableau(split.rectified, {
      cellClass: () => "split-s-cell",
    }));
    rectPanel.classList.add("split-target-panel", "split-rectified-target");
    targets.appendChild(rectPanel);
  }

  const arrow = el("div", "split-arrow", "→");
  stage.append(source, arrow, targets);

  stage.classList.add("played");

  const wrapper = el("div", "split-view");
  wrapper.append(controls, stage);
  return wrapper;
}

function renderSplitBoard(split) {
  return renderConstructionBoard(renderSplitView(split));
}

function renderSwitchingCombined(state, switching, idx, options = {}) {
  const innerName = idx === switching.states.length - 1 ? switching.finalInnerLabel : switching.innerLabel;
  const outerName = idx === switching.states.length - 1 ? switching.finalOuterLabel : switching.outerLabel;
  const highlightCells = new Set(state.move ? [state.move.innerCell, state.move.outerCell].map(keyForRender) : []);
  const innerCells = cellsOfTableau(state.inner);
  const outerCells = cellsOfTableau(state.outer);
  const allCells = [...innerCells, ...outerCells];
  const maxRows = Math.max(...allCells.map(([r]) => r), 1);
  const maxCols = Math.max(...allCells.map(([, c]) => c), 1);
  const wrapper = el("div", "switch-combined");
  wrapper.style.gridTemplateColumns = `repeat(${maxCols}, 38px)`;
  wrapper.style.gridTemplateRows = `repeat(${maxRows}, 38px)`;

  for (let i = 1; i <= maxRows; i += 1) {
    for (let j = 1; j <= maxCols; j += 1) {
      const cell = [i, j];
      const cellKey = keyForRender(cell);
      const inInner = state.inner.has(cellKey);
      const inOuter = state.outer.has(cellKey);
      if (!inInner && !inOuter) {
        const blank = el("div", "tableau-cell blank", "");
        blank.style.gridRow = String(i);
        blank.style.gridColumn = String(j);
        wrapper.appendChild(blank);
        continue;
      }
      const classes = ["tableau-cell", inInner ? "switch-inner-cell" : "switch-outer-cell"];
      if (highlightCells.has(cellKey)) classes.push("switched-cell");
      const value = inInner ? state.inner.get(cellKey) : state.outer.get(cellKey);
      const node = el("div", classes.join(" "), String(value));
      node.style.gridRow = String(i);
      node.style.gridColumn = String(j);
      node.title = `${plainMath(inInner ? innerName : outerName)}, cell (${i},${j})`;
      wrapper.appendChild(node);
    }
  }

  if (state.move && options.showConnector !== false) {
    wrapper.appendChild(renderSwitchConnector(state.move, maxRows, maxCols));
  }
  if (options.animateMove && state.move && options.previousState) {
    appendSwitchMotion(wrapper, state.move);
  }
  return wrapper;
}

function appendSwitchMotion(wrapper, move) {
  const cellSize = 38;
  const pieces = [
    {
      label: move.innerLabel,
      className: "switch-inner-cell",
      from: move.innerCell,
      to: move.outerCell,
    },
    {
      label: move.outerLabel,
      className: "switch-outer-cell",
      from: move.outerCell,
      to: move.innerCell,
    },
  ];
  wrapper.classList.add("animating-switch");
  pieces.forEach((piece) => {
    const node = el("div", `tableau-cell switch-flying-cell ${piece.className}`, String(piece.label));
    const fromX = (piece.from[1] - 1) * cellSize;
    const fromY = (piece.from[0] - 1) * cellSize;
    const dx = (piece.to[1] - piece.from[1]) * cellSize;
    const dy = (piece.to[0] - piece.from[0]) * cellSize;
    node.style.left = `${fromX}px`;
    node.style.top = `${fromY}px`;
    node.style.setProperty("--switch-dx", `${dx}px`);
    node.style.setProperty("--switch-dy", `${dy}px`);
    wrapper.appendChild(node);
    window.requestAnimationFrame(() => {
      node.classList.add("moving");
    });
    window.setTimeout(() => {
      node.remove();
      wrapper.classList.remove("animating-switch");
    }, 520);
  });
}

function renderSwitchConnector(move, maxRows, maxCols) {
  const cellSize = 38;
  const svg = svgEl("svg");
  svg.setAttribute("class", "switch-overlay");
  svg.setAttribute("viewBox", `0 0 ${maxCols * cellSize} ${maxRows * cellSize}`);
  svg.setAttribute("width", String(maxCols * cellSize));
  svg.setAttribute("height", String(maxRows * cellSize));

  const defs = svgEl("defs");
  const marker = svgEl("marker");
  marker.setAttribute("id", "switch-arrow-head");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("refX", "5.4");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  const path = svgEl("path");
  path.setAttribute("d", "M 0 0 L 6 3 L 0 6 z");
  path.setAttribute("fill", "#1f6feb");
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);

  const line = svgEl("line");
  line.setAttribute("x1", String((move.innerCell[1] - 0.5) * cellSize));
  line.setAttribute("y1", String((move.innerCell[0] - 0.5) * cellSize));
  line.setAttribute("x2", String((move.outerCell[1] - 0.5) * cellSize));
  line.setAttribute("y2", String((move.outerCell[0] - 0.5) * cellSize));
  line.setAttribute("class", "switch-connector");
  line.setAttribute("marker-end", "url(#switch-arrow-head)");
  svg.appendChild(line);
  return svg;
}

function renderDominoTableau(tableau, options = {}) {
  const moved = new Set(options.openIds ?? []);
  const selectedSet = options.selectedDominoIds ? new Set(options.selectedDominoIds) : null;
  const sourceComponents = options.sourceComponents ?? null;
  const orderLabels = options.orderLabels ?? null;
  const sourceCells = new Set((options.arrows ?? []).map((arrow) => keyForRender(arrow.source)));
  const targetCells = new Set((options.arrows ?? []).map((arrow) => keyForRender(arrow.target)));
  const baseOuter = dominoOuterPartition(tableau);
  const arrowCells = (options.arrows ?? []).flatMap((arrow) => [arrow.source, arrow.target]);
  const maxRows = Math.max(baseOuter.length, ...arrowCells.map(([r]) => r), 1);
  const maxCols = Math.max(...baseOuter, ...arrowCells.map(([, c]) => c), 1);
  const inner = new Set(dominoInnerCells(tableau).map(keyForRender));
  const c2d = cellToDominoId(tableau);
  const wrapper = el("div", "domino-tableau domino-grid");
  wrapper.style.gridTemplateColumns = `repeat(${maxCols}, 38px)`;
  wrapper.style.gridTemplateRows = `repeat(${maxRows}, 38px)`;

  for (let rowIndex = 0; rowIndex < maxRows; rowIndex += 1) {
    for (let j = 1; j <= maxCols; j += 1) {
      const cell = [rowIndex + 1, j];
      const cellKey = keyForRender(cell);
      if (inner.has(cellKey)) {
        const classNames = ["tableau-cell"];
        classNames.push("inner");
        const node = el("div", classNames.join(" "), "");
        node.style.gridRow = String(rowIndex + 1);
        node.style.gridColumn = String(j);
        wrapper.appendChild(node);
      } else if (c2d.get(cellKey) === undefined && (sourceCells.has(cellKey) || targetCells.has(cellKey))) {
        const classNames = ["tableau-cell"];
        classNames.push("blank", "arrow-blank");
        const node = el("div", classNames.join(" "), "");
        node.style.gridRow = String(rowIndex + 1);
        node.style.gridColumn = String(j);
        wrapper.appendChild(node);
      }
    }
  }

  tableau.dominoes.forEach((domino, id) => {
    const rows = domino.cells.map(([r]) => r);
    const cols = domino.cells.map(([, c]) => c);
    const rowStart = Math.min(...rows);
    const colStart = Math.min(...cols);
    const rowSpan = Math.max(...rows) - rowStart + 1;
    const colSpan = Math.max(...cols) - colStart + 1;
    const classNames = [
      "domino-tile",
      rowSpan === 2 ? "vertical-domino" : "horizontal-domino",
    ];
    const sourceComponent = sourceComponents?.get(id) ?? null;
    if (sourceComponent) classNames.push(`source-${sourceComponent}`);
    if (moved.has(id)) classNames.push("moved");
    if (selectedSet) {
      if (selectedSet.has(id)) classNames.push("selected");
      else classNames.push("faded");
    }
    const node = el("div", classNames.join(" "));
    node.style.gridRow = `${rowStart} / span ${rowSpan}`;
    node.style.gridColumn = `${colStart} / span ${colSpan}`;
    if (sourceComponent === "lower") node.style.background = "#f1f8ff";
    else if (sourceComponent === "upper") node.style.background = "#fff8e7";
    else node.style.background = palette[id % palette.length];
    const sourceText = sourceComponent === "lower"
      ? " from M, vertical domino"
      : sourceComponent === "upper"
        ? " from 1_λ, horizontal domino"
        : "";
    node.title = `domino ${id}${sourceText}: (${domino.cells.map((cell) => cell.join(",")).join("),(")})`;
    node.appendChild(el("span", "domino-label", String(domino.label)));
    if (orderLabels?.has(id)) {
      node.appendChild(el("span", "chain-order-badge", orderLabels.get(id)));
    }
    wrapper.appendChild(node);
  });

  if ((options.arrows ?? []).length > 0) {
    wrapper.appendChild(renderArrowOverlay(options.arrows, maxRows, maxCols));
  }
  return wrapper;
}

function renderOmegaTableau(data) {
  const lambda = data.lambda;
  const rowOffset = lambda.length;
  const colOffset = lambda[0] ?? 0;
  const lowerEntries = new Map();
  const upperEntries = new Map();

  cellsOfTableau(data.lowerLeft).forEach((cell) => {
    lowerEntries.set(keyForRender([cell[0] + rowOffset, cell[1]]), data.lowerLeft.get(keyForRender(cell)));
  });
  cellsOfTableau(data.upperRight).forEach((cell) => {
    upperEntries.set(keyForRender([cell[0], cell[1] + colOffset]), data.upperRight.get(keyForRender(cell)));
  });

  const maxRows = rowOffset * 2;
  const maxCols = colOffset * 2;
  const wrapper = el("div", "omega-tableau");
  wrapper.style.gridTemplateColumns = `repeat(${maxCols}, 38px)`;
  wrapper.style.gridTemplateRows = `repeat(${maxRows}, 38px)`;

  for (let i = 1; i <= maxRows; i += 1) {
    for (let j = 1; j <= maxCols; j += 1) {
      const cellKey = keyForRender([i, j]);
      const inLower = lowerEntries.has(cellKey);
      const inUpper = upperEntries.has(cellKey);
      if (!inLower && !inUpper) {
        const blank = el("div", "tableau-cell blank", "");
        blank.style.gridRow = String(i);
        blank.style.gridColumn = String(j);
        wrapper.appendChild(blank);
        continue;
      }
      const className = inLower ? "tableau-cell omega-lower-cell" : "tableau-cell omega-upper-cell";
      const node = el("div", className, String(inLower ? lowerEntries.get(cellKey) : upperEntries.get(cellKey)));
      node.style.gridRow = String(i);
      node.style.gridColumn = String(j);
      node.title = inLower ? "lower-left component M" : "upper-right component 1_λ";
      wrapper.appendChild(node);
    }
  }
  return wrapper;
}

function renderArrowOverlay(arrows, maxRows, maxCols) {
  const cellSize = 38;
  const svg = svgEl("svg");
  svg.setAttribute("class", "arrow-overlay");
  svg.setAttribute("viewBox", `0 0 ${maxCols * cellSize} ${maxRows * cellSize}`);
  svg.setAttribute("width", String(maxCols * cellSize));
  svg.setAttribute("height", String(maxRows * cellSize));

  const defs = svgEl("defs");
  const marker = svgEl("marker");
  marker.setAttribute("id", "theta-arrow-head");
  marker.setAttribute("markerWidth", "5.5");
  marker.setAttribute("markerHeight", "5.5");
  marker.setAttribute("refX", "5");
  marker.setAttribute("refY", "2.75");
  marker.setAttribute("orient", "auto");
  const path = svgEl("path");
  path.setAttribute("d", "M 0 0 L 5.5 2.75 L 0 5.5 z");
  path.setAttribute("fill", "#111827");
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);

  arrows.forEach((arrow) => {
    const line = svgEl("line");
    const x1 = (arrow.source[1] - 0.5) * cellSize;
    const y1 = (arrow.source[0] - 0.5) * cellSize;
    const x2 = (arrow.target[1] - 0.5) * cellSize;
    const y2 = (arrow.target[0] - 0.5) * cellSize;
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.setAttribute("class", "theta-arrow");
    line.setAttribute("marker-end", "url(#theta-arrow-head)");
    svg.appendChild(line);
  });
  return svg;
}

function renderPanel(label, bodyNode) {
  const panel = el("div", "panel");
  panel.appendChild(richEl("div", "panel-title", label));
  panel.appendChild(bodyNode);
  return panel;
}

function renderStepExplanation(step) {
  const explanation = el("div", "step-explanation");
  explanation.appendChild(richEl("h2", "", step.title));
  explanation.appendChild(richEl("p", "description", step.description));
  return explanation;
}

function renderConstructionBoard(...children) {
  const board = el("div", "construction-board");
  children.forEach((child) => board.appendChild(child));
  return board;
}

function renderInputBoard(step) {
  const tableau = step.tableaux?.[0]?.tableau;
  const boardRow = el("div", "construction-row input-board-row");
  boardRow.appendChild(renderPanel("T", renderTableau(tableau)));
  return renderConstructionBoard(boardRow);
}

function renderDMapLegend() {
  const legend = el("div", "d-map-legend");
  const rows = [
    ["component lower", "lower-left component M", "sample-domino vertical", "vertical dominoes"],
    ["component upper", "upper-right component 1_lambda", "sample-domino horizontal", "horizontal dominoes"],
  ];
  rows.forEach(([componentClass, source, sampleClass, target]) => {
    const row = el("div", "d-map-legend-row");
    row.appendChild(richEl("span", componentClass, source));
    row.appendChild(el("span", "d-map-small-arrow", "→"));
    row.appendChild(richEl("span", sampleClass, target));
    legend.appendChild(row);
  });
  return legend;
}

function renderOmegaBuildInfo(info) {
  const box = el("div", "omega-build");
  box.appendChild(richEl(
    "p",
    "omega-build-text",
    "If L contains a_{l,k} entries equal to k in row l, then M contains a_{l,k} entries equal to l in row k.",
  ));

  const table = el("table", "omega-count-table");
  const thead = el("thead");
  const headRow = el("tr");
  headRow.appendChild(richEl("th", "", "row of L"));
  const maxEntry = info.counts[0]?.length ?? 0;
  for (let k = 1; k <= maxEntry; k += 1) {
    headRow.appendChild(richEl("th", "", `entry ${k}`));
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = el("tbody");
  info.counts.forEach((row, idx) => {
    const tr = el("tr");
    tr.appendChild(richEl("th", "", `row ${idx + 1}`));
    row.forEach((count) => tr.appendChild(el("td", "", String(count))));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const rows = el("div", "omega-m-rows");
  info.mRows.forEach((row) => {
    const pieces = row.pieces.length === 0
      ? "no entries"
      : row.pieces.map(({ value, count }) => `${count} ${count === 1 ? "copy" : "copies"} of ${value}`).join(", ");
    const result = row.entries.length === 0 ? "empty" : row.entries.join(" ");
    rows.appendChild(richEl("div", "omega-m-row", `row ${row.row} of M: ${pieces} → ${result}`));
  });

  box.append(table, rows);
  return box;
}

function renderDMapView(step) {
  const lowerCount = cellsOfTableau(step.dMapView.lowerLeft).length;
  const sourceComponents = new Map();
  step.domino.dominoes.forEach((_, id) => {
    sourceComponents.set(id, id < lowerCount ? "lower" : "upper");
  });

  const view = el("div", "d-map-view");
  view.appendChild(renderPanel("Omega(L)", renderOmegaTableau(step.dMapView)));
  view.appendChild(richEl("div", "d-map-arrow", "d"));
  view.appendChild(renderPanel("d(Omega(L))", renderDominoTableau(step.domino, { sourceComponents })));
  const wrapper = el("div", "d-map-wrapper");
  wrapper.append(view, renderDMapLegend());
  return wrapper;
}

function renderFinalInfo(info) {
  const box = el("div", "final-info");
  const majorOk = Boolean(info.xiDefined && info.inTwoRowRefined);
  const spinOk = info.inY;
  const subsetOk = Boolean(info.xiDefined && majorOk && spinOk);
  const status = el("div", subsetOk ? "final-status in-set" : "final-status out-set");
  const spinRelation = spinOk ? "≡" : "≠";
  status.appendChild(richEl(
    "div",
    "final-status-main",
    !info.xiDefined
      ? `xi(T) is not defined`
      : subsetOk
      ? `T ∈ SYT_{(n,n)}^spin(mu)`
      : `T ∉ SYT_{(n,n)}^spin(mu)`,
  ));
  const rows = el("div", "final-parity-rows");
  if (info.xiDefined) {
    rows.appendChild(richEl("div", "final-parity-row", `maj(T_[n]) = ${info.blockMajor}`));
    rows.appendChild(richEl(
      "div",
      "final-parity-row",
      `maj(T_[n]) ${majorOk ? "≡" : "≠"} 1 mod n`,
    ));
  }
  rows.appendChild(richEl("div", "final-parity-row", `spin(D) = ${info.spin}`));
  rows.appendChild(richEl("div", "final-parity-row", `spin(D) ${spinRelation} n mod 2`));
  status.appendChild(rows);

  box.appendChild(status);
  let note = "Since T is not in SYT^=(2n), xi(T) is not defined. The displayed D is only the comparison output.";
  if (info.xiDefined && info.inTwoRowRefined) {
    note = info.inSpinSubset
      ? `Here xi(T)=(U,D) and spin(T)=spin(D). Thus T ∈ SYT_{(n,n)}^spin(mu), with mu=(${info.mu.join(",")}).`
      : `Here xi(T)=(U,D) and spin(T)=spin(D). Thus T ∉ SYT_{(n,n)}^spin(mu), with mu=(${info.mu.join(",")}).`;
  } else if (info.xiDefined) {
    note = `Here xi(T)=(U,D) and spin(T)=spin(D), but maj(T_[n])=${info.blockMajor} is not congruent to 1 modulo n. Thus T ∉ SYT_{(n,n)}(mu), with mu=(${info.mu.join(",")}).`;
  }
  box.appendChild(richEl("p", "final-note", note));
  return box;
}

function renderArrowList(arrows = [], tableau = null) {
  const box = el("div", "arrow-box");
  if (arrows.length === 0) {
    box.appendChild(el("div", "muted", "No arrows."));
    return box;
  }
  const list = el("ul", "compact-list");
  arrows.forEach((arrow) => {
    const label = tableau?.dominoes[arrow.dominoId]?.label ?? "?";
    const item = el(
      "li",
      "",
      `label ${label}: (${arrow.source[0]},${arrow.source[1]}) -> (${arrow.target[0]},${arrow.target[1]})`,
    );
    list.appendChild(item);
  });
  box.appendChild(list);
  return box;
}

function renderChainSequence(chain, tableau) {
  return chain.dominoIds.map((id, idx) => {
    const label = tableau.dominoes[id]?.label ?? "?";
    return `ζ${subscriptNumber(idx + 1)}(${label})`;
  }).join(" → ");
}

function renderChainSelector(chainDetails = [], selectedIndex, onSelect, tableau) {
  const box = el("div", "arrow-box");
  if (chainDetails.length === 0) {
    box.appendChild(el("div", "muted", "No chains."));
    return box;
  }

  const list = el("div", "chain-list");
  const allButton = el("button", selectedIndex === null ? "chain-button all active" : "chain-button all");
  allButton.type = "button";
  allButton.appendChild(el("span", "chain-main", "All chains"));
  allButton.appendChild(el("span", "chain-sequence", "open and closed chains"));
  allButton.addEventListener("click", () => onSelect(null));
  list.appendChild(allButton);

  chainDetails.forEach((chain, idx) => {
    const item = el(
      "button",
      [
        "chain-button",
        chain.type,
        selectedIndex === idx ? "active" : "",
      ].filter(Boolean).join(" "),
    );
    item.type = "button";
    item.appendChild(el("span", "chain-main", `chain ${idx + 1}`));
    item.appendChild(el("span", "chain-sequence", renderChainSequence(chain, tableau)));
    item.addEventListener("click", () => onSelect(idx));
    item.addEventListener("mouseenter", () => onSelect(idx));
    list.appendChild(item);
  });
  box.appendChild(list);
  return box;
}

function renderSwitchingSetup(setup) {
  const wrapper = el("div", "switch-setup");
  const left = renderPanel(setup.leftLabel, renderTableau(setup.leftTableau, {
    cellClass: () => "switch-inner-cell",
  }));
  const right = renderPanel(setup.rightLabel, renderTableau(setup.rightTableau, {
    cellClass: () => "switch-outer-cell",
  }));
  const target = renderPanel(setup.targetLabel, renderTableau(setup.targetTableau, {
    cellClass: () => "switch-target-cell",
  }));
  left.classList.add("switch-setup-panel");
  right.classList.add("switch-setup-panel");
  target.classList.add("switch-setup-panel", "switch-target-panel");
  wrapper.append(
    left,
    el("div", "switch-setup-symbol", "+"),
    right,
    el("div", "switch-setup-symbol", "⇝"),
    target,
  );
  return wrapper;
}

function renderSwitchingBoard(switching) {
  const board = renderConstructionBoard();
  if (switching.setup) {
    const setupBlock = el("div", "construction-board-block");
    setupBlock.appendChild(richEl("div", "panel-title", `X(${switching.innerLabel},${switching.outerLabel})`));
    setupBlock.appendChild(renderSwitchingSetup(switching.setup));
    board.appendChild(setupBlock);
  }
  const traceBlock = el("div", "construction-board-block");
  traceBlock.appendChild(el("div", "panel-title", "tableau switching"));
  traceBlock.appendChild(renderSwitchingTrace(switching));
  board.appendChild(traceBlock);
  return board;
}

function renderSwitchFrame(switching, idx, options = {}) {
  const state = switching.states[idx];
  const frame = el("div", "switch-frame");
  const title = el("div", "frame-title", idx === 0 ? "initial pair" : `move ${idx}`);
  frame.appendChild(title);
  if (state.move) {
    frame.appendChild(el("div", "move-caption", "interchanged cells"));
  } else {
    frame.appendChild(el("div", "move-caption", "initial pair"));
  }

  const legend = el("div", "switch-legend");
  const innerName = idx === switching.states.length - 1 ? switching.finalInnerLabel : switching.innerLabel;
  const outerName = idx === switching.states.length - 1 ? switching.finalOuterLabel : switching.outerLabel;
  legend.appendChild(richEl("span", "legend-item inner", innerName));
  legend.appendChild(richEl("span", "legend-item outer", outerName));
  frame.appendChild(legend);
  frame.appendChild(renderSwitchingCombined(state, switching, idx, {
    ...options,
    showConnector: false,
  }));
  return frame;
}

function renderSwitchingTrace(switching) {
  let current = 0;
  const wrapper = el("div", "switch-player");
  const controls = el("div", "switch-controls");
  const prev = el("button", "secondary", "Previous");
  const next = el("button", "secondary", "Next");
  const counter = el("span", "switch-counter");
  const slider = el("input", "switch-slider");
  const frameHost = el("div", "switch-frame-host");

  prev.type = "button";
  next.type = "button";
  slider.type = "range";
  slider.min = "0";
  slider.max = String(Math.max(0, switching.states.length - 1));
  slider.step = "1";

  const render = (options = {}) => {
    frameHost.replaceChildren(renderSwitchFrame(switching, current, options));
    counter.textContent = `${current + 1} / ${switching.states.length}`;
    prev.disabled = current === 0;
    next.disabled = current === switching.states.length - 1;
    slider.value = String(current);
  };

  prev.addEventListener("click", () => {
    current = Math.max(0, current - 1);
    render();
  });
  next.addEventListener("click", () => {
    const previous = current;
    current = Math.min(switching.states.length - 1, current + 1);
    render({
      animateMove: current > previous,
      previousState: switching.states[previous],
    });
  });
  slider.addEventListener("input", () => {
    current = Number.parseInt(slider.value, 10);
    render();
  });

  controls.append(prev, counter, next);
  wrapper.append(controls, slider, frameHost);
  render();
  return wrapper;
}

function renderSwitchingOverview(switching) {
  const wrapper = el("div", "switch-overview");
  const first = switching.states[0];
  const last = switching.states[switching.states.length - 1];
  const finalState = {
    inner: last.inner,
    outer: last.outer,
    move: null,
  };

  wrapper.appendChild(renderPanel(
    `${switching.innerLabel} and ${switching.outerLabel}`,
    renderSwitchingCombined(first, switching, 0),
  ));
  wrapper.appendChild(renderPanel(
    `${switching.finalInnerLabel} and ${switching.finalOuterLabel}`,
    renderSwitchingCombined(finalState, switching, switching.states.length - 1),
  ));
  return wrapper;
}

function renderThetaStep(step) {
  let selectedIndex = null;
  const section = el("div", "theta-step");
  const grid = el("div", "panel-grid two");
  const info = el("div", "theta-info");

  const selectedIds = () => {
    if (selectedIndex === null) return null;
    return step.chainDetails[selectedIndex]?.dominoIds ?? null;
  };

  const selectedArrows = () => {
    const ids = selectedIds();
    if (ids === null) return step.arrows;
    const idSet = new Set(ids);
    return step.arrows.filter((arrow) => idSet.has(arrow.dominoId));
  };

  const selectedOrderLabels = () => {
    if (selectedIndex === null) return null;
    const chain = step.chainDetails[selectedIndex];
    if (!chain) return null;
    return new Map(chain.dominoIds.map((id, idx) => [id, `ζ${subscriptNumber(idx + 1)}`]));
  };

  const render = () => {
    const ids = selectedIds();
    const orderLabels = selectedOrderLabels();
    grid.replaceChildren(
      renderPanel("D", renderDominoTableau(step.dominoBefore, {
        arrows: selectedArrows(),
        openIds: step.openIds,
        selectedDominoIds: ids,
        orderLabels,
      })),
      renderPanel("theta(D)", renderDominoTableau(step.dominoAfter, {
        selectedDominoIds: ids,
        orderLabels,
      })),
    );
    info.replaceChildren(
      renderPanel("chains", renderChainSelector(step.chainDetails, selectedIndex, (idx) => {
        selectedIndex = idx;
        render();
      }, step.dominoBefore)),
    );
  };

  section.append(grid, info);
  render();
  return section;
}

export function renderStep(step, container) {
  container.replaceChildren();
  container.appendChild(renderStepExplanation(step));

  if (step.phase === "vartheta" && step.tableaux?.length === 1 && !step.split) {
    container.appendChild(renderInputBoard(step));
  } else if (step.split) {
    container.appendChild(renderSplitBoard(step.split));
  } else if (step.tableaux && !step.switching) {
    const grid = el("div", "panel-grid");
    step.tableaux.forEach(({ label, tableau }) => {
      grid.appendChild(renderPanel(label, renderTableau(tableau)));
    });
    if (step.omegaTableau) {
      grid.appendChild(renderPanel("Omega(L)", renderOmegaTableau(step.omegaTableau)));
    }
    const board = renderConstructionBoard(grid);
    if (step.omegaBuildInfo) {
      board.appendChild(renderPanel("M", renderOmegaBuildInfo(step.omegaBuildInfo)));
    }
    container.appendChild(board);
  }

  if (step.switching) {
    container.appendChild(renderSwitchingBoard(step.switching));
  }

  const trailingBoardNodes = [];
  if (step.dMapView) {
    trailingBoardNodes.push(renderDMapView(step));
  } else if (step.domino) {
    trailingBoardNodes.push(renderPanel("D", renderDominoTableau(step.domino)));
  }

  if (step.finalInfo) {
    trailingBoardNodes.push(renderPanel(step.finalInfo.xiDefined ? "spin(D)" : "comparison output", renderFinalInfo(step.finalInfo)));
  }

  if (trailingBoardNodes.length > 0) {
    container.appendChild(renderConstructionBoard(...trailingBoardNodes));
  }

  if (step.dominoBefore && step.dominoAfter) {
    container.appendChild(renderConstructionBoard(renderThetaStep(step)));
  }
}

export function renderStepList(trace, currentIndex, container, onSelect) {
  container.replaceChildren();
  let previousPhase = null;
  trace.steps.forEach((step, idx) => {
    const phase = step.phase ?? "";
    if (phase !== previousPhase) {
      container.appendChild(richEl("div", "step-phase", phase));
      previousPhase = phase;
    }
    const button = richEl("button", idx === currentIndex ? "step-button active" : "step-button", step.title);
    button.type = "button";
    button.addEventListener("click", () => onSelect(idx));
    container.appendChild(button);
  });
}

export function renderShapeSummary(tableau) {
  const cells = tableauCells(tableau);
  return `${cells.length} cells`;
}
