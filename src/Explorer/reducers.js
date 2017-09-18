export const explorer = (state={}, action) => {
  switch (action.type) {
  case 'RECEIVE_FILE_LIST': {
    return {...state,
      filesList: action.data.filesList,
      filesListFiltered: action.data.filesList,
      selected_filters: action.data.selected_filters,
      refetch_needed: false };
  }
  case 'FILTERED_FILES_CHANGED': {
    return {...state, filesListFiltered: action.data, refetch_needed: false };
  }
  case 'SELECTED_LIST_CHANGED': {
    console.log("Selected changed");
    console.log(action.data);
    return {...state, selected_filters: action.data, refetch_needed: true };
  }
  default:
    return state;
  }
};
