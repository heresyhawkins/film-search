export const getYear = (premieredYear: string) => {
  const date = new Date(premieredYear);
  const year = date.getFullYear();

  if (!year) {
    return "N/A";
  }

  return year;
};
