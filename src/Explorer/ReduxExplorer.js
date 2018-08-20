import { connect } from 'react-redux';

import ExplorerSideBar from './ExplorerSideBar';
import ExplorerTabPanel from './ExplorerTabPanel';

export const setActiveTab = state => dispatch =>
  dispatch({
    type: 'SET_ACTIVE_TAB',
    data: state,
  });

export const doRequestMoreData = state => dispatch =>
  dispatch({
    type: 'REQUEST_NEXT_PART',
    data: state,
  });

export const doChangePageSize = state => dispatch =>
  dispatch({
    type: 'PAGE_SIZE_CHANGED',
    data: state,
  });

export const doChangePage = state => dispatch =>
  dispatch({
    type: 'SET_CURRENT_PAGE',
    data: state,
  });

export const changeSelectedList = state => dispatch =>
  dispatch({
    type: 'SELECTED_LIST_CHANGED',
    data: state,
  });

const updateCursors = (key, newValue, pageSize, pagesPerTab,
  cursors, queriedCursors) => {
  const numberOfItemPages = pageSize * pagesPerTab;
  return Object.keys(cursors).reduce(
    (d, it) => {
      const result = d;
      if (it !== key) {
        result[it] = queriedCursors ? queriedCursors[it] : 0;
      } else if (newValue < 0) {
        const tempRes = cursors[it] + (2 * newValue) +
          (((2 * numberOfItemPages) - cursors[it]) % numberOfItemPages);
        result[it] = (tempRes >= 0) ? tempRes : 0;
      } else {
        result[it] = cursors[it];
      }
      return result;
    }, {},
  );
};

export const requestMoreData = (key, newCursor, state) => (dispatch) => {
  const newCursors = updateCursors(key,
    newCursor, state.pageSize,
    state.pagesPerTab,
    state.cursors, state.queriedCursors);
  return dispatch(doRequestMoreData({ cursors: newCursors, originalPageToReset: [key] }));
};

export const changePageSize = (newPageSize, state) => (dispatch) => {
  const newCursors = updateCursors('', 0, state.oldPageSize,
    state.pagesPerTab,
    state.cursors, state.queriedCursors);
  return Promise.resolve(dispatch(doChangePageSize({
    cursors: newCursors,
    pageSize: parseInt(newPageSize, 10),
  })));
};

export const changePage = (tab, page, state) => (dispatch) => {
  const newState = state;
  newState[tab] = page;
  return Promise.resolve(dispatch(doChangePage(newState)));
};

export const ReduxExplorerTabPanel = (() => {
  const mapStateToProps = state => ({
    filesMap: state.explorer.filesMap,
    lastPageSizes: state.explorer.lastPageSizes,
    pageSize: state.explorer.pageSize,
    pagesPerTab: state.explorer.pagesPerTab,
    activeTab: state.explorer.activeTab,
    cursors: state.explorer.cursors,
    queriedCursors: state.explorer.queriedCursors,
    currentPages: state.explorer.currentPages,
    user: state.user,
    projectAvail: state.submission.projectAvail,
  });

  const mapDispatchToProps = dispatch => ({
    onTabChange: state => dispatch(setActiveTab(state)),
    onPageLoadMore: (key, newCursor, state) => dispatch(requestMoreData(key, newCursor, state)),
    onPageSizeChange: (newPageSize, state) => dispatch(changePageSize(newPageSize, state)),
    onPageChange: (tab, page, state) => dispatch(changePage(tab, page, state)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(ExplorerTabPanel);
})();


export const ReduxSideBar = (() => {
  const mapStateToProps = state => ({
    projects: state.submission.projects,
    dictionary: state.submission.dictionary,
    selectedFilters: state.explorer.selected_filters || {
      projects: [],
      file_types: [],
      file_formats: [],
    },
  });

  const mapDispatchToProps = dispatch => ({
    onChange: state => dispatch(changeSelectedList(state)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(ExplorerSideBar);
})();
