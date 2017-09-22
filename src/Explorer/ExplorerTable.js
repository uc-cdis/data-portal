import React, { Component, PropTypes } from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { getReduxStore } from '../reduxStore.js';

const passFilter = (filterList, item) => filterList.length === 0 || filterList.includes(item);

class ExplorerTableComponent extends Component {
  static propTypes = {
    filesList: PropTypes.array,
  };

  render() {
    return (
      <div>
        <div>
          <ReactTable
            data={this.props.filesList}
            columns={[
              {
                Header: 'Project',
                accessor: 'project_id',
              },
              {
                Header: 'File Name',
                accessor: 'name',
              },
              {
                Header: 'File Format',
                accessor: 'format',
              },
              {
                Header: 'File Size',
                accessor: 'size',
              },
              {
                Header: 'Category',
                accessor: 'category',
              },
            ]}
            defaultPageSize={25}
            className="-striped -highlight"
          />
          <br />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filesList: state.explorer.filesListFiltered,
});

const mapDispatchToProps = () => ({

});

const ExplorerTable = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableComponent);
export default ExplorerTable;
