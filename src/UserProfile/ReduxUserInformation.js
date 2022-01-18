import { connect } from 'react-redux';
import UserInformation from './UserInformation';
import { fetchUserAccess } from '../actions';

/** @param {import('redux-thunk').ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {Response} response
   * @returns {Promise<('success' | 'error')>}
   */
  updateInformation: (response) =>
    response.ok
      ? response.json().then((/** @type {import('../types').User} */ user) => {
          dispatch({ type: 'RECEIVE_USER', user });
          dispatch(fetchUserAccess());
          return 'success';
        })
      : Promise.resolve('error'),
});

export default connect(null, mapDispatchToProps)(UserInformation);
