import { connect } from 'react-redux';
import { getIndexPageCounts } from '../Index/utils';
import UserRegistration from './UserRegistration';
import { fetchUserAccess } from '../actions';

const mapStateToProps = (state) => ({
  shouldRegister: !(state.user.authz?.['/portal']?.length > 0),
  docsToBeReviewed: state.user?.docs_to_be_reviewed || [],
});

const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {Response[]} responses
   * @returns {'success' | 'error'}
   */
  updateAccess: (user) => {
    if (user.authz['/portal'] !== undefined) {
      dispatch({ type: 'RECEIVE_USER', user });
      dispatch(fetchUserAccess);
      getIndexPageCounts();
      return 'success';
    }
    throw new Error('Failed to update authorization information.');
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);
