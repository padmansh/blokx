import { forwardRef, Ref, useCallback, useImperativeHandle } from "react";
import DraggablePiece from "./DraggablePiece";
import { MainPiece, Piece, PiecesDisplayType } from "../constants/interfaces";

const PiecesDisplay = (
  {
    activePlayerId,
    actualActivePlayerId,
    pieces: piecesData,
    updateRefData,
    revealPossiblePlacement,
    resetPossiblePlacement,
  }: PiecesDisplayType,
  ref: Ref<unknown>
) => {
  const updatePlacedStatus = useCallback(
    (pi: number, pId: number) => {
      const updatedPieces = piecesData?.map((p: MainPiece, i: number) =>
        i === pi ? { ...p, isPlaced: true } : p
      );

      updateRefData(updatedPieces, pId);
    },
    [piecesData, updateRefData]
  );

  useImperativeHandle(
    ref,
    () => {
      return { updatePlacedStatus };
    },
    [updatePlacedStatus]
  );

  const bindRevealPossiblePlacement = (p: Piece[][]) => {
    if (actualActivePlayerId !== activePlayerId) return;
    revealPossiblePlacement(p);
  };

  const bindResetPossiblePlacement = () => {
    if (actualActivePlayerId !== activePlayerId) return;
    resetPossiblePlacement();
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center relative">
      <div
        className={`${
          actualActivePlayerId === activePlayerId ? "hidden" : "block"
        } absolute z-[3] top-0 left-0 right-0 bottom-0 cursor-not-allowed`}
      />

      {piecesData?.map((piece, index) => {
        return (
          <div key={index}>
            <DraggablePiece
              revealPossiblePlacement={bindRevealPossiblePlacement}
              resetPossiblePlacement={bindResetPossiblePlacement}
              activePlayerId={activePlayerId}
              pi={index}
              key={index}
              piece={piece.data}
              isPlaced={piece.isPlaced}
            />
          </div>
        );
      })}
    </div>
  );
};

export default forwardRef(PiecesDisplay);
