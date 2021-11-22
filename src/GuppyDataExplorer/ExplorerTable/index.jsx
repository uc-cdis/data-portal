import React, { useState } from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconicLink from '../../components/buttons/IconicLink';
import { GuppyConfigType, TableConfigType } from '../configTypeDef';
import { capitalizeFirstLetter, humanFileSize } from '../../utils';
import './ExplorerTable.css';
import LockIcon from '../../img/icons/lock.svg';
import dictIcons from '../../img/icons/index';
import '../typedef';

/** @typedef {import('react-table').Column} ReactTableColumn */

/**
 * A simplified alternative to lodash/get using string path of property names only.
 * @param {object} object The object to query.
 * @param {string} path Path to the property to get, e.g. 'a.b.c'
 * @return Returns the resolved value.
 */
function get(object, path) {
  return path.split('.').reduce((obj, key) => obj && obj[key], object);
}

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
      <div>
        <span title={valueStr}>
          <a href={`/files/${valueStr}`}>{valueStr}</a>
        </span>
      </div>
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
    return (
      <div>
        <span title={valueStr}>{humanFileSize(valueStr)}</span>
      </div>
    );

  if (field === 'external_references.external_links') {
    if (!value) return null;
    const [
      resourceName,
      resourceIconPath,
      subjectUrl,
    ] = value[0].external_links.split('|');
    return (
      <div className='explorer-table-external-links'>
        <a href={subjectUrl} target='_blank' rel='noopenner noreferrer'>
          <img src={resourceIconPath} alt={resourceName} />
        </a>
      </div>
    );
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
 * @property {string} className
 * @property {number} defaultPageSize
 * @property {(args: { offset: number; size: number; sort: GqlSort }) => Promise} fetchAndUpdateRawData
 * @property {GuppyConfig} guppyConfig
 * @property {boolean} isLocked
 * @property {Object[]} rawData
 * @property {{ fields: string[]; linkFields: string[]; ordered: boolean }} tableConfig
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
  const { dataType, downloadAccessor, fieldMapping } = guppyConfig;
  const { fields, linkFields, ordered } = tableConfig;
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
    const overrideName = fieldMapping?.find((i) => i.field === field)?.name;
    const columnName = overrideName ?? capitalizeFirstLetter(field);

    return {
      Header: columnName,
      id: field,
      maxWidth: 600,
      width: getColumnWidth({ columnName, field, linkFields, rawData }),
      accessor: (d) => d[field],
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

  /**
   * Build nested column config for each table according to their locations and fields
   * @param {string} field the full field name, contains at least 1 '.'
   * @param {boolean} [isDetailedColumn] control flag to determine if it is building column config for innermost nested table
   * @returns {ReactTableColumn}
   */
  function buildNestedColumnConfig(field, isDetailedColumn = false) {
    const overrideName = fieldMapping?.find((i) => i.field === field)?.name;
    const fieldStringsArray = field.split('.');
    // for nested table, we only display the children names in column header
    // i.e.: visits.follow_ups.follow_up_label => follow_ups.follow_up_label
    const nestedFieldName = fieldStringsArray.slice(1).join('.');

    return {
      Header: overrideName ?? capitalizeFirstLetter(nestedFieldName),
      id: field,
      maxWidth: 600,
      // for nested table we set the width arbitrary wrt view width
      // because the width of its parent row is too big
      // @ts-ignore
      width: '70vw',
      accessor: (d) => d[fieldStringsArray[0]],
      Cell: ({ value }) =>
        // for inner most detailed table, 1 value per row
        isDetailedColumn ? (
          <div className='rt-tbody'>
            <div className='rt-tr-group'>
              {value.map((v, i) => (
                <div
                  className={`rt-tr ${i % 2 === 0 ? '-even' : '-odd'}`}
                  key={i}
                >
                  <div className='rt-td'>
                    <span>
                      {get(v, nestedFieldName)}
                      <br />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          getCellElement({
            downloadAccessor,
            field,
            linkFields,
            value,
            valueStr: Array.isArray(value)
              ? value.map((v) => get(v, nestedFieldName)).join(', ')
              : get(value, nestedFieldName),
          })
        ),
    };
  }

  /**
   * Build column configs nested array fields
   * We only need nested table if the nested field is an array.
   * Otherwise, the nested field can be displayed in one row.
   * @param {{ [x: string]: string[] }} nestedArrayFieldNames an object containing
   * all the nested array fields, separated by their parent names.
   * @example
   * {
   *    ActionableMutations: [ 'Lab' ],
   *    Oncology_Primary: [ 'Multiplicitycounter', 'ICDOSite' ]
   * }
   * @returns a collection of column configs for each nested table,
   * separated by their parent names. Each set of column configs contains two configs,
   * one for the 1st level nested table and one for the 2nd level table.
   * @example
   * {
   *    ActionableMutations: [ firstLevelColumnConfig, secondLevelColumnConfig ],
   *    Oncology_Primary: [ firstLevelColumnConfig, secondLevelColumnConfig ]
   * }
   */
  function buildNestedArrayFieldColumnConfigs(nestedArrayFieldNames) {
    /** @type {{ [x: string]: ReactTableColumn[][] }} */
    const nestedArrayFieldColumnConfigs = {};
    for (const key of Object.keys(nestedArrayFieldNames)) {
      if (!nestedArrayFieldColumnConfigs[key])
        nestedArrayFieldColumnConfigs[key] = [];

      const firstLevelColumns = [];
      const secondLevelColumns = [];
      for (const nestedFieldName of nestedArrayFieldNames[key]) {
        const field = `${key}.${nestedFieldName}`;
        firstLevelColumns.push(buildNestedColumnConfig(field));
        secondLevelColumns.push(buildNestedColumnConfig(field, true));
      }

      nestedArrayFieldColumnConfigs[key].push(
        [{ Header: key, columns: firstLevelColumns }],
        [{ Header: key, columns: secondLevelColumns }]
      );
    }

    return nestedArrayFieldColumnConfigs;
  }

  // build column configs for root table first
  const rootColumnsConfig = fields.map(buildColumnConfig);
  if (!ordered)
    rootColumnsConfig.sort((a, b) =>
      String(a.Header).localeCompare(String(b.Header))
    );

  /** @type {{ [x: string]: string[] }} */
  const nestedArrayFieldNames = {};
  for (const field of fields)
    if (field.includes('.')) {
      const fieldStringsArray = field.split('.');
      if (Array.isArray(rawData?.[0]?.[fieldStringsArray[0]])) {
        if (!nestedArrayFieldNames[fieldStringsArray[0]])
          nestedArrayFieldNames[fieldStringsArray[0]] = [];

        nestedArrayFieldNames[fieldStringsArray[0]].push(
          fieldStringsArray.slice(1).join('.')
        );
      }
    }

  /** @type {import('react-table').SubComponentFunction} */
  let SubComponent = null;
  if (Object.keys(nestedArrayFieldNames).length > 0) {
    // eslint-disable-next-line max-len
    const nestedArrayFieldColumnConfigs = buildNestedArrayFieldColumnConfigs(
      nestedArrayFieldNames
    );
    // this is the subComponent of the two-level nested tables
    SubComponent = (row) =>
      Object.keys(nestedArrayFieldColumnConfigs).map((key) => (
        <div className='explorer-nested-table' key={key}>
          <ReactTable
            data={(rawData ?? []).slice(row.index, row.index + 1)}
            columns={nestedArrayFieldColumnConfigs[key][0]}
            defaultPageSize={1}
            showPagination={false}
            SubComponent={() => (
              <div className='explorer-nested-table'>
                <ReactTable
                  data={(rawData ?? []).slice(row.index, row.index + 1)}
                  columns={nestedArrayFieldColumnConfigs[key][1]}
                  defaultPageSize={1}
                  showPagination={false}
                />
              </div>
            )}
          />
        </div>
      ));
  }

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
        columns={rootColumnsConfig}
        manual
        data={isLocked || !rawData ? [] : rawData}
        showPageSizeOptions={!isLocked}
        pages={isLocked ? 0 : visiblePages}
        onFetchData={(s) =>
          isInitialFetchData
            ? setIsInitialFetchData(false)
            : fetchAndUpdateRawData({
                offset: s.page * s.pageSize,
                size: s.pageSize,
                sort: s.sorted.map((i) => ({
                  [i.id]: i.desc ? 'desc' : 'asc',
                })),
              }).then(() => {
                setPageSize(s.pageSize);
                setCurrentPage(s.page);
              })
        }
        defaultPageSize={defaultPageSize}
        className={'-striped -highlight '}
        minRows={3} // make room for no data component
        resizable={false}
        NoDataComponent={() =>
          isLocked ? (
            <div className='rt-noData'>
              <LockIcon width={30} />
              <p>You only have access to summary data</p>
            </div>
          ) : (
            <div className='rt-noData'>No data to display</div>
          )
        }
        SubComponent={isLocked ? null : SubComponent}
      />
    </div>
  );
}

ExplorerTable.propTypes = {
  rawData: PropTypes.array, // from GuppyWrapper
  fetchAndUpdateRawData: PropTypes.func.isRequired, // from GuppyWrapper
  accessibleCount: PropTypes.number.isRequired, // from GuppyWrapper
  isLocked: PropTypes.bool.isRequired,
  className: PropTypes.string,
  defaultPageSize: PropTypes.number,
  tableConfig: TableConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
  totalCount: PropTypes.number,
};

export default ExplorerTable;
