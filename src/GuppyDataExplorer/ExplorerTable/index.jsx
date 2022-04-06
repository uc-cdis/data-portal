import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import pluralize from 'pluralize';
import ReactTable from 'react-table';
import { Switch } from 'antd';
import 'react-table/react-table.css';
import IconicLink from '../../components/buttons/IconicLink';
import { GuppyConfigType, TableConfigType } from '../configTypeDef';
import { hostname } from '../../localconf';
import { capitalizeFirstLetter, humanFileSize } from '../../utils';
import './ExplorerTable.css';
import LockIcon from '../../img/icons/lock.svg';
import dictIcons from '../../img/icons/index';

class ExplorerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageSize: props.defaultPageSize,
      currentPage: 0,
      showEmptyColumns: false,
    };
  }

  getWidthForColumn = (field, columnName) => {
    if (this.props.tableConfig.linkFields.includes(field)) {
      return 80;
    }

    // some magic numbers that work fine for table columns width
    const minWidth = 100;
    const maxWidth = 400;
    const letterWidth = 8;
    const spacing = 20;
    if (!this.props.rawData || this.props.rawData.length === 0) {
      return minWidth;
    }
    let maxLetterLen = columnName.length;
    const fieldStringsArray = field.split('.');
    this.props.rawData.forEach((d) => {
      if (d[fieldStringsArray[0]] === null || typeof d[fieldStringsArray[0]] === 'undefined') {
        return;
      }
      // the calculation logic here is a bit wild if it is a nested array field
      // it would convert the whole array to string and calculate
      // which in most cases would exceed the maxWidth so just use maxWidth
      const str = d[fieldStringsArray[0]].toString && d[fieldStringsArray[0]].toString();
      const len = str ? str.length : 0;
      maxLetterLen = len > maxLetterLen ? len : maxLetterLen;
    });
    const resWidth = Math.min((maxLetterLen * letterWidth) + spacing, maxWidth);
    return resWidth;
  }

  /**
   * Build column configs for each table according to their locations and fields
   * @param field: the full field name, if it is a nested field, it would contains at least 1 '.'
   * @param isNestedTableColumn: control flag to determine if it is building column config for
   * the root table or inner nested tables
   * @param isDetailedColumn: control flag to determine if it is building column config for inner
   * most nested table
   * @returns: a column config for the input field which can be used by react-table
   */
  buildColumnConfig = (field, isNestedTableColumn, isDetailedColumn) => {
    const fieldMappingEntry = this.props.guppyConfig.fieldMapping
    && this.props.guppyConfig.fieldMapping.find((i) => i.field === field);
    const overrideName = fieldMappingEntry ? fieldMappingEntry.name : undefined;
    const fieldStringsArray = field.split('.');
    // for nested table, we only display the children names in column header
    // i.e.: visits.follow_ups.follow_up_label => follow_ups.follow_up_label
    const fieldName = isNestedTableColumn ? capitalizeFirstLetter(fieldStringsArray.slice(1, fieldStringsArray.length).join('.')) : capitalizeFirstLetter(field);

    const columnConfig = {
      Header: overrideName || fieldName,
      id: field,
      maxWidth: 600,
      // for nested table we set the width arbitrary wrt view width
      // because the width of its parent row is too big
      width: isNestedTableColumn ? '70vw' : this.getWidthForColumn(field, overrideName || fieldName),
      accessor: (d) => d[fieldStringsArray[0]],
      Cell: (row) => {
        let valueStr = '';
        // not a nested field name
        if (fieldStringsArray.length === 1) {
          if (_.isArray(row.value)) {
            valueStr = row.value.join(', ');
          } else {
            valueStr = row.value;
          }
        } else {
          const nestedChildFieldName = fieldStringsArray.slice(1, fieldStringsArray.length).join('.');
          // some logic to handle depends on wether the child field in raw data is an array or not
          if (_.isArray(row.value)) {
            valueStr = row.value.map((x) => _.get(x, nestedChildFieldName)).join(', ');
          } else {
            valueStr = _.get(row.value, nestedChildFieldName);
          }
          // for inner most detailed table, 1 value per row
          if (isDetailedColumn) {
            const rowComp = (
              <div className='rt-tbody'>
                <div className='rt-tr-group'>
                  {row.value.map((element, i) => (i % 2 !== 0 ? (
                    <div className='rt-tr -odd' key={i}>
                      <div className='rt-td'>
                        <span>
                          {_.get(element, nestedChildFieldName)}
                          <br />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className='rt-tr -even' key={i}>
                      <div className='rt-td'>
                        <span>
                          {_.get(element, nestedChildFieldName)}
                          <br />
                        </span>
                      </div>
                    </div>
                  )))}
                </div>
              </div>
            );
            return rowComp;
          }
        }

        // if this field is the `dicomViewerId`, convert the value to a link to the DICOM viewer
        if (this.props.tableConfig.dicomViewerId && this.props.tableConfig.dicomViewerId === field && valueStr) {
          const dicomViewerLink = `${hostname}dicom-viewer/viewer/${valueStr}`;
          if (this.props.tableConfig.linkFields.includes(field)) { // link button
            valueStr = dicomViewerLink;
          } else { // direct link
            return (<div><span title={valueStr}><a href={dicomViewerLink} target='_blank' rel='noreferrer'>{valueStr}</a></span></div>);
          }
        }

        // handling some special field types
        switch (field) {
        case this.props.guppyConfig.downloadAccessor:
          return (<div><span title={valueStr}><a href={`/files/${valueStr}`}>{valueStr}</a></span></div>);
        case 'file_size':
          return (<div><span title={valueStr}>{humanFileSize(valueStr)}</span></div>);
        case this.props.tableConfig.linkFields.includes(field) && field:
          return valueStr
            ? (
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
            )
            : null;
        default:
          return (<div><span title={valueStr}>{valueStr}</span></div>);
        }
      },
    };
    return columnConfig;
  };

  /**
   * Build column configs nested array fields
   * We only need nested table if the nested field is an array
   * Otherwise the nested field will have 1-1 relationship to its parent
   * so can be displayed in one row
   * @param nestedArrayFieldNames: an object containing all the nested array fields,
   * separated by their parent names
   * e.g.:
   * {
   *    ActionableMutations: [ Lab ],
   *    Oncology_Primary: [ Multiplicitycounter, ICDOSite ]
   * }
   * @returns a collection of column configs for each nested table,
   * separated by their parent names. Each set of column configs contains two configs,
   * one for the 1st level nested table and one for the 2nd level table
   * e.g.:
   * {
   *    ActionableMutations: [
   *      <columnConfig for 1st level nested table>,
   *      <columnConfig for 2nd level nested table (the details table)>
   *    ],
   *    Oncology_Primary: [
   *      <columnConfig for 1st level nested table>,
   *      <columnConfig for 2nd level nested table (the details table)>
   *    ]
   * }
   */
  buildNestedArrayFieldColumnConfigs = (nestedArrayFieldNames) => {
    const nestedArrayFieldColumnConfigs = {};
    Object.keys(nestedArrayFieldNames).forEach((key) => {
      if (!nestedArrayFieldColumnConfigs[key]) {
        nestedArrayFieldColumnConfigs[key] = [];
      }
      const firstLevelColumns = nestedArrayFieldNames[key].map((field) => this.buildColumnConfig(`${key}.${field}`, true, false));
      const firstLevelColumnsConfig = [];
      firstLevelColumnsConfig.push({
        Header: key,
        columns: firstLevelColumns,
      });
      const secondLevelColumns = nestedArrayFieldNames[key].map((field) => this.buildColumnConfig(`${key}.${field}`, true, true));
      const secondLevelColumnsConfig = [];
      secondLevelColumnsConfig.push({
        Header: key,
        columns: secondLevelColumns,
      });
      nestedArrayFieldColumnConfigs[key].push(firstLevelColumnsConfig);
      nestedArrayFieldColumnConfigs[key].push(secondLevelColumnsConfig);
    });
    return nestedArrayFieldColumnConfigs;
  }

  fetchData = (state) => {
    this.setState({ loading: true });
    const offset = state.page * state.pageSize;
    const sort = state.sorted.map((i) => ({
      [i.id]: i.desc ? 'desc' : 'asc',
    }));
    const size = state.pageSize;
    this.props.fetchAndUpdateRawData({
      offset,
      size,
      sort,
    }).then(() => {
      // Guppy fetched and loaded raw data into "this.props.rawData" already
      this.setState({
        loading: false,
        pageSize: size,
        currentPage: state.page,
      });
    });
  };

  /**
   * Toggles the visibility of empty columns in the table
   * @param checked: a boolean of showing/ hiding empty columns
   * @sets: the state of showEmptyColumns
   */
  hideEmptyColumnToggle = (checked) => {
    this.setState({ showEmptyColumns: checked });
  };

  render() {
    if (!this.props.tableConfig.fields || this.props.tableConfig.fields.length === 0) {
      return null;
    }
    // build column configs for root table first
    const rootColumnsConfig = this.props.tableConfig.fields.map((field) => {
      const tempColumnConfig = this.buildColumnConfig(field, false, false);

      // Sets empty columns visibility to state showEmptyColumns
      if (this.props.rawData && this.props.rawData.length > 0) {
        // see if any item has data in current column
        const columnIsEmpty = this.props.rawData.every((colItem) => {
          const colData = colItem[tempColumnConfig.id];
          // if normal id it should have data, additional check for empty arrays
          if (colData && (typeof colData === 'number' || colData.length > 0)) {
            return false;
          }
          // check if special id with period
          const splitIndexArr = tempColumnConfig.id.split('.');
          if (splitIndexArr.length > 1) {
            // check if first part matches
            const splitColData = colItem[splitIndexArr[0]];
            return !(splitColData && splitColData.length > 0);
          }
          // default true if nothing found
          return true;
        });
        // hide column if it is empty
        if (columnIsEmpty) {
          tempColumnConfig.show = this.state.showEmptyColumns;
        }
      }
      return tempColumnConfig;
    });

    // if not ordered sort alphabetically by Header
    if (!this.props.tableConfig.ordered) {
      rootColumnsConfig.sort((a, b) => a.Header.localeCompare(b.Header));
    }

    const nestedArrayFieldNames = {};
    this.props.tableConfig.fields.forEach((field) => {
      if (field.includes('.')) {
        const fieldStringsArray = field.split('.');
        if (this.props.rawData && this.props.rawData.length > 0
          && _.isArray(this.props.rawData[0][fieldStringsArray[0]])) {
          if (!nestedArrayFieldNames[fieldStringsArray[0]]) {
            nestedArrayFieldNames[fieldStringsArray[0]] = [];
          }
          nestedArrayFieldNames[fieldStringsArray[0]].push(fieldStringsArray.slice(1, fieldStringsArray.length).join('.'));
        }
      }
    });
    let nestedArrayFieldColumnConfigs = {};
    let subComponent = null;
    if (Object.keys(nestedArrayFieldNames).length > 0) {
      nestedArrayFieldColumnConfigs = this.buildNestedArrayFieldColumnConfigs(nestedArrayFieldNames);
      // this is the subComponent of the two-level nested tables
      subComponent = (row) => Object.keys(nestedArrayFieldColumnConfigs).map((key) => {
        const rowData = (this.props.isLocked || !this.props.rawData)
          ? [] : _.slice(this.props.rawData, row.index, row.index + 1);
        return (
          <div className='explorer-nested-table' key={key}>
            <ReactTable
              data={(this.props.isLocked || !rowData) ? [] : rowData}
              columns={nestedArrayFieldColumnConfigs[key][0]}
              defaultPageSize={1}
              showPagination={false}
              SubComponent={() => (
                <div className='explorer-nested-table'>
                  <ReactTable
                    data={(this.props.isLocked || !rowData) ? [] : rowData}
                    columns={nestedArrayFieldColumnConfigs[key][1]}
                    defaultPageSize={1}
                    showPagination={false}
                  />
                </div>
              )}
            />
          </div>
        );
      });
    }

    const { totalCount } = this.props;
    const totalCountDisplay = totalCount.toLocaleString();
    const { pageSize } = this.state;
    const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize === 0) ? 0 : 1);
    const SCROLL_SIZE = 10000;
    const visiblePages = Math.min(totalPages, Math.round((SCROLL_SIZE / pageSize) + 0.49));
    const start = (this.state.currentPage * this.state.pageSize) + 1;
    const end = (this.state.currentPage + 1) * this.state.pageSize;
    let explorerTableCaption = `Showing ${start.toLocaleString()} - ${end.toLocaleString()} of ${totalCountDisplay} ${pluralize(this.props.guppyConfig.dataType)}`;
    if (totalCount < end && totalCount < 2) {
      explorerTableCaption = `Showing ${totalCountDisplay} of ${totalCountDisplay} ${pluralize(this.props.guppyConfig.dataType)}`;
    } else if (totalCount < end && totalCount >= 2) {
      explorerTableCaption = `Showing ${start.toLocaleString()} - ${totalCountDisplay} of ${totalCountDisplay} ${pluralize(this.props.guppyConfig.dataType)}`;
    }

    return (
      <div className={`explorer-table ${this.props.className}`} id='guppy-explorer-table-of-records'>
        {(this.props.isLocked) ? <React.Fragment />
          : (
            <div className='explorer-table__description'>
              <span>
                {explorerTableCaption}
              </span>
              <label className={`explorer-table__hide_empty_column_toggle ${this.props.rawData ? '' : 'ant-switch-disabled'}`}>
                Show Empty Columns
                <Switch
                  onChange={this.hideEmptyColumnToggle}
                  disabled={!this.props.rawData}
                />
              </label>
            </div>
          )}

        <ReactTable
          columns={rootColumnsConfig}
          manual
          data={(this.props.isLocked || !this.props.rawData) ? [] : this.props.rawData}
          showPageSizeOptions={!this.props.isLocked}
          pages={(this.props.isLocked) ? 0 : visiblePages} // Total number of pages, don't show 10000+ records in table
          loading={this.state.loading}
          onFetchData={this.fetchData}
          defaultPageSize={this.props.defaultPageSize}
          className={'-striped -highlight '}
          minRows={3} // make room for no data component
          resizable={false}
          NoDataComponent={() => (this.props.isLocked ? (
            <div className='rt-noData'>
              <LockIcon width={30} />
              <p>You only have access to summary data</p>
            </div>
          ) : (
            <div className='rt-noData'>No data to display</div>
          ))}
          SubComponent={(this.props.isLocked) ? null : subComponent}
        />
      </div>
    );
  }
}

ExplorerTable.propTypes = {
  rawData: PropTypes.array, // from GuppyWrapper
  fetchAndUpdateRawData: PropTypes.func.isRequired, // from GuppyWrapper
  totalCount: PropTypes.number.isRequired, // from GuppyWrapper
  isLocked: PropTypes.bool.isRequired,
  className: PropTypes.string,
  defaultPageSize: PropTypes.number,
  tableConfig: TableConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
};

ExplorerTable.defaultProps = {
  rawData: [],
  className: '',
  defaultPageSize: 20,
};

export default ExplorerTable;
