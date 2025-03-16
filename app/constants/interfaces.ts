export interface Tile {
  color: string;
  filled: boolean;
  semifilled: boolean;
  pId: number;
}

export interface Piece {
  value: number;
  isCorner: boolean;
}

export interface Player {
  id: number;
  name: string;
}

export interface Color {
  background: string;
  border: string;
  text: string;
}

export interface MainPiece {
  data: Array<Array<Piece>>;
  isPlaced: boolean;
}

export interface PieceTrayRef {
  updatePlacedStatus: (pi: number, pId: number) => void;
}

export interface PieceTray {
  1: Array<MainPiece>;
  2: Array<MainPiece>;
  3: Array<MainPiece>;
  4: Array<MainPiece>;
}

export type Players = Array<Player>;

export interface PiecesDisplayType {
  activePlayerId: number;
  actualActivePlayerId: number;
  pieces: Array<MainPiece>;
  updateRefData: (p: Array<MainPiece>, pi: number) => void;
}

export interface DraggablePieces {
  piece: Array<Array<Piece>>;
  isPlaced: boolean;
  pi: number;
  activePlayerId: number;
}

export interface DroppableCells {
  colId: number;
  rowId: number;
  filled: boolean;
  semifilled: boolean;
  activeColorConfig: Color;
}

export interface ValidateArgs {
  startRow: number;
  startCol: number;
  totalRows: number;
  totalCols: number;
  board: Array<Array<Tile>>;
  pieceData: Piece;
}
