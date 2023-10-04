import ACTIONS from '../../Utils/StateManagement/Actions';
import { checkFinalPopulationSizes, MESSAGES } from '../../Utils/constants';

const ShowFinalPopulationSizeMessages = (dispatch, finalPopulationSizes) => {
  if (finalPopulationSizes.length === 1 && checkFinalPopulationSizes(finalPopulationSizes)) {
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: MESSAGES.SMALL_COHORT_CAUTION,
    });
  } else if (finalPopulationSizes.length > 1 && checkFinalPopulationSizes(finalPopulationSizes)) {
    dispatch({
      type: ACTIONS.ADD_MESSAGE,
      payload: MESSAGES.SMALL_CONTROL_OR_CASE_CAUTION,
    });
  }
};
export default ShowFinalPopulationSizeMessages;
