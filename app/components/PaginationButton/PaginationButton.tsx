export enum Direction {
  PREV = "prev",
  NEXT = "next",
}

interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction: Direction;
  size?: number;
}

const PaginationButton = ({
  onClick,
  disabled,
  direction,
  size = 24,
}: PaginationButtonProps) => {
  const label = direction === Direction.PREV ? "Prev Page" : "Next Page";

  return (
    <button
      className="show-search__pagination-button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {direction === Direction.PREV ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </button>
  );
};

export default PaginationButton;
