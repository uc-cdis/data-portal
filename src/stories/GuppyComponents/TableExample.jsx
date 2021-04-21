import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import 'react-table/react-table.css';
import { tableConfig } from './conf';

const defaultPageSize = 20;
class ConnectedTableExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageSize: defaultPageSize,
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
    const columnsConfig = tableConfig.map(c => ({ Header: c.name, accessor: c.field }));
    const { totalCount } = this.props;
    const { pageSize } = this.state;
    const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize === 0) ? 0 : 1);
    return (
      <ReactTable
        columns={columnsConfig}
        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
        data={this.props.rawData || []}
        pages={totalPages} // Display the total number of pages
        loading={this.state.loading} // Display the loading overlay when we need it
        onFetchData={this.fetchData.bind(this)} // Request new data when things change
        defaultPageSize={defaultPageSize}
        className={`-striped -highlight ${this.props.className}`}
        minRows={0}
      />
    );
  }
}

ConnectedTableExample.propTypes = {
  rawData: PropTypes.array,
  className: PropTypes.string,
  fetchAndUpdateRawData: PropTypes.func,
  totalCount: PropTypes.number,
};

export default ConnectedTableExample;
