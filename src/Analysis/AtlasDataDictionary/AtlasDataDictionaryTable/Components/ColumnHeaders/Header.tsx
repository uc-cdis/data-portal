import React from 'react';
import { ISortConfig } from '../../Interfaces/Interfaces';

interface IHeaderProps {
  handleSort: Function;
  headerJSX: JSX.IntrinsicElements;
  headerKey: string;
  sortConfig: ISortConfig;
  sortable: Boolean;
}

const Header = ({
  handleSort,
  headerJSX,
  headerKey,
  sortConfig,
  sortable,
}: IHeaderProps) => {
  const getSortDirectionForCurrentColumn = () => {
    if (sortConfig.sortKey === headerKey) {
      return sortConfig.direction;
    }
    return null;
  };

  if (!sortable) {
    return (
      <th className='not-sortable' key={headerKey}>
        {headerJSX}
      </th>
    );
  }
  return (
    <th
      data-testid='header'
      key={headerKey}
      onClick={() => handleSort(headerKey)}
    >
      <div className='table-column-sorters'>
        <span className='ant-table-column-title'>{headerJSX}</span>
        <span className='table-column-sorter-inner'>
          <span
            role='presentation'
            aria-label='caret-up'
            className={`table-column-sorter-up ${
              getSortDirectionForCurrentColumn() === 'ascending' && 'active'
            }`}
          />
          <span
            role='presentation'
            aria-label='caret-down'
            className={`table-column-sorter-down ${
              getSortDirectionForCurrentColumn() === 'descending' && 'active'
            }`}
          />
        </span>
      </div>
    </th>
  );
};

export default Header;
