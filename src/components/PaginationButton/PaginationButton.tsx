import clsx from "clsx";

import NextIcon from "../../assets/nextArrow.svg";
import PrevIcon from "../../assets/prevArrow.svg";

export enum Direction {
  PREV = "prev",
  NEXT = "next",
}

interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction: Direction;
}

const PaginationButton = ({
  onClick,
  disabled,
  direction,
}: PaginationButtonProps) => {
  const label = direction === Direction.PREV ? "Prev Page" : "Next Page";
  const Icon = direction === Direction.PREV ? PrevIcon : NextIcon;

  return (
    <button
      type="button"
      className={clsx("show-search__pagination-button", {
        "show-search__pagination-button--disabled": disabled,
      })}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <Icon color="white" aria-hidden="true" />
    </button>
  );
};

export default PaginationButton;
