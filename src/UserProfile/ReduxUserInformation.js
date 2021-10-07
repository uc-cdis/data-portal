import { connect } from 'react-redux';
import UserInformation from './UserInformation';
import { fetchUserAccess } from '../actions';

const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {Response} response
   * @returns {Promise<('success' | 'error')>}
   */
  updateInformation: (response) =>
    response.ok
      ? response.json().then((user) => {
          dispatch({ type: 'RECEIVE_USER', user });
          dispatch(fetchUserAccess());
          return 'success';
        })
      : Promise.resolve('error'),
});

export default connect(null, mapDispatchToProps)(UserInformation);
