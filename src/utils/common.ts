import { NOT_AVAILABLE } from "../constants/common";

export const getYear = (releaseDate: string | null): string => {
  if (!releaseDate) {
    return NOT_AVAILABLE;
  }

  const date = new Date(releaseDate);
  const year = date.getFullYear();

  if (isNaN(year)) {
    return NOT_AVAILABLE;
  }

  return year.toString();
};
