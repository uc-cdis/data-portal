import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { GuppyConfigType } from '../configTypeDef';
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

  fetchData(state, instance) {
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
    }).then((res) => {
      this.setState({
        loading: false,
        pageSize: size,
        currentPage: state.page,
      });
    });
  }

  render() {
    const columnsConfig = this.props.tableConfig.map(c => ({
      Header: c.name,
      accessor: c.field,
      maxWidth: 200,
      minWidth: 50,
    }));
    const { totalCount } = this.props;
    const { pageSize } = this.state;
    const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize === 0) ? 0 : 1);
    const start = this.state.currentPage * this.state.pageSize + 1;
    const end = (this.state.currentPage + 1) * this.state.pageSize;
    return (
      <div className='explorer-table'>
        <p className='explorer-table__description'>{`Showing ${start} - ${end} of ${totalCount} cases`}</p>
        <ReactTable
          columns={columnsConfig}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={this.props.rawData}
          pages={totalPages} // Display the total number of pages
          loading={this.state.loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData.bind(this)} // Request new data when things change
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
  rawData: PropTypes.array.isRequired,
  className: PropTypes.string,
  fetchAndUpdateRawData: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  defaultPageSize: PropTypes.number,
  tableConfig: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  guppyConfig: GuppyConfigType,
};

ExplorerTable.defaultProps = {
  className: '',
  defaultPageSize: 20,
};

export default ExplorerTable;
