import React, { Component, PropTypes } from 'react';
import 'react-table/react-table.css';
import Relay, { createRefetchContainer, graphql } from 'react-relay';
import { withAuthTimeout, withBoxAndNav } from '../utils';
import { GQLHelper } from '../gqlHelper.js';
import { getReduxStore } from '../reduxStore.js';
import ExplorerTable from './ExplorerTable';
import SideBar from './ExplorerSideBar';


const gqlHelper = GQLHelper.getGQLHelper();

const passFilter = (filterList, item) => filterList.length === 0 || filterList.includes(item);

class ExplorerComponent extends Component {
  constructor(props) {
    super(props);
  }


  static propTypes = {
    submission: PropTypes.object,
    selected_filters: PropTypes.object,
    viewer: PropTypes.object,
  };
  viewer = {};


  /**
   * Unsubscribe from Redux updates at unmount time
   */
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Listens for filter updates in redux
   */
  _reduxFilterListener(store) {
    const explorerState = store.getState().explorer;
    if (!explorerState) {
      return;
    }
    const selected_filters = explorerState.selected_filters;
    if (! selected_filters || !explorerState.filesList) {
      return;
    }
    if (explorerState.refetch_needed) {
      this._loadMore(selected_filters);
    } else if (explorerState.refiltering_needed) {
      const filesList = explorerState.filesList;
      const filteredFilesList = filesList.filter(file => (
        passFilter(selected_filters.projects, file.project_id)
        && passFilter(selected_filters.file_types, file.type)
        && passFilter(selected_filters.file_formats, file.format)),
      );
      getReduxStore().then(
        (store) => {
          store.dispatch({ type: 'FILTERED_FILES_CHANGED', data: filteredFilesList });
        },
      );
    }
  }

  /**
   * Subscribe to Redux updates at mount time
   */ 
  componentWillMount() {
    getReduxStore().then(
      (store) => {
        store.subscribe(
          () => {
            this._reduxFilterListener(store);
          },
        );
      },
    );
  }

  createList = () => {
    const viewer = this.props.viewer || {
      fileData1: [],
    };

    return GQLHelper.extractFileInfo(viewer).fileData.map(
      file => ({ project_id: file.project_id,
        name: file.file_name,
        category: file.data_category,
        format: file.data_format,
        type: file.data_type,
        size: file.file_size }),
    );
  };

  updateFilesList = () => {
    const filesList = this.createList();
    getReduxStore().then(
      (store) => {
        const explorerState = store.getState().explorer || {};
        if (! explorerState.filesList) {
          store.dispatch({ type: 'RECEIVE_FILE_LIST',
            data: { filesList, selected_filters: { projects: [], file_types: [], file_formats: [] } } });
        } else if (explorerState.refetch_needed) {
          store.dispatch({ type: 'RECEIVE_FILE_LIST',
            data: { filesList, selected_filters: explorerState.selected_filters } });
        }
      },
    );
  };

  /**
   * Fetch data from relay in response to filter change
   * or whatever ...
   * 
   * @param {*} selected_filters 
   */
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
        <SideBar />
        <ExplorerTable />
      </div>
    );
  }
}

export const RelayExplorerComponent = createRefetchContainer(
  withBoxAndNav(withAuthTimeout(ExplorerComponent)),
  {
    viewer: gqlHelper.explorerPageFragment,
  },
  gqlHelper.explorerRefreshQuery,
);
