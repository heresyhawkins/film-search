import clsx from "clsx";

import NextIcon from "../../assets/nextArrow.svg?react";
import PrevIcon from "../../assets/prevArrow.svg?react";
import { Direction } from "./types";

interface PaginationButtonProps {
  disabled?: boolean;
  direction: Direction;
  onClick: () => void;
}

export const PaginationButton = ({
  disabled,
  direction,
  onClick,
}: PaginationButtonProps) => {
  const label = direction === Direction.PREV ? "Prev Page" : "Next Page";
  const Icon = direction === Direction.PREV ? PrevIcon : NextIcon;

  return (
    <button
      type="button"
      className={clsx("show-search__pagination-button", {
        "show-search__pagination-button--disabled": disabled,
      })}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
    >
      <Icon aria-hidden="true" />
    </button>
  );
};
