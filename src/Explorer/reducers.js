export const explorer = (state={}, action) => {
  switch (action.type) {
  case 'RECEIVE_FILE_LIST': {
    return {...state, filesList: action.data };
  }
  case 'SELECTED_LIST_CHANGED': {
    console.log(action.data);
    return {...state, selected_filters: action.data };
  }
  default:
    return state;
  }
};
