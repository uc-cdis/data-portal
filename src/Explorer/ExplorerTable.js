import React, {Component, PropTypes} from 'react';
import ReactTable from 'react-table';
import {connect} from 'react-redux';
import {getReduxStore} from '../reduxStore.js';

const passFilter = (filterList, item) => {
  return filterList.length === 0 || filterList.includes(item);
};

class ExplorerTableComponent extends Component{
  constructor(props){
    super(props);
    getReduxStore().then((store) => {store.subscribe(() =>
    {
      const explorerState = store.getState().explorer;
      if (!explorerState || ! explorerState.refetch_needed)
        return;
      const selected_filters = explorerState.selected_filters;
      if (! selected_filters || !explorerState.filesList)
        return;
      let filesList = explorerState.filesList;
      let filteredFilesList = filesList.filter( file => (
        passFilter(selected_filters.projects, file.project_id)
        && passFilter(selected_filters.file_types, file.type)
        && passFilter(selected_filters.file_formats, file.format))
      );
      getReduxStore().then(
        (store) => {
          store.dispatch( { type: 'FILTERED_FILES_CHANGED', data: filteredFilesList } );
        }
      );
    })});
  }
  static propTypes = {
    filesList: PropTypes.array
  };

  render(){
    return(
      <div>
        <div>
          <ReactTable
            data= {this.props.filesList}
            columns={[
              {
                Header: 'Project',
                accessor: 'project_id'
              },
              {
                Header: 'File Name',
                accessor: 'name'
              },
              {
                Header: 'File Format',
                accessor: 'format'
              },
              {
                Header: 'File Size',
                accessor: 'size'
              },
              {
                Header: 'Category',
                accessor: 'category'
              }
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

const mapStateToProps = (state) => {
  return{
    'filesList': state.explorer.filesListFiltered
  }
};

const mapDispatchToProps = () =>{
  return{

  }
};

const ExplorerTable = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableComponent);
export default ExplorerTable;
