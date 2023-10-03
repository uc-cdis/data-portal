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
  selectedTeamProject: 'temporary-test-teamproject01', // TODO - remove and leave '' when teamproject selection is ready
};

export default initialState;
