import { ISortConfig } from '../Interfaces/Interfaces';

const DetermineNextSortDirection = (sortConfig: ISortConfig, sortKey: string|null) => {
  let direction:ISortConfig['direction'] = 'ascending';
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

const SortDataWithDirection = (data:any, direction:ISortConfig['direction'], sortKey: string) => [...data].sort((a, b) => {
  if (direction === 'ascending') {
    return a[sortKey].toString().localeCompare(b[sortKey].toString());
  }
  if (direction === 'descending') {
    return b[sortKey].toString().localeCompare(a[sortKey].toString());
  }
  return 0;
});

export { DetermineNextSortDirection, SortDataWithDirection };
