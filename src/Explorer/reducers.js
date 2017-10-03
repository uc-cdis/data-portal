export const explorer = (state = { filesMap: {},
  pageSize: 20,
  originalPage: 0,
  lastPageSizes: {},
  refetch_data: true,
  pagesPerTab: 5 }, action) => {
  switch (action.type) {
  case 'RECEIVE_FILE_LIST': {
    return {
      ...state,
      filesMap: action.data.filesMap,
      selected_filters: action.data.selected_filters,
      cursors: action.data.cursors,
      lastPageSizes: action.data.lastPageSizes,
      resetCurrentPage: true,
      originalPageToReset: [],
      resetActiveTab: true,
      refetch_data: false,
    };
  }

  case 'UNSET_RESET_CURRENT_PAGE' : {
    return {
      ...state,
      resetCurrentPage: false,
    };
  }
  case 'UNSET_RESET_ORIGIN_PAGE' : {
    return {
      ...state,
      originalPageToReset: [],
    };
  }
  case 'UNSET_RESET_ACTIVE_TAB' : {
    return {
      ...state,
      resetActiveTab: false,
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
      more_data: 'REQUESTED',
    };
  }
  case 'RECEIVE_NEXT_PART': {
    return {
      ...state,
      filesMap: action.data.filesMap,
      selected_filters: action.data.selected_filters,
      cursors: action.data.cursors,
      lastPageSizes: action.data.lastPageSizes,
      more_data: 'RECEIVED',
    };
  }
  case 'FILTERING_LIST_CHANGED': {
    return {
      ...state,
      selected_filters: action.data,
      refetch_data: false,
      refiltering_needed: true,
    };
  }
  case 'PAGE_SIZE_CHANGED': {
    return {
      ...state,
      pageSize: action.data.pageSize,
      lastPageSizes: action.data.lastPageSizes,
    };
  }
  default:
    return state;
  }
};
