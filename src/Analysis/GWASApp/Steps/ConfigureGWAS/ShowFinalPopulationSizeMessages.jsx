import ACTIONS from '../../Utils/StateManagement/Actions';
import { minimumRecommendedCohortSize, MESSAGES } from '../../Utils/constants';

const ShowFinalPopulationSizeMessages = (dispatch, finalPopulationSizes) => {
  const checkFinalPopulationSizes = () => {
    let hasSizeIssue = false;
    finalPopulationSizes.forEach((obj) => {
      if (obj?.size < minimumRecommendedCohortSize) {
        hasSizeIssue = true;
      }
    });
    return hasSizeIssue;
  };

  if (finalPopulationSizes.length === 1 && checkFinalPopulationSizes()) {
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: MESSAGES.SMALL_COHORT_CAUTION,
    });
  } else if (finalPopulationSizes.length > 1 && checkFinalPopulationSizes()) {
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: MESSAGES.SMALL_CONTROL_OR_CASE_CAUTION,
    });
  }
};
export default ShowFinalPopulationSizeMessages;
