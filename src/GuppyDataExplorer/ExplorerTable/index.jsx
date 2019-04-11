import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class ExplorerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageSize: props.defaultPageSize,
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
      });
    });
  }

  render() {
    console.log(this.props.rawData);
    const columnsConfig = this.props.tableConfig.map(c => ({ Header: c.name, accessor: c.field }));
    const { totalCount } = this.props;
    const { pageSize } = this.state;
    const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize === 0) ? 0 : 1);
    return (

      <ReactTable
        columns={columnsConfig}
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        data={this.props.rawData}
        pages={totalPages} // Display the total number of pages
        loading={this.state.loading} // Display the loading overlay when we need it
        onFetchData={this.fetchData.bind(this)} // Request new data when things change
        defaultPageSize={this.props.defaultPageSize}
        // className={`-striped -highlight `}
        minRows={0} // hide empty rows
      />
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
};

ExplorerTable.defaultProps = {
  className: '',
  defaultPageSize: 20,
};

export default ExplorerTable;
