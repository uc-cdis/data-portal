/* eslint-disable import/prefer-default-export */
export const gwasV2Steps = [
  {
    title: 'Select Study Population',
    secondaryTitle: 'Edit Study Population',
  },
  {
    title: 'Select Outcome Phenotype',
    secondaryTitle: 'Edit Outcome Phenotype',
  },
  {
    title: 'Select Covariate Phenotype',
    secondaryTitle: 'Edit Covariate Phenotype',
  },
  {
    title: 'Configure GWAS',
    secondaryTitle: 'Configure GWAS',
  },
];

export const ACTIONS = {
  SET_SELECTED_STUDY_POPULATION_COHORT: 'setSelectedStudyPopulationCohort',
  DECREMENT_CURRENT_STEP: 'decrementCurrentStep',
  INCREMENT_CURRENT_STEP: 'incrementCurrentStep',
  SET_OUTCOME: 'setOutcome',
  ADD_COVARIATE: 'addCovariate',
  DELETE_CONTINUOUS_COVARIATE: 'deleteContinouosCovariate',
  DELETE_DICHOTOMOUS_COVARIATE: 'deleteDichotomousCovariate',
  UPDATE_MAF_THRESHOLD: 'updateMafThreshold',
  UPDATE_IMPUTATION_SCORE: 'updateImputationScore',
  UPDATE_NUM_PCS: 'updateNumPCs',
};

export const initialState = {
  outcome: {},
  selectedStudyPopulationCohort: null,
  covariates: [],
  imputationScore: 0.3,
  mafThreshold: 0.01,
  numOfPC: 3,
  gwasName: '',
  selectedHare: { concept_value: '' },
  currentStep: 0,
};
