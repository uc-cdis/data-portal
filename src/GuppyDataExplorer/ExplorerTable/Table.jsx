// @ts-nocheck
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePagination, useSortBy, useTable, useFlexLayout } from 'react-table';
import './react-table.css';

/**
 * @typedef {Object} TableProps
 * @property {any[]} columns
 * @property {any[]} data
 * @property {number} [defaultPageSize]
 * @property {(s: any) => void} onFetchData
 * @property {(props: any) => JSX.Element} [NoDataComponent]
 * @property {number} [pageCount]
 * @property {boolean} [showPageSizeOptions]
 * @property {boolean} [showPagination]
 */

/** @param {TableProps} props */
function Table({
  columns: userColumns,
  data,
  defaultPageSize = 10,
  onFetchData,
  NoDataComponent = () => null,
  pageCount: controlledPageCount = 1,
  showPageSizeOptions = true,
  showPagination = true,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, sortBy },
    // pagenation utils
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      autoResetSortBy: false,
      autoResetPage: false,
      columns: userColumns,
      data,
      disableMultiSort: true,
      initialState: { pageSize: defaultPageSize },
      manualSortBy: true,
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useSortBy,
    usePagination,
    useFlexLayout
  );

  useEffect(() => {
    onFetchData({ pageIndex, pageSize, sortBy });
  }, [pageIndex, pageSize, sortBy]);

  return (
    <div className='ReactTable -striped -highlight'>
      <table {...getTableProps()} className='rt-table'>
        <thead className='rt-thead -header'>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className='rt-tr'>
              {headerGroup.headers.map((column) => {
                const headerProps = column.getHeaderProps();
                const sortByToggleProps = column.getSortByToggleProps();
                return (
                  <th
                    {...{
                      ...headerProps,
                      ...sortByToggleProps,
                      style: {
                        ...headerProps.style,
                        ...sortByToggleProps.style,
                      },
                    }}
                    className='rt-th -cursor-pointer'
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className='rt-tbody'>
          {page.length > 0 ? (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  className={`rt-tr ${i % 2 === 0 ? '-even' : '-odd'}`}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className='rt-td'>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <NoDataComponent />
          )}
        </tbody>
      </table>
      {showPagination ? (
        <div className='pagination-bottom'>
          <div className='-pagination'>
            <div className='-previous'>
              <button
                type='button'
                className='-btn'
                disabled={!canPreviousPage}
                onClick={() => previousPage()}
              >
                Previous
              </button>
            </div>
            <div className='-center'>
              <span className='-pageInfo'>
                Page{' '}
                <div className='-pageJump'>
                  <input
                    aria-label='jump to page'
                    type='number'
                    value={pageIndex + 1}
                    onChange={(e) =>
                      gotoPage(e.target.value ? Number(e.target.value) - 1 : 0)
                    }
                  />
                </div>
                of <span className='-totalPages'>{pageCount}</span>
              </span>
              {showPageSizeOptions ? (
                <span className='select-wrap -pageSizeOptions'>
                  <select
                    aria-label='rows per page'
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {[5, 10, 20, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size} rows
                      </option>
                    ))}
                  </select>
                </span>
              ) : null}
            </div>
            <div className='-next'>
              <button
                type='button'
                className='-btn'
                disabled={!canNextPage}
                onClick={() => nextPage()}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  defaultPageSize: PropTypes.number,
  onFetchData: PropTypes.func,
  NoDataComponent: PropTypes.func,
  pageCount: PropTypes.number,
  showPageSizeOptions: PropTypes.bool,
  showPagination: PropTypes.bool,
};

export default Table;
