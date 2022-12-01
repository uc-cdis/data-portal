import ACTIONS from './Actions';

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_STUDY_POPULATION_COHORT:
      return { ...state, selectedStudyPopulationCohort: action.payload };
    case ACTIONS.INCREMENT_CURRENT_STEP:
      return { ...state, currentStep: state.currentStep + 1 };
    case ACTIONS.DECREMENT_CURRENT_STEP:
      return { ...state, currentStep: state.currentStep - 1 };
    case ACTIONS.SET_OUTCOME:
      return { ...state, currentStep: 2, outcome: action.payload };
    case ACTIONS.ADD_COVARIATE:
      return { ...state, covariates: [...state.covariates, action.payload] };
    case ACTIONS.DELETE_CONTINUOUS_COVARIATE:
      return {
        ...state,
        covariates: state.covariates.filter(
          (covariate) => covariate.concept_id !== action.payload
        ),
      };
    case ACTIONS.DELETE_DICHOTOMOUS_COVARIATE:
      return {
        ...state,
        covariates: state.covariates.filter(
          (covariate) => covariate.provided_name !== action.payload
        ),
      };
    case ACTIONS.UPDATE_IMPUTATION_SCORE:
      return { ...state, imputationScore: action.payload };
    case ACTIONS.UPDATE_MAF_THRESHOLD:
      return { ...state, mafThreshold: action.payload };
    case ACTIONS.UPDATE_NUM_PCS:
      return { ...state, numPCs: action.payload };
    default:
      throw new Error(`Unknown action passed to reducer: ${action}`);
  }
};

export default reducer;
