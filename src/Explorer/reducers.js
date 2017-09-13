export const explorer = (state={}, action) => {
  switch (action.type) {
  case 'RECEIVE_FILE_LIST': {
    return {...state, filesList: action.data, refetched: true };
  }
  case 'SELECTED_LIST_CHANGED': {
    return {...state, selected_filters: action.data, refetched: false };
  }
  default:
    return state;
  }
};
