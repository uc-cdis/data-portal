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
