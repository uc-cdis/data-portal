const DetermineInitialColumnManagement = () => null;

const InitialDataDictionaryTableState = {
  openDropdowns: [] as number[],
  searchTerm: '',
  sortConfig: {
    sortKey: null,
    direction: 'off',
  },
  currentPage: 1,
  entriesShown: 10,
  columnsShown: 11,
  columnManagement: DetermineInitialColumnManagement(),
};
export default InitialDataDictionaryTableState;
