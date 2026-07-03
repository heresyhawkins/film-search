import { NOT_AVAILABLE } from "../constants/common";

export const getYear = (premieredYear: string | null): string => {
  if (!premieredYear) {
    return NOT_AVAILABLE;
  }

  const date = new Date(premieredYear);
  const year = date.getFullYear();

  if (isNaN(year)) {
    return NOT_AVAILABLE;
  }

  return year.toString();
};
