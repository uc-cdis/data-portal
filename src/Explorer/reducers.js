const explorer = (state = { filesMap: {},
  pageSize: 20,
  originalPage: 0,
  lastPageSizes: {},
  refetch_data: true,
  pagesPerTab: 5,
  activeTab: '',
  currentPages: {},
}, action) => {
  switch (action.type) {
  case 'RECEIVE_FILE_LIST': {
    return {
      ...state,
      filesMap: action.data.filesMap,
      selected_filters: action.data.selected_filters,
      cursors: action.data.cursors,
      queriedCursors: action.data.queriedCursors,
      lastPageSizes: action.data.lastPageSizes,
      originalPageToReset: [],
      refetch_data: false,
      moreData: 'RECEIVED',
      activeTab: action.data.activeTab,
      currentPages: action.data.currentPages,
    };
  }
  case 'UNSET_RESET_ORIGIN_PAGE' : {
    return {
      ...state,
      originalPageToReset: [],
    };
  }
  case 'SET_ACTIVE_TAB' : {
    return {
      ...state,
      activeTab: action.data.activeTab,
    };
  }
  case 'SET_CURRENT_PAGE': {
    return {
      ...state,
      currentPages: action.data,
    };
  }
  case 'SELECTED_LIST_CHANGED': {
    return {
      ...state,
      selected_filters: action.data,
      cursors: {},
      lastPageSizes: {},
      refetch_data: true,
    };
  }
  case 'REQUEST_NEXT_PART': {
    return {
      ...state,
      cursors: action.data.cursors,
      originalPageToReset: action.data.originalPageToReset,
      moreData: 'REQUESTED',
    };
  }
  case 'RECEIVE_NEXT_PART': {
    return {
      ...state,
      filesMap: action.data.filesMap,
      selected_filters: action.data.selected_filters,
      cursors: action.data.cursors,
      queriedCursors: action.data.queriedCursors,
      lastPageSizes: action.data.lastPageSizes,
      moreData: 'RECEIVED',
    };
  }
  case 'PAGE_SIZE_CHANGED': {
    return {
      ...state,
      pageSize: action.data.pageSize,
      cursors: action.data.cursors,
      moreData: 'REQUESTED',
    };
  }
  default:
    return state;
  }
};

export default explorer;
