import React, {Component, PropTypes} from 'react';
import 'react-table/react-table.css';
import Relay, {createRefetchContainer, graphql} from 'react-relay';
import { withAuthTimeout, withBoxAndNav} from '../utils';
import {getReduxStore} from '../reduxStore.js';
import ExplorerTable from "./ExplorerTable";
import SideBar from "./ExplorerSideBar";

const mapFile = (listFile) => {
  return listFile.map( function(file) {
    return { project_id: file.project_id, name: file.file_name,
      category: file.data_category, format: file.data_format,
      type: file.data_type, size: file.file_size };
  });
};

class ExplorerComponent extends Component {
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
      if (explorerState.refetch_needed)
        this._loadMore(selected_filters);
    })});
  }

  static propTypes = {
    submission: PropTypes.object,
    selected_filters: PropTypes.object,
    viewer: PropTypes.object
  };
  viewer = {};

  createList = () => {
    const viewer = this.props.viewer || {
      submitted_aligned_reads: [],
      submitted_unaligned_reads: [],
      submitted_somatic_mutation: [],
      submitted_methylation: [],
      submitted_copy_number: []
    };

    const files1 = mapFile(viewer.submitted_aligned_reads);
    const files2 = mapFile(viewer.submitted_unaligned_reads);
    const files3 = mapFile(viewer.submitted_somatic_mutation);
    const files4 = mapFile(viewer.submitted_methylation);
    const files5 = mapFile(viewer.submitted_copy_number);
    return [...files1, ...files2, ...files3, ...files4, ...files5 ];
  };

  updateFilesList = () => {
    let filesList = this.createList();
    getReduxStore().then(
      (store) => {
        const explorerState = store.getState().explorer || {};
        if ( ! explorerState.filesList ) {
          store.dispatch( { type: 'RECEIVE_FILE_LIST',
            data: {filesList: filesList, selected_filters: {projects: [], file_types: [], file_formats: []}} } );
        }
        else if (explorerState.refetch_needed) {
          store.dispatch( { type: 'RECEIVE_FILE_LIST',
            data: {filesList: filesList, selected_filters: explorerState.selected_filters}} );
        }
      }
    );
  };

  _loadMore(selected_filters) {
    // Increments the number of stories being rendered by 10.
    const refetchVariables = {
      selected_projects: selected_filters.projects,
      selected_file_formats: selected_filters.file_formats,
      selected_file_types: selected_filters.file_types,
    };
    this.props.relay.refetch(refetchVariables, null);
  }

  render() {
    this.updateFilesList();
    return (
      <div>
        <SideBar/>
        <ExplorerTable />
      </div>
    );
  }
}

export const RelayExplorerComponent = createRefetchContainer(
  withBoxAndNav(withAuthTimeout(ExplorerComponent)),
  {
    viewer: graphql.experimental`
      fragment component_viewer on viewer
      @argumentDefinitions(
          selected_projects: {type: "[String]"},
          selected_file_types: {type: "[String]"},
          selected_file_formats: {type: "[String]"}
      )
      {
        submitted_aligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
          project_id
          file_name
          data_category
          data_format
          data_type
          file_size
        }
        submitted_unaligned_reads(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
          project_id
          file_name
          data_category
          data_format
          data_type
          file_size
        }
        submitted_somatic_mutation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
          project_id
          file_name
          data_category
          data_format
          data_type
          file_size
        }
        submitted_methylation(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
          project_id
          file_name
          data_category
          data_format
          data_type
          file_size
        }
        submitted_copy_number(first: 10000, project_id: $selected_projects, data_type: $selected_file_types, data_format: $selected_file_formats) {
          project_id
          file_name
          data_category
          data_format
          data_type
          file_size
        }
      }
    `
  },
  graphql.experimental`
    query componentRefetchQuery(
      $selected_projects: [String],
      $selected_file_types: [String],
      $selected_file_formats: [String]
    )
    {
      viewer {
        ...component_viewer @arguments(selected_projects: $selected_projects,
            selected_file_types: $selected_file_types,
            selected_file_formats: $selected_file_formats
        )
      }
    }
  `
);
