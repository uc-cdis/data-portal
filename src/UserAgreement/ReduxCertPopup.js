import { connect } from 'react-redux';
import CertPopup from './CertPopup';
import { requiredCerts, userAPIPath } from '../configs';
import { fetchWithCreds, refreshUser } from '../actions';
import { minus } from '../utils';
import { certs, hostname, basename } from '../localconf';

/**
 * Redux action triggered by quiz submit
 * @param {*} data
 * @param {*} questionList
 * @param {*} quiz
 * @param {*} history
 */
export const submitForm = (data, questionList, quiz) => (dispatch) => fetchWithCreds({
  path: `${userAPIPath}user/cert/${quiz}?extension=txt`,
  method: 'PUT',
  body: JSON.stringify({
    answers: data, certificate_form: questionList,
  }, null, '\t'),
  dispatch,
  customHeaders: { 'Content-Type': 'application/json' },
})
  .then(
    ({ status }) => {
      const cleanBasename = basename.replace(/^\/+/g, '').replace(/(dev.html$)/, '');
      switch (status) {
      case 201:
        window.location = `${hostname}${cleanBasename}`;
        return dispatch(refreshUser());
      default:
        return dispatch({
          type: 'FETCH_ERROR',
        });
      }
    },
  );

const mapStateToProps = (state) => ({
  certsList: certs,
  pendingCerts: minus(requiredCerts, state.user.certificates_uploaded),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (data, questionList, quiz) => dispatch(
    submitForm(data, questionList, quiz),
  ),
});

const ReduxCertPopup = connect(mapStateToProps, mapDispatchToProps)(CertPopup);
export default ReduxCertPopup;
