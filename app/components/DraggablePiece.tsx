"use client";
import { useDraggable } from "@dnd-kit/core";
import { DraggablePieces, Piece } from "../constants/interfaces";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useState } from "react";
import Rotate from "../assets/Rotate";
import MirrorImage from "../assets/MirrorImage";
import { colorConfig, players } from "../constants/colors";

const DraggablePiece = ({
  piece,
  isPlaced,
  pi,
  activePlayerId,
  revealPossiblePlacement,
  resetPossiblePlacement,
}: DraggablePieces) => {
  const [pInfo, setPInfo] = useState(piece);

  const player = players?.[(activePlayerId - 1) as keyof typeof players];
  // @ts-expect-error cannot find the type for this
  const activeConfig = colorConfig?.[player?.name as keyof typeof colorConfig];

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: JSON.stringify(pInfo),
      data: {
        tiles: pInfo?.length * pInfo?.[0]?.length,
        rows: pInfo?.length,
        cols: pInfo?.[0]?.length,
        index: pi,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const rotatePiece = useCallback(() => {
    const piece = JSON.parse(JSON.stringify(pInfo));
    const numRows = piece.length;
    const numCols = piece[0].length;
    const rotated = Array(numCols)
      .fill(null)
      .map(() => Array(numRows).fill(null));

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        rotated[col][numRows - 1 - row] = piece[row][col];
      }
    }

    setPInfo(rotated);
  }, [pInfo]);

  const mirrorImageHorizontalPiece = useCallback(() => {
    const piece = JSON.parse(JSON.stringify(pInfo));

    const mirrored = piece.map((row: Array<Piece>) => {
      if (!row || !Array.isArray(row)) {
        return [];
      }
      return [...row].reverse();
    });

    setPInfo(mirrored);
  }, [pInfo]);

  const mirrorImageVerticalPiece = useCallback(() => {
    const piece = JSON.parse(JSON.stringify(pInfo));

    piece.reverse();
    setPInfo(piece);
  }, [pInfo]);

  return (
    <div
      className={`${
        isPlaced ? "" : "group"
      } w-24 h-24 flex justify-center items-center relative border-[1px] border-gray-300`}
    >
      <div
        className={`${
          isPlaced ? "flex" : "hidden"
        } duration-300 bg-white opacity-50 z-[3] w-full h-full absolute left-0 right-0 top-0 bottom-0`}
      >
        <div className="w-full h-[1px] bg-gray-500 top-1/2 rotate-45 absolute" />
        <div className="w-full h-[1px] bg-gray-500 top-1/2 -rotate-45 absolute" />
      </div>

      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        onMouseOver={() => {
          if (isPlaced) return;
          revealPossiblePlacement(pInfo);
        }}
        onMouseOut={resetPossiblePlacement}
      >
        {pInfo?.map((row: Array<Piece>, rowId: number) => (
          <div key={rowId} className="flex cursor-grab flex-shrink-0">
            {row?.map((col: Piece, colId: number) => {
              const { value } = col || {};
              return (
                <div
                  key={colId}
                  className={`${
                    isDragging ? "w-8 h-8" : "w-4 h-4"
                  } flex justify-center items-center duration-200 font-bold text-lg relative flex-shrink-0 ${
                    activeConfig?.border
                  } 
    ${!value && !pInfo?.[rowId - 1]?.[colId]?.value ? "" : "border-t-[1.5px]"}
        ${!value && !row?.[colId - 1]?.value ? "" : "border-l-[1.5px]"}
  ${colId === row.length - 1 && value ? "border-r-[1.5px]" : ""}
  ${rowId === pInfo.length - 1 && value ? "border-b-[1.5px]" : ""}
    ${value ? activeConfig?.background : ""}
  `}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div
        onClick={rotatePiece}
        className="h-6 w-7 absolute top-0 z-[2] bg-gray-200 hidden right-0 group-hover:flex justify-center items-center cursor-pointer"
      >
        <Rotate className="scale-[0.75]" />
      </div>
      <div
        onClick={mirrorImageHorizontalPiece}
        className="h-6 w-7 bg-gray-200 z-[2] absolute top-0 right-7 hidden group-hover:flex justify-center items-center cursor-pointer"
      >
        <MirrorImage className="scale-[0.75]" />
      </div>
      <div
        onClick={mirrorImageVerticalPiece}
        className="h-6 w-7 bg-gray-200 z-[2] absolute top-0 right-14 hidden group-hover:flex justify-center items-center cursor-pointer"
      >
        <MirrorImage className="scale-[0.75] rotate-90" />
      </div>
    </div>
  );
};

export default DraggablePiece;
