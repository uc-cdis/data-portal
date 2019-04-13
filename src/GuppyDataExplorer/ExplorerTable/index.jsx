import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { GuppyConfigType, TableConfigType } from '../configTypeDef';
import './ExplorerTable.css';

class ExplorerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageSize: props.defaultPageSize,
      currentPage: 0,
    };
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
    const columnsConfig = this.props.tableConfig.fields.map((field) => {
      const fieldMappingEntry = this.props.guppyConfig.fieldMapping.find(i => i.field === field);
      if (!fieldMappingEntry) {
        throw new Error('error parsing filter configuration');
      }
      const name = fieldMappingEntry.name;
      return {
        Header: name,
        accessor: field,
        maxWidth: 200,
        minWidth: 50,
      };
    });
    const { totalCount } = this.props;
    const { pageSize } = this.state;
    const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize === 0) ? 0 : 1);
    const start = (this.state.currentPage * this.state.pageSize) + 1;
    const end = (this.state.currentPage + 1) * this.state.pageSize;
    return (
      <div className={`explorer-table ${this.props.className}`}>
        <p className='explorer-table__description'>{`Showing ${start} - ${end} of ${totalCount} cases`}</p>
        <ReactTable
          columns={columnsConfig}
          manual
          data={this.props.rawData}
          pages={totalPages} // Total number of pages
          loading={this.state.loading}
          onFetchData={this.fetchData}
          defaultPageSize={this.props.defaultPageSize}
          className={'-striped -highlight '}
          minRows={0} // hide empty rows
          resizable={false}
        />
      </div>
    );
  }
}

ExplorerTable.propTypes = {
  rawData: PropTypes.array.isRequired, // from GuppyWrapper
  fetchAndUpdateRawData: PropTypes.func.isRequired, // from GuppyWrapper
  totalCount: PropTypes.number.isRequired, // from GuppyWrapper
  className: PropTypes.string,
  defaultPageSize: PropTypes.number,
  tableConfig: TableConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
};

ExplorerTable.defaultProps = {
  className: '',
  defaultPageSize: 20,
};

export default ExplorerTable;
