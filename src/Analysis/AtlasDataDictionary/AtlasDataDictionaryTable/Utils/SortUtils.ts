import { ISortConfig, IRowData } from '../Interfaces/Interfaces';

const DetermineNextSortDirection = (
  sortConfig: ISortConfig,
  sortKey: string | null,
) => {
  let direction: ISortConfig['direction'] = 'ascending';
  if (sortConfig.sortKey === sortKey) {
    if (sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.direction === 'descending') {
      direction = 'off';
    } else if (sortConfig.direction === 'off') {
      direction = 'ascending';
    }
  }
  return direction;
};

const SortDataWithDirection = (
  data: IRowData[],
  direction: ISortConfig['direction'],
  sortKey: string,
) => {
  const sortType = typeof data[0][sortKey];
  if (sortType !== 'number' && sortType !== 'string') {
    throw new Error(
      'Invalid sortType found in SortDataWithDirection',
    );
  }
  return [...data].sort((a, b) => {
    if (direction === 'ascending') {
      return sortType === 'string'
        ? a[sortKey].toString().localeCompare(b[sortKey].toString())
        : a[sortKey] - b[sortKey];
    }
    if (direction === 'descending') {
      return sortType === 'string'
        ? b[sortKey].toString().localeCompare(a[sortKey].toString())
        : b[sortKey] - a[sortKey];
    }
    return 0;
  });
};

export { DetermineNextSortDirection, SortDataWithDirection };
