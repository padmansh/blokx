import { useDroppable } from "@dnd-kit/core";
import { BOARD_SIZE } from "../constants/common";
import { DroppableCells } from "../constants/interfaces";

const DroppableCell = ({
  colId,
  rowId,
  filled,
  semifilled,
  activeColorConfig,
}: DroppableCells) => {
  const { setNodeRef } = useDroppable({
    id: `${rowId}-${colId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
      ${filled || semifilled ? `${activeColorConfig?.background}` : ""}
      ${semifilled ? "bg-opacity-[0.5]" : "bg-opacity-[1]"}
      w-8 h-8 flex justify-center items-center border-black duration-200 cursor-pointer font-bold text-lg border-l-[1px] border-t-[1px] relative
      ${colId === BOARD_SIZE - 1 ? "border-r-[1px]" : ""}
      ${rowId === BOARD_SIZE - 1 ? "border-b-[1px]" : ""}
      `}
    ></div>
  );
};

export default DroppableCell;
