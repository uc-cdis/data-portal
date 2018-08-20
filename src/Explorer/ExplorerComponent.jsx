import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createRefetchContainer } from 'react-relay';
import { computeLastPageSizes } from '../utils';
import { GQLHelper } from '../gqlHelper';
import getReduxStore from '../reduxStore';
import { ReduxExplorerTabPanel, ReduxSideBar } from './ReduxExplorer';
import './ExplorerComponent.less';

const gqlHelper = GQLHelper.getGQLHelper();

class ExplorerComponent extends Component {
  /**
   * Subscribe to Redux updates at mount time
   */
  componentWillMount() {
    getReduxStore().then(
      (store) => {
        store.subscribe(
          () => {
            this.reduxFilterListener(store);
          },
        );
      },
    );
  }

  /**
   * Unsubscribe from Redux updates at unmount time
   */
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  getFirstActiveTab = (filesMap) => {
    let found = false;
    return Object.keys(filesMap).reduce(
      (res, item) => {
        if (!found && filesMap[item].length > 0) {
          found = true;
          return item;
        }
        return res;
      }, '',
    );
  };

  mapDataToFile = filesList => filesList.map(
    file => (
      { project_id: file.project_id,
        did: file.object_id,
        name: file.file_name,
        category: file.data_category,
        format: file.data_format,
        type: file.data_type,
        size: file.file_size,
      }
    ),
  );

  createList = () => {
    const viewer = this.props.viewer || {
      fileData: [],
    };

    const data = GQLHelper.extractFileDataToDict(viewer);
    return Object.keys(data).reduce(
      (d, key) => {
        const result = d;
        result[key] = this.mapDataToFile(data[key]);
        return result;
      }, {},
    );
  };

  /**
   * Listens for filter updates in redux
   */
  reduxFilterListener(store) {
    const explorerState = store.getState().explorer;
    if (!explorerState) {
      return;
    }
    if (explorerState.refetch_data || explorerState.moreData === 'REQUESTED') {
      this.loadMore(explorerState.selected_filters,
        explorerState.pageSize * explorerState.pagesPerTab,
        explorerState.cursors);
    }
  }

  updateFilesMap = () => {
    const receivedFilesMap = this.createList();
    getReduxStore().then(
      (store) => {
        const explorerState = store.getState().explorer;
        const lastPageSize = computeLastPageSizes(receivedFilesMap,
          explorerState.pageSize);
        const viewer = this.props.viewer || {
          fileData: [],
        };
        const queriedCursors = GQLHelper.getDefaultDictionary(viewer, explorerState.cursors || {});
        const currentPages = GQLHelper.getDefaultDictionary(viewer, {});
        const cursors = GQLHelper.updateOffset(viewer, explorerState.cursors || {});
        let selectedFilters = { projects: [], file_types: [], file_formats: [] };
        if (explorerState.refetch_data) {
          const activeTab = this.getFirstActiveTab(receivedFilesMap);
          selectedFilters = explorerState.selected_filters;
          store.dispatch({ type: 'RECEIVE_FILE_LIST',
            data: { filesMap: receivedFilesMap,
              selected_filters: selectedFilters,
              lastPageSizes: lastPageSize,
              cursors,
              queriedCursors,
              activeTab,
              currentPages,
            } });
        } else if (explorerState.moreData === 'REQUESTED') {
          selectedFilters = explorerState.selected_filters;
          store.dispatch({ type: 'RECEIVE_NEXT_PART',
            data: { filesMap: receivedFilesMap,
              selected_filters: selectedFilters,
              lastPageSizes: lastPageSize,
              cursors,
              queriedCursors,
            } });
        }
      },
    );
  };

  /**
   * Fetch data from relay in response to filter change
   * or whatever ...
   *
   * @param {*} selectedFilters
   * @param pageSize
   * @param cursors
   */
  loadMore(selectedFilters, pageSize, cursors) {
    // Increments the number of stories being rendered by pageSize.
    const refetchVariables = GQLHelper.getExplorerVariables(selectedFilters, pageSize, cursors);
    this.props.relay.refetch(refetchVariables, null);
  }

  render() {
    this.updateFilesMap();
    return (
      <div className='explorer-component'>
        <ReduxSideBar />
        <ReduxExplorerTabPanel />
      </div>
    );
  }
}

ExplorerComponent.propTypes = {
  viewer: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
};

const RelayExplorerComponent = createRefetchContainer(
  ExplorerComponent,
  {
    viewer: gqlHelper.explorerPageFragment,
  },
  gqlHelper.explorerRefreshQuery,
);

export default RelayExplorerComponent;
