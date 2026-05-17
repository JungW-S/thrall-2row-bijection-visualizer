export {
  cellToDominoId,
  dominoInnerCells,
  dominoOuterPartition,
  tableauCells,
  tableauToRows,
} from "./core.mjs";

export function keyForRender(cell) {
  return `${cell[0]},${cell[1]}`;
}

