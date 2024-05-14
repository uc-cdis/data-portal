import { IRowData } from '../Interfaces/Interfaces';

export const checkIfCellContainsSearchTerm = (
  cellText: string | number | null | undefined,
  searchInputValue: string,
) => {
  if (
    searchInputValue
    && cellText
    && cellText
      .toString()
      .toLowerCase()
      .includes(searchInputValue.toString().toLowerCase().trim())
  ) {
    return 'search-highlight';
  }
  return '';
};

export const checkIfChartContainsSearchTerm = (
  rowObject: IRowData,
  searchInputValue,
) => {
  let searchTermFound = false;
  rowObject.valueSummary.forEach((arrObj: Object) => {
    Object.values(arrObj).forEach((arrObjVal: string | number) => {
      if (checkIfCellContainsSearchTerm(arrObjVal, searchInputValue)) {
        searchTermFound = true;
      }
    });
  });
  if (searchTermFound) {
    return 'search-highlight';
  }
  return '';
};

export const checkIfDetailTableContainsSearchTerm = (
  rowObject: IRowData,
  searchInputValue: string,
) => {
  let searchTermFound = false;
  const hiddenKeys = ['minValue', 'maxValue', 'meanValue', 'standardDeviation'];
  hiddenKeys.forEach((keyString) => {
    if (checkIfCellContainsSearchTerm(rowObject[keyString], searchInputValue)) {
      searchTermFound = true;
    }
  });
  if (searchTermFound) return 'search-highlight';
  return '';
};

export const checkIfHiddenCellsContainSearchTerm = (
  rowObject: IRowData,
  searchInputValue: string,
) => {
  if (checkIfDetailTableContainsSearchTerm(rowObject, searchInputValue)) return 'search-highlight';
  if (checkIfChartContainsSearchTerm(rowObject, searchInputValue)) return 'search-highlight';
  return '';
};
