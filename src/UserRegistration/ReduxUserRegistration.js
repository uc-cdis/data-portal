import { connect } from 'react-redux';
import UserRegistration from './UserRegistration';

const mapStateToProps = (state) => ({
  shouldRegister: Object.keys(state.user.authz).length === 0,
});

const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {Response} response
   * @returns {Promise<('success' | 'error')>}
   */
  updateAccess: (response) =>
    response.ok
      ? response.json().then((user) => {
          if (user.authz.hasOwnProperty('/portal')) {
            dispatch({ type: 'RECEIVE_USER', user });
            return 'success';
          } else {
            return 'error';
          }
        })
      : Promise.resolve('error'),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistration);
