import { connect } from 'react-redux';
import UserInformation from './UserInformation';
import { receiveUser } from '../actions';
import { fetchUserAccess } from '../actions.thunk';

/** @param {import('redux-thunk').ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {Response} response
   * @returns {Promise<('success' | 'error')>}
   */
  updateInformation: (response) =>
    response.ok
      ? response.json().then((/** @type {import('../types').User} */ user) => {
          dispatch(receiveUser(user));
          dispatch(fetchUserAccess());
          return 'success';
        })
      : Promise.resolve('error'),
});

export default connect(null, mapDispatchToProps)(UserInformation);
