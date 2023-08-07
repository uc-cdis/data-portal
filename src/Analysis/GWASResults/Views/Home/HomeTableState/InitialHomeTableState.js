import localStorageAvailable from './localStorageAvailable';
import DetermineInitialColumnManagement from './DetermineInitialColumnManagement';

const InitialHomeTableState = {
  nameSearchTerm: '',
  wfNameSearchTerm: '',
  submittedAtSelections: [],
  finishedAtSelections: [],
  jobStatusSelections: [],
  sortInfo: {},
  currentPage: 1,
  columnManagement: DetermineInitialColumnManagement(),
  useLocalStorage: localStorageAvailable(),
};

export default InitialHomeTableState;
