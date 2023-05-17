const UpdateColumnManagement = (homeTableState) => {
  if (homeTableState.useLocalStorage) {
    localStorage.setItem(
      'columnManagement',
      JSON.stringify(homeTableState.columnManagement)
    );
  }
};

export default UpdateColumnManagement;
