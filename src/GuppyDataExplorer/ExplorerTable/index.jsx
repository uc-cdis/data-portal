import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconicLink from '../../components/buttons/IconicLink';
import { GuppyConfigType, TableConfigType } from '../configTypeDef';
import { capitalizeFirstLetter, humanFileSize } from '../../utils';
import ReactTable from './Table';
import './ExplorerTable.css';
import LockIcon from '../../img/icons/lock.svg';
import dictIcons from '../../img/icons/index';
import { getColumnWidth, parseDataForTable } from './utils';

/** @typedef {import('react-table').Column} ReactTableColumn */
/** @typedef {import('../types').GqlSort} GqlSort */
/** @typedef {import('../types').FilterConfig} FilterConfig */
/** @typedef {import('../types').GuppyConfig} GuppyConfig */
/**
 * @typedef {Object} TableConfig
 * @property {string[]} fields
 * @property {FilterConfig['info']} filterInfo
 * @property {string[]} linkFields
 * @property {boolean} ordered
 */

/**
 * @param {Object} args
 * @param {string} args.downloadAccessor
 * @param {string} args.field
 * @param {string[]} args.linkFields
 * @param {Array} args.value
 * @param {string} args.valueStr
 */
function getCellElement({
  downloadAccessor,
  field,
  linkFields,
  value,
  valueStr,
}) {
  if (downloadAccessor)
    return (
      <span title={valueStr}>
        <a href={`/files/${valueStr}`}>{valueStr}</a>
      </span>
    );

  if (linkFields.includes(field))
    return field && valueStr ? (
      <IconicLink
        link={valueStr}
        className='explorer-table-link'
        buttonClassName='explorer-table-link-button'
        icon='exit'
        dictIcons={dictIcons}
        iconColor='#606060'
        target='_blank'
        isExternal
      />
    ) : null;

  if (field === 'filed_size')
    return <span title={valueStr}>{humanFileSize(valueStr)}</span>;

  if (field === 'external_references.external_links') {
    return Array.isArray(value) ? (
      <>
        {value.map((s) => {
          const [resourceName, resourceIconPath, subjectUrl] = s.split('|');
          return (
            <a
              key={resourceName}
              className='explorer-table-external-links'
              href={subjectUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src={resourceIconPath} alt={resourceName} />
            </a>
          );
        })}
      </>
    ) : null;
  }

  return (
    <div>
      <span title={valueStr}>{valueStr}</span>
    </div>
  );
}

/**
 * @typedef {Object} ExplorerTableProps
 * @property {number} accessibleCount
 * @property {string} [className]
 * @property {number} [defaultPageSize]
 * @property {(args: { offset: number; size: number; sort: GqlSort }) => Promise} fetchAndUpdateRawData
 * @property {GuppyConfig} guppyConfig
 * @property {boolean} isLocked
 * @property {Object[]} [rawData]
 * @property {TableConfig} tableConfig
 * @property {number} totalCount
 */

/** @param {ExplorerTableProps} props */
function ExplorerTable({
  accessibleCount,
  className = '',
  defaultPageSize = 20,
  fetchAndUpdateRawData,
  guppyConfig,
  isLocked,
  rawData = [],
  tableConfig,
  totalCount,
}) {
  const { dataType, downloadAccessor } = guppyConfig;
  const { fields, filterInfo, linkFields, ordered } = tableConfig;
  if ((fields ?? []).length === 0) return null;

  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInitialFetchData, setIsInitialFetchData] = useState(true);

  /**
   * Build column config for each table according to their locations and fields
   * @param {string} field: the full field name
   * @returns {ReactTableColumn}
   */
  function buildColumnConfig(field) {
    const columnName = filterInfo[field]?.label ?? capitalizeFirstLetter(field);

    return {
      Header: columnName,
      id: field,
      maxWidth: 600,
      width: getColumnWidth({ columnName, field, linkFields, rawData }),
      accessor: field,
      Cell: ({ value }) =>
        getCellElement({
          downloadAccessor,
          field,
          linkFields,
          value,
          valueStr: Array.isArray(value) ? value.join(', ') : value,
        }),
    };
  }

  // build column configs for root table first
  const rootColumnsConfig = fields.map(buildColumnConfig);
  if (!ordered)
    rootColumnsConfig.sort((a, b) =>
      String(a.Header).localeCompare(String(b.Header))
    );

  const totalPages =
    Math.floor(accessibleCount / pageSize) +
    (accessibleCount % pageSize === 0 ? 0 : 1);
  const SCROLL_SIZE = 10000;
  const visiblePages = Math.min(
    totalPages,
    Math.round(SCROLL_SIZE / pageSize + 0.49)
  );
  const start = currentPage * pageSize + 1;
  const end = (currentPage + 1) * pageSize;
  const currentPageRange =
    // eslint-disable-next-line no-nested-ternary
    accessibleCount < end
      ? accessibleCount < 2
        ? accessibleCount.toLocaleString()
        : `${start.toLocaleString()} - ${accessibleCount.toLocaleString()}`
      : `${start.toLocaleString()} - ${end.toLocaleString()}`;
  const dataTypeString = pluralize(dataType);

  const columns = useMemo(() => rootColumnsConfig, [rawData]);
  const data = useMemo(() => parseDataForTable(rawData), [rawData]);
  const fetchData = useCallback(
    (s) =>
      isInitialFetchData
        ? setIsInitialFetchData(false)
        : fetchAndUpdateRawData({
            offset: s.pageIndex * s.pageSize,
            size: s.pageSize,
            sort: (s.sortBy ?? []).map((i) => ({
              [i.id]: i.desc ? 'desc' : 'asc',
            })),
          }).then(() => {
            setPageSize(s.pageSize);
            setCurrentPage(s.pageIndex);
          }),
    [fetchAndUpdateRawData]
  );

  return (
    <div className={`explorer-table ${className}`}>
      {!isLocked && (
        <p className='explorer-table__description'>
          {`Showing ${currentPageRange} of ${accessibleCount.toLocaleString()} ${dataTypeString} `}
          {accessibleCount !== totalCount && (
            <Tooltip
              placement='right'
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
              overlay={
                <span>
                  This table only shows data you can access. Click
                  {' "Request Access"'} button above for more.
                </span>
              }
            >
              <FontAwesomeIcon
                icon='triangle-exclamation'
                color='var(--pcdc-color__secondary)'
              />
            </Tooltip>
          )}
        </p>
      )}
      <ReactTable
        columns={columns}
        data={isLocked || !data ? [] : data}
        showPageSizeOptions={!isLocked}
        pageCount={isLocked ? 1 : visiblePages}
        onFetchData={fetchData}
        defaultPageSize={defaultPageSize}
        NoDataComponent={() =>
          isLocked ? (
            <tr className='rt-noData'>
              <td>
                <LockIcon width={30} />
                <p>You only have access to summary data</p>
              </td>
            </tr>
          ) : (
            <tr className='rt-noData'>
              <td>No data to display</td>
            </tr>
          )
        }
        // SubComponent={isLocked ? null : SubComponent}
      />
    </div>
  );
}

ExplorerTable.propTypes = {
  accessibleCount: PropTypes.number.isRequired, // from GuppyWrapper
  className: PropTypes.string,
  defaultPageSize: PropTypes.number,
  fetchAndUpdateRawData: PropTypes.func.isRequired, // from GuppyWrapper
  guppyConfig: GuppyConfigType.isRequired,
  isLocked: PropTypes.bool.isRequired,
  rawData: PropTypes.array, // from GuppyWrapper
  tableConfig: TableConfigType.isRequired,
  totalCount: PropTypes.number.isRequired, // from GuppyWrapper
};

export default ExplorerTable;
