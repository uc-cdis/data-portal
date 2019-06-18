import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { GuppyConfigType, TableConfigType } from '../configTypeDef';
import { capitalizeFirstLetter } from '../../utils';
import './ExplorerTable.css';
import LockIcon from '../../img/icons/lock.svg';

class ExplorerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageSize: props.defaultPageSize,
      currentPage: 0,
    };
  }

  getWidthForColumn = (field, columnName) => {
    // some magic numbers that work fine for table columns width
    const minWidth = 100;
    const maxWidth = 400;
    const letterWidth = 8;
    const spacing = 20;
    if (!this.props.rawData || this.props.rawData.length === 0) {
      return minWidth;
    }
    let maxLetterLen = columnName.length;
    this.props.rawData.forEach((d) => {
      if (d[field] === null || typeof d[field] === 'undefined') {
        return;
      }
      const str = d[field].toString && d[field].toString();
      const len = str ? str.length : 0;
      maxLetterLen = len > maxLetterLen ? len : maxLetterLen;
    });
    const resWidth = Math.min((maxLetterLen * letterWidth) + spacing, maxWidth);
    return resWidth;
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
    if (!this.props.tableConfig.fields || this.props.tableConfig.fields.length === 0) return null;
    const columnsConfig = this.props.tableConfig.fields.map((field) => {
      const fieldMappingEntry = this.props.guppyConfig.fieldMapping
        && this.props.guppyConfig.fieldMapping.find(i => i.field === field);
      const name = fieldMappingEntry ? fieldMappingEntry.name : capitalizeFirstLetter(field);
      return {
        Header: name,
        accessor: field,
        maxWidth: 400,
        width: this.getWidthForColumn(field, name),
        Cell: row => (this.props.guppyConfig.downloadAccessor === field ?
          <div><span title={row.value}><a href={`/files/${row.value}`}>{row.value}</a></span></div>
          : <div><span title={row.value}>{row.value}</span></div>),
      };
    });
    const { totalCount } = this.props;
    const { pageSize } = this.state;
    const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize === 0) ? 0 : 1);
    const SCROLL_SIZE = 10000;
    const visiblePages = Math.min(totalPages, Math.round((SCROLL_SIZE / pageSize) + 0.49));
    const start = (this.state.currentPage * this.state.pageSize) + 1;
    const end = (this.state.currentPage + 1) * this.state.pageSize;
    return (
      <div className={`explorer-table ${this.props.className}`}>
        {(this.props.isLocked) ? <React.Fragment />
          : <p className='explorer-table__description'>{`Showing ${start} - ${end} of ${totalCount} ${this.props.guppyConfig.dataType}s`}</p> }
        <ReactTable
          columns={columnsConfig}
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
