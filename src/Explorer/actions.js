export const setActiveTab = (state) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_TAB',
    data: state,
  });
};

export const requestMoreData = (state) => (dispatch) => {
  dispatch({
    type: 'REQUEST_NEXT_PART',
    data: state,
  });
};

export const changePageSize = (state) => (dispatch) => {
  dispatch({
    type: 'PAGE_SIZE_CHANGED',
    data: state,
  });
};

export const changePage = (state) => (dispatch) => {
  dispatch({
    type: 'SET_CURRENT_PAGE',
    data: state,
  });
};

export const changeSelectedList = (state) => (dispatch) => {
  dispatch({
    type: 'SELECTED_LIST_CHANGED',
    data: state,
  });
};

export const loadReceivedData = (state) => (dispatch) => {
  dispatch({
    type: 'RECEIVE_FILE_LIST',
    data: state
  });
};

export const loadReceivedMoreData = (state) => (dispatch) => {
  dispatch({
    type: 'RECEIVE_NEXT_PART',
    data: state
  });
};
