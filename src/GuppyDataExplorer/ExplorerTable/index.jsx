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
 * @param {string} args.columnName
 * @param {string} args.field
 * @param {Array} args.linkFields
 * @param {Array} args.rawData
 */
function getColumnWidth({ columnName, field, linkFields, rawData }) {
  // special cases
  if ((rawData ?? []).length === 0) return 100;
  if (field === 'external_links') return 200;
  if (linkFields.includes(field)) return 80;

  // some magic numbers that work fine for table columns width
  const maxWidth = 400;
  const letterWidth = 8;
  const spacing = 20;

  const [fieldName] = field.split('.');
  let maxLetterLen = columnName.length;
  for (const d of rawData) {
    // the calculation logic here is a bit wild if it is a nested array field
    // it would convert the whole array to string and calculate
    // which in most cases would exceed the maxWidth so just use maxWidth
    const len = d?.[fieldName]?.toString().length ?? 0;
    maxLetterLen = Math.max(len, maxLetterLen);
  }

  return Math.min(maxLetterLen * letterWidth + spacing, maxWidth);
}

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
    if (!value?.[0]?.external_links) return null;
    const [resourceName, resourceIconPath, subjectUrl] =
      value[0].external_links.split('|');
    return (
      <a
        className='explorer-table-external-links'
        href={subjectUrl}
        target='_blank'
        rel='noopener noreferrer'
      >
        <img src={resourceIconPath} alt={resourceName} />
      </a>
    );
  }

  return (
    <div>
      <span title={valueStr}>{valueStr}</span>
    </div>
  );
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** @param {Object[]} rawData */
function parseDataForTable(rawData) {
  /** @type {Object[]} */
  const parsedData = [];
  for (const row of rawData) {
    const parsedRow = {};
    for (const [fieldName, value] of Object.entries(row)) {
      // if value is nested field value, must be parsed
      // nested field value is an array of object
      // where each object contains the pairs of nested field name & value
      // e.g. [{ foo: 0, bar: 'a' }, { foo: 1. bar: 'b' }]
      if (Array.isArray(value) && value.some(isPlainObject)) {
        // parsed nested field value is an object
        // which contains the pairs of nested field name & array of its values
        // e.g. { foo: [0, 1], bar: ['a', 'b'] }
        parsedRow[fieldName] = {};
        for (const obj of value)
          for (const [nestedFieldName, nestedValue] of Object.entries(obj)) {
            if (!(nestedFieldName in parsedRow[fieldName]))
              parsedRow[fieldName][nestedFieldName] = [];
            parsedRow[fieldName][nestedFieldName].push(nestedValue);
          }
      }
      // otherwise, use it as is
      else parsedRow[fieldName] = value;
    }
    parsedData.push(parsedRow);
  }
  return parsedData;
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
                icon='exclamation-triangle'
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
