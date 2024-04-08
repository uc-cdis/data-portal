import DetermineInitialAtlasColumnManagement from './DetermineInitialAtlasColumnManagement';
import DefaultAtlasColumnManagement from './DefaultAtlasColumnManagement';

const columnsShownThatAreNotManaged = 1;
const InitialDataDictionaryTableState = {
  openDropdowns: [] as number[],
  searchTerm: '',
  sortConfig: {
    sortKey: null,
    direction: 'off',
  },
  currentPage: 1,
  entriesShown: 10,
  columnsShown: Object.keys(DefaultAtlasColumnManagement).length + columnsShownThatAreNotManaged,
  columnManagement: DetermineInitialAtlasColumnManagement(),
};

export default InitialDataDictionaryTableState;
