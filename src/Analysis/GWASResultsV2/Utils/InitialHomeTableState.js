import ColumnManagementDefault from './InitialColumnManagement';

const InitialHomeTableState = {
  nameSearchTerm: '',
  wfNameSearchTerm: '',
  submittedAtSelections: [],
  finishedAtSelections: [],
  jobStatusSelections: [],
  sortInfo: {},
  currentPage: 1,
  columnManagement: ColumnManagementDefault,
};

export default InitialHomeTableState;
