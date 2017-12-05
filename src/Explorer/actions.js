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

export const loadReceivedData = state => dispatch =>
  dispatch({
    type: 'RECEIVE_FILE_LIST',
    data: state,
  });

export const loadReceivedMoreData = state => dispatch =>
  dispatch({
    type: 'RECEIVE_NEXT_PART',
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
  state[tab] = page;
  return Promise.resolve(dispatch(doChangePage(state)));
};
