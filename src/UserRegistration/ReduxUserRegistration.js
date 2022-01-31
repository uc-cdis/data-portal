import { connect } from 'react-redux';
import { getIndexPageCounts } from '../Index/utils';
import UserRegistration from './UserRegistration';
import { fetchUserAccess } from '../actions';

/** @param {{ user: import('../types').UserState }} state */
const mapStateToProps = (state) => ({
  shouldRegister: !(state.user.authz?.['/portal']?.length > 0),
  docsToBeReviewed: state.user?.docs_to_be_reviewed || [],
});

/** @param {import('redux-thunk').ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {import('../types').User} user
   * @return {'success'}
   */
  updateAccess: (user) => {
    if (user.authz['/portal'] !== undefined) {
      dispatch({ type: 'RECEIVE_USER', user });
      dispatch(fetchUserAccess());
      dispatch(getIndexPageCounts());
      return 'success';
    }
    throw new Error('Failed to update authorization information.');
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);
