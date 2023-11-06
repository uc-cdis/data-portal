const initialState = {
  outcome: null,
  selectedStudyPopulationCohort: null,
  covariates: [],
  imputationScore: 0.3,
  mafThreshold: 0.01,
  numOfPC: 3,
  gwasName: '',
  selectedHare: { concept_value: '' },
  currentStep: 0,
  finalPopulationSizes: [],
  selectionMode: '',
  messages: [],
  selectedTeamProject: localStorage.getItem('teamProject')
};

export default initialState;
