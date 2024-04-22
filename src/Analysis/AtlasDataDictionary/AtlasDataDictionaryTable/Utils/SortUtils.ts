import { ISortConfig } from '../Interfaces/Interfaces';
import ColumnsItems from './ColumnItems';

const DetermineNextSortDirection = (
  sortConfig: ISortConfig,
  sortKey: string | null
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

const determineSortType = (sortKey: string) => {
  const objectWithSortKey = ColumnsItems.find(
    (object) => object.headerKey === sortKey
  );
  return objectWithSortKey?.sortType;
};
const SortDataWithDirection = (
  data: any,
  direction: ISortConfig['direction'],
  sortKey: string
) => {
  const sortType = determineSortType(sortKey);
  if (sortType !== 'number' && sortType !== 'string') {
    throw new Error('invalid sortType found within SortDataWithDirection');
  }
  return () =>
    [...data].sort((a, b) => {
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
