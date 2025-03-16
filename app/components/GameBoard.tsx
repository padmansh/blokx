"use client";
import {
  Collision,
  DndContext,
  DragEndEvent,
  rectIntersection,
} from "@dnd-kit/core";
import { BOARD_SIZE } from "../constants/common";
import {
  MainPiece,
  Piece,
  PieceTray,
  PieceTrayRef,
  Player,
  Tile,
} from "../constants/interfaces";
import DroppableCell from "./DroppableCell";
import PiecesDisplay from "./PiecesDisplay";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useCallback, useRef, useState } from "react";
import { colorConfig, players } from "../constants/colors";
import { allPieceArray } from "../constants/pieces";

const tile: Tile = {
  color: "",
  filled: false,
  semifilled: false,
  pId: 0,
};

const b = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(tile));

const sortCollisions = (collisions: Collision[]) => {
  return collisions.sort((c1, c2) => {
    const [rowA, colA] = String(c1?.id)?.split("-").map(Number);
    const [rowB, colB] = String(c2?.id)?.split("-").map(Number);

    if (rowA !== rowB) {
      return rowA - rowB;
    } else {
      return colA - colB;
    }
  });
};

const getStartPosition = (event: DragEndEvent) => {
  const { active, collisions } = event || {};
  const totalTiles = active?.data?.current?.tiles;

  if (!collisions || collisions?.length < totalTiles) return [];

  const sortedCollisions = sortCollisions(collisions);
  return String(sortedCollisions?.[0]?.id)?.split("-").map(Number);
};

const validatePlacement = (
  startRow: number,
  startCol: number,
  totalRows: number,
  totalCols: number,
  board: Array<Array<Tile>>,
  pieceData: Array<Array<Piece>>,
  tilesCoveredTillNow: number,
  activePlayerId: number
) => {
  let tilesOnCorner = 0;
  let cornersTouching = 0;

  for (let i = startRow; i < startRow + totalRows; i++) {
    for (let j = startCol; j < startCol + totalCols; j++) {
      const iOnBoard = i >= 0 && i < BOARD_SIZE;
      const jOnBoard = j >= 0 && j < BOARD_SIZE;

      if (
        pieceData[i - startRow][j - startCol]?.value &&
        ((i === 0 && j === 0) ||
          (i === 0 && j === BOARD_SIZE - 1) ||
          (i === BOARD_SIZE - 1 && j === 0) ||
          (i === BOARD_SIZE - 1 && j === BOARD_SIZE - 1))
      ) {
        tilesOnCorner = tilesOnCorner + 1;
      }

      if (
        pieceData[i - startRow][j - startCol]?.isCorner &&
        ((board?.[i - 1]?.[j - 1]?.filled &&
          board?.[i - 1]?.[j - 1]?.pId === activePlayerId) ||
          (board?.[i - 1]?.[j + 1]?.filled &&
            board?.[i - 1]?.[j + 1]?.pId === activePlayerId) ||
          (board?.[i + 1]?.[j - 1]?.filled &&
            board?.[i + 1]?.[j - 1]?.pId === activePlayerId) ||
          (board?.[i + 1]?.[j + 1]?.filled &&
            board?.[i + 1]?.[j + 1]?.pId === activePlayerId))
      ) {
        cornersTouching = cornersTouching + 1;
      }

      if (
        !iOnBoard ||
        !jOnBoard ||
        (pieceData[i - startRow][j - startCol]?.value &&
          (board?.[i]?.[j]?.filled ||
            (board?.[i - 1]?.[j]?.filled &&
              board?.[i - 1]?.[j]?.pId === activePlayerId) ||
            (board?.[i + 1]?.[j]?.filled &&
              board?.[i + 1]?.[j]?.pId === activePlayerId) ||
            (board?.[i]?.[j - 1]?.filled &&
              board?.[i]?.[j - 1]?.pId === activePlayerId) ||
            (board?.[i]?.[j + 1]?.filled &&
              board?.[i]?.[j + 1]?.pId === activePlayerId)))
      ) {
        return false;
      }
    }
  }

  if (tilesCoveredTillNow <= 0 && tilesOnCorner === 0) return false;
  if (tilesCoveredTillNow > 0 && cornersTouching === 0) return false;

  return true;
};

const GameBoard = () => {
  const boardRef = useRef(b);
  const pieceTrayRef = useRef<PieceTrayRef>(null);
  const [tilesCoveredByPlacedPieces, setTilesCoveredByPlacedPieces] = useState<{
    1: Array<string>;
    2: Array<string>;
    3: Array<string>;
    4: Array<string>;
  }>({ 1: [], 2: [], 3: [], 4: [] });

  const [board, setBoard] = useState(b);
  const [pieces, setPieces] = useState<PieceTray>({
    1: allPieceArray,
    2: allPieceArray,
    3: allPieceArray,
    4: allPieceArray,
  });
  const [actualActivePlayer, setActualActivePlayer] = useState(1);
  const [activePlayerId, setActivePlayerId] = useState(1);

  const handleDrag = (event: DragEndEvent, move: boolean) => {
    const { active } = event || {};
    const {
      rows: totalRows,
      cols: totalCols,
      index,
    } = active?.data?.current || {};
    const pieceData = JSON.parse(String(active?.id) || "");
    const [startRow, startCol] = getStartPosition(event);
    const bcpy = JSON.parse(JSON.stringify(boardRef.current));

    if (isNaN(Number(startRow)) || isNaN(Number(startCol))) {
      setBoard(bcpy);
      return;
    }

    const isValidPlacement = validatePlacement(
      startRow,
      startCol,
      totalRows,
      totalCols,
      bcpy,
      pieceData,
      tilesCoveredByPlacedPieces[
        activePlayerId as keyof typeof tilesCoveredByPlacedPieces
      ]?.length,
      activePlayerId
    );

    if (!isValidPlacement) {
      setBoard(bcpy);
      return;
    }

    for (let i = startRow; i < startRow + totalRows; i++) {
      for (let j = startCol; j < startCol + totalCols; j++) {
        if (move) {
          bcpy[i][j].semifilled = bcpy[i][j].filled
            ? false
            : pieceData[i - startRow][j - startCol]?.value;
          bcpy[i][j].pId = bcpy[i][j].filled ? bcpy[i][j].pId : activePlayerId;
        } else {
          bcpy[i][j].pId = bcpy[i][j].filled ? bcpy[i][j].pId : activePlayerId;
          bcpy[i][j].filled =
            bcpy[i][j].filled || pieceData[i - startRow][j - startCol]?.value;

          if (pieceData[i - startRow][j - startCol]?.value) {
            setTilesCoveredByPlacedPieces((prev) => {
              return {
                ...prev,
                [activePlayerId]: [
                  ...(prev[activePlayerId as keyof typeof prev] || []),
                  `${i},${j}`,
                ],
              };
            });
          }
        }
      }
    }

    setBoard(bcpy);

    if (!move) {
      boardRef.current = bcpy;

      if (typeof pieceTrayRef?.current?.updatePlacedStatus === "function") {
        pieceTrayRef?.current?.updatePlacedStatus(index, actualActivePlayer);
      }

      const nId = Math.max((actualActivePlayer + 1) % 5, 1);

      setActualActivePlayer(nId);
      setActivePlayerId(nId);
    }
  };

  const updateRefData = useCallback(
    (updatedPieces: Array<MainPiece>, pi: number) => {
      setPieces((p: PieceTray) => ({
        ...p,
        [pi]: updatedPieces,
      }));
    },
    []
  );

  const passTurn = () => {
    const nId = Math.max((actualActivePlayer + 1) % 5, 1);
    setActualActivePlayer(nId);
    setActivePlayerId(nId);
  };

  return (
    <>
      <DndContext
        onDragEnd={(e) => handleDrag(e, false)}
        onDragMove={(e) => handleDrag(e, true)}
        modifiers={[restrictToWindowEdges]}
        collisionDetection={rectIntersection}
      >
        <div className="flex flex-col items-center justify-center w-full p-6">
          {board?.map((row: Array<Tile>, rowId: number) => (
            <div key={rowId} className="flex">
              {row?.map((col: Tile, colId: number) => {
                const { filled, semifilled, pId } = col || {};
                const p = players?.[(pId - 1) as keyof typeof players];
                // @ts-expect-error cannot find the type for this
                const config = colorConfig[p?.name as keyof typeof colorConfig];
                return (
                  <DroppableCell
                    activeColorConfig={config}
                    rowId={rowId}
                    colId={colId}
                    key={`${rowId}-${colId}`}
                    filled={filled}
                    semifilled={semifilled}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div>
          {
            <div className="flex mx-6 gap-x-6 mb-6">
              {players?.map((p: Player) => {
                const { name, id } = p || {};
                const activeConfig =
                  colorConfig?.[name as keyof typeof colorConfig];
                return (
                  <div
                    key={`${name}-${id}`}
                    onClick={() => setActivePlayerId(id)}
                    className={`${
                      activePlayerId === id ? "" : "opacity-50"
                    } hover:opacity-100 relative duration-300 flex-1 text-center p-2 rounded-sm cursor-pointer border-[1px] flex gap-x-2 items-center justify-center ${
                      activeConfig?.background
                    } ${activeConfig?.border} ${activeConfig?.text}`}
                  >
                    <p>P{id}</p>
                    <div
                      className={`rounded-full ${activeConfig?.bgNoo} h-1 w-1`}
                    />
                    <p>
                      {
                        tilesCoveredByPlacedPieces?.[
                          id as keyof typeof tilesCoveredByPlacedPieces
                        ]?.length
                      }
                    </p>
                    <p
                      className={`${activeConfig?.text} ${
                        actualActivePlayer === id ? "opacity-100" : "opacity-0"
                      } duration-300 absolute bottom-0 right-1 text-[10px]`}
                    >
                      move
                    </p>
                  </div>
                );
              })}
            </div>
          }

          <PiecesDisplay
            ref={pieceTrayRef}
            activePlayerId={activePlayerId}
            actualActivePlayerId={actualActivePlayer}
            pieces={pieces?.[activePlayerId as keyof typeof pieces] || []}
            updateRefData={updateRefData}
          />

          <div
            onClick={passTurn}
            className={`flex flex-1 items-center justify-center mx-6 text-center bg-gray-200 mt-6 p-2 rounded-sm text-gray-500 hover:text-gray-800 cursor-pointer hover:bg-gray-300 duration-300`}
          >
            PASS
          </div>
        </div>
      </DndContext>
    </>
  );
};

export default GameBoard;
