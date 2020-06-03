import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import pluralize from 'pluralize';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import IconicLink from '../../components/buttons/IconicLink';
import { GuppyConfigType, TableConfigType } from '../configTypeDef';
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
      columnsConfig: [],
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
      const str = d[fieldStringsArray[0]].toString && d[fieldStringsArray[0]].toString();
      const len = str ? str.length : 0;
      maxLetterLen = len > maxLetterLen ? len : maxLetterLen;
    });
    const resWidth = Math.min((maxLetterLen * letterWidth) + spacing, maxWidth);
    return resWidth;
  }

  buildColumnConfig = (field, isNestedTableColumn, isDetailedColumn) => {
    const fieldMappingEntry = this.props.guppyConfig.fieldMapping
    && this.props.guppyConfig.fieldMapping.find(i => i.field === field);
    const overrideName = fieldMappingEntry ? fieldMappingEntry.name : undefined;
    const fieldStringsArray = field.split('.');
    const fieldName = isNestedTableColumn ? capitalizeFirstLetter(fieldStringsArray.slice(1, fieldStringsArray.length).join('.')) : capitalizeFirstLetter(field);

    const columnConfig = {
      Header: overrideName || fieldName,
      id: field,
      maxWidth: 600,
      width: isNestedTableColumn ? '70vw' : this.getWidthForColumn(field, overrideName || fieldName),
      accessor: d => d[fieldStringsArray[0]],
      Cell: (row) => {
        let valueStr = '';
        if (fieldStringsArray.length === 1) {
          valueStr = row.value;
        } else {
          const nestedChildFieldName = fieldStringsArray.slice(1, fieldStringsArray.length).join('.');
          if (_.isArray(row.value)) {
            valueStr = row.value.map(x => _.get(x, nestedChildFieldName)).join(', ');
          } else {
            valueStr = _.get(row.value, nestedChildFieldName);
          }
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
        switch (field) {
        case this.props.guppyConfig.downloadAccessor:
          return (<div><span title={valueStr}><a href={`/files/${valueStr}`}>{valueStr}</a></span></div>);
        case 'file_size':
          return (<div><span title={valueStr}>{humanFileSize(valueStr)}</span></div>);
        case this.props.tableConfig.linkFields.includes(field) && field:
          return valueStr ?
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
            : null;
        default:
          return (<div><span title={valueStr}>{valueStr}</span></div>);
        }
      },
    };
    return columnConfig;
  };

  buildNestedArrayFieldColumnConfigs = (nestedArrayFieldNames) => {
    const nestedArrayFieldColumnConfigs = {};
    Object.keys(nestedArrayFieldNames).forEach((key) => {
      if (!nestedArrayFieldColumnConfigs[key]) {
        nestedArrayFieldColumnConfigs[key] = [];
      }
      const firstLevelColumns = nestedArrayFieldNames[key].map(field =>
        this.buildColumnConfig(`${key}.${field}`, true, false));
      const firstLevelColumnsConfig = [];
      firstLevelColumnsConfig.push({
        Header: key,
        columns: firstLevelColumns,
      });
      const secondLevelColumns = nestedArrayFieldNames[key].map(field =>
        this.buildColumnConfig(`${key}.${field}`, true, true));
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
    const sort = state.sorted.map(i => ({
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

  render() {
    if (!this.props.tableConfig.fields || this.props.tableConfig.fields.length === 0) {
      return null;
    }

    const rootColumnsConfig = this.props.tableConfig.fields.map(field =>
      this.buildColumnConfig(field, false, false));


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
      // eslint-disable-next-line max-len
      nestedArrayFieldColumnConfigs = this.buildNestedArrayFieldColumnConfigs(nestedArrayFieldNames);
      subComponent = () => Object.keys(nestedArrayFieldColumnConfigs).map(key =>
        (<div className='explorer-nested-table' key={key}>
          <ReactTable
            data={(this.props.isLocked || !this.props.rawData) ? [] : this.props.rawData}
            columns={nestedArrayFieldColumnConfigs[key][0]}
            defaultPageSize={3}
            previousText={'<'}
            nextText={'>'}
            SubComponent={() => (
              <div className='explorer-nested-table'>
                <ReactTable
                  data={(this.props.isLocked || !this.props.rawData) ?
                    [] : this.props.rawData}
                  columns={nestedArrayFieldColumnConfigs[key][1]}
                  defaultPageSize={3}
                  previousText={'<'}
                  nextText={'>'}
                />
              </div>
            )}
          />
        </div>),
      );
    }

    const { totalCount } = this.props;
    const { pageSize } = this.state;
    const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize === 0) ? 0 : 1);
    const SCROLL_SIZE = 10000;
    const visiblePages = Math.min(totalPages, Math.round((SCROLL_SIZE / pageSize) + 0.49));
    const start = (this.state.currentPage * this.state.pageSize) + 1;
    const end = (this.state.currentPage + 1) * this.state.pageSize;
    let explorerTableCaption = `Showing ${start} - ${end} of ${totalCount} ${pluralize(this.props.guppyConfig.dataType)}`;
    if (totalCount < end && totalCount < 2) {
      explorerTableCaption = `Showing ${totalCount} of ${totalCount} ${pluralize(this.props.guppyConfig.dataType)}`;
    } else if (totalCount < end && totalCount >= 2) {
      explorerTableCaption = `Showing ${start} - ${totalCount} of ${totalCount} ${pluralize(this.props.guppyConfig.dataType)}`;
    }

    return (
      <div className={`explorer-table ${this.props.className}`}>
        {(this.props.isLocked) ? <React.Fragment />
          : <p className='explorer-table__description'>{explorerTableCaption}</p> }
        <ReactTable
          columns={rootColumnsConfig}
          manual
          data={(this.props.isLocked || !this.props.rawData) ? [] : this.props.rawData}
          showPageSizeOptions={!this.props.isLocked}
          // eslint-disable-next-line max-len
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
