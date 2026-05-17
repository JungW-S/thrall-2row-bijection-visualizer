import {
  cellToDominoId,
  dominoInnerCells,
  dominoOuterPartition,
  keyForRender,
  tableauCells,
  tableauToRows,
} from "./render_helpers.mjs";

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
    .replaceAll("Phi_0", "<span class=\"math\">Φ<sub>0</sub></span>")
    .replaceAll("Psi_U", "<span class=\"math\">Ψ<sub>U</sub></span>")
    .replaceAll("Omega(L)", "<span class=\"math\">Ω(L)</span>")
    .replaceAll("Omega", "<span class=\"math\">Ω</span>")
    .replaceAll("Q_lambda", "<span class=\"math\">Q<sub>λ</sub></span>")
    .replaceAll("1_lambda", "<span class=\"math\">1<sub>λ</sub></span>")
    .replaceAll("lambda^square", "<span class=\"math\">λ<sup>□</sup></span>")
    .replaceAll("lambda*lambda", "<span class=\"math\">λ*λ</span>")
    .replaceAll("SYT^U(mu/lambda)", "<span class=\"math\">SYT<sup>U</sup>(μ/λ)</span>")
    .replaceAll("SYT^=(2n)", "<span class=\"math\">SYT<sup>=</sup>(2n)</span>")
    .replaceAll("SYT_{(n,n)}^spin(mu)", "<span class=\"math\">SYT<sup>spin</sup><sub>(n,n)</sub>(μ)</span>")
    .replaceAll("YDT(lambda^square,mu)", "<span class=\"math\">YDT(λ<sup>□</sup>,μ)</span>")
    .replaceAll("Y(lambda,mu)", "<span class=\"math\">Y(λ,μ)</span>")
    .replaceAll("a_{l,k}", "<span class=\"math\">a<sub>l,k</sub></span>")
    .replaceAll("spin(D)", "<span class=\"math\">spin(D)</span>")
    .replaceAll("st(T_[n+1,2n])", "<span class=\"math\">st(T<sub>[n+1,2n]</sub>)</span>")
    .replaceAll("T_[n]", "<span class=\"math\">T<sub>[n]</sub></span>")
    .replaceAll("rect(S)", "<span class=\"math\">rect(S)</span>")
    .replaceAll("xi(T)", "<span class=\"math\">ξ(T)</span>")
    .replaceAll("xi", "<span class=\"math\">ξ</span>");
  html = html
    .replace(/delta_([0-9]+)/g, "<span class=\"math\">δ<sub>$1</sub></span>")
    .replace(/\blambda\b/g, "<span class=\"math\">λ</span>")
    .replace(/\bmu\b/g, "<span class=\"math\">μ</span>")
    .replace(/\btheta\b/g, "<span class=\"math\">θ</span>");
  return html;
}

function richEl(tag, className = "", text = "") {
  const node = el(tag, className);
  node.innerHTML = formatMath(text);
  return node;
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
  const rows = tableauToRows(tableau);
  rows.forEach((row, rowIndex) => {
    const rowNode = el("div", "tableau-row");
    row.forEach((value, colIndex) => {
      const classes = [value === null ? "tableau-cell blank" : "tableau-cell"];
      if (highlights.has(keyForRender([rowIndex + 1, colIndex + 1]))) classes.push("switched-cell");
      const cell = el("div", classes.join(" "), value === null ? "" : String(value));
      rowNode.appendChild(cell);
    });
    wrapper.appendChild(rowNode);
  });
  return wrapper;
}

function renderSwitchingCombined(state, switching, idx) {
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
      node.title = `${inInner ? innerName : outerName}, cell (${i},${j})`;
      wrapper.appendChild(node);
    }
  }

  if (state.move) {
    wrapper.appendChild(renderSwitchConnector(state.move, maxRows, maxCols));
  }
  return wrapper;
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
        ? " from 1_lambda, horizontal domino"
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
      node.title = inLower ? "lower-left component M" : "upper-right component 1_lambda";
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

function renderDMapLegend() {
  const legend = el("div", "d-map-legend");
  const rows = [
    ["component lower", "M in the lower-left component", "sample-domino vertical", "vertical dominoes"],
    ["component upper", "1_lambda in the upper-right component", "sample-domino horizontal", "horizontal dominoes"],
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
    "Rule: a cell in row l of L with entry k contributes one entry l to row k of M.",
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
  const status = el("div", info.inY ? "final-status in-set" : "final-status out-set");
  status.appendChild(richEl(
    "div",
    "final-status-main",
    info.inY ? "spin(D) ≡ n mod 2" : "spin(D) ≠ n mod 2",
  ));
  status.appendChild(richEl(
    "div",
    "final-status-sub",
    `spin(D) = ${info.spin} and n = ${info.n}.`,
  ));

  box.appendChild(status);
  box.appendChild(richEl(
    "p",
    "final-note",
    info.xiDefined
      ? (info.inY
        ? "Thus T ∈ SYT_{(n,n)}^spin(mu)."
        : "Thus T ∉ SYT_{(n,n)}^spin(mu).")
      : "Since T is not in SYT^=(2n), this parity statement concerns only the displayed domino tableau, not xi(T).",
  ));
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
  allButton.appendChild(el("span", "chain-sequence", "show all open and closed chains"));
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

function renderSwitchFrame(switching, idx) {
  const state = switching.states[idx];
  const frame = el("div", "switch-frame");
  const title = el("div", "frame-title", `switch ${idx}`);
  frame.appendChild(title);
  if (state.move) {
    frame.appendChild(el(
      "div",
      "move-caption",
      `swap (${state.move.innerCell[0]},${state.move.innerCell[1]}) with (${state.move.outerCell[0]},${state.move.outerCell[1]})`,
    ));
  } else {
    frame.appendChild(el("div", "move-caption", "initial pair"));
  }

  const legend = el("div", "switch-legend");
  const innerName = idx === switching.states.length - 1 ? switching.finalInnerLabel : switching.innerLabel;
  const outerName = idx === switching.states.length - 1 ? switching.finalOuterLabel : switching.outerLabel;
  legend.appendChild(richEl("span", "legend-item inner", innerName));
  legend.appendChild(richEl("span", "legend-item outer", outerName));
  frame.appendChild(legend);
  frame.appendChild(renderSwitchingCombined(state, switching, idx));
  return frame;
}

function renderSwitchingTrace(switching) {
  let current = 0;
  const wrapper = el("div", "switch-player");
  const controls = el("div", "switch-controls");
  const prev = el("button", "secondary", "Previous switch");
  const next = el("button", "secondary", "Next switch");
  const counter = el("span", "switch-counter");
  const slider = el("input", "switch-slider");
  const frameHost = el("div", "switch-frame-host");

  prev.type = "button";
  next.type = "button";
  slider.type = "range";
  slider.min = "0";
  slider.max = String(Math.max(0, switching.states.length - 1));
  slider.step = "1";

  const render = () => {
    frameHost.replaceChildren(renderSwitchFrame(switching, current));
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
    current = Math.min(switching.states.length - 1, current + 1);
    render();
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
    `before: ${switching.innerLabel} + ${switching.outerLabel}`,
    renderSwitchingCombined(first, switching, 0),
  ));
  wrapper.appendChild(renderPanel(
    `after: ${switching.finalInnerLabel} + ${switching.finalOuterLabel}`,
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
      renderPanel("before", renderDominoTableau(step.dominoBefore, {
        arrows: selectedArrows(),
        openIds: step.openIds,
        selectedDominoIds: ids,
        orderLabels,
      })),
      renderPanel("after", renderDominoTableau(step.dominoAfter, {
        selectedDominoIds: ids,
        orderLabels,
      })),
    );
    info.replaceChildren(
      renderPanel("chains", renderChainSelector(step.chainDetails, selectedIndex, (idx) => {
        selectedIndex = idx;
        render();
      }, step.dominoBefore)),
      renderPanel("arrows", renderArrowList(selectedArrows(), step.dominoBefore)),
    );
  };

  section.append(grid, info);
  render();
  return section;
}

export function renderStep(step, container) {
  container.replaceChildren();
  container.appendChild(richEl("h2", "", step.title));
  container.appendChild(richEl("p", "description", step.description));

  if (step.tableaux && !step.switching) {
    const grid = el("div", "panel-grid");
    step.tableaux.forEach(({ label, tableau }) => {
      grid.appendChild(renderPanel(label, renderTableau(tableau)));
    });
    if (step.omegaTableau) {
      grid.appendChild(renderPanel("Omega(L)", renderOmegaTableau(step.omegaTableau)));
    }
    container.appendChild(grid);
    if (step.omegaBuildInfo) {
      container.appendChild(renderPanel("How M is built", renderOmegaBuildInfo(step.omegaBuildInfo)));
    }
  }

  if (step.switching) {
    container.appendChild(el("div", "panel-title", "before and after"));
    container.appendChild(renderSwitchingOverview(step.switching));
    container.appendChild(el("div", "panel-title", "tableau switching trace"));
    container.appendChild(renderSwitchingTrace(step.switching));
  }

  if (step.dMapView) {
    container.appendChild(renderDMapView(step));
  } else if (step.domino) {
    container.appendChild(renderPanel("domino tableau", renderDominoTableau(step.domino)));
  }

  if (step.finalInfo) {
    container.appendChild(renderPanel("spin parity", renderFinalInfo(step.finalInfo)));
  }

  if (step.dominoBefore && step.dominoAfter) {
    container.appendChild(renderThetaStep(step));
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
