export const checkIfCellContainsSearchTerm = (
  cellText: string | number | null | undefined,
  searchInputValue: string
) => {
  if (
    searchInputValue &&
    cellText &&
    cellText
      .toString()
      .toLowerCase()
      .includes(searchInputValue.toLowerCase().trim())
  ) {
    return 'search-highlight';
  }
  return '';
};
