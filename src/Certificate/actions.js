import { userapiPath } from '../configs';
import browserHistory from '../history';
import { fetchWrapper, fetchOAuthURL, updatePopup } from '../actions';
import { certificate_form } from './constants';

export const updateForm = data => ({
  type: 'UPDATE_CERTIFICATE_FORM',
  data,
});

export const submitForm = data => fetchWrapper({
  path: `${userapiPath}/user/cert/security_quiz?extension=txt`,
  handler: receiveSubmitCert,
  body: JSON.stringify({ answers: data, certificate_form }, null, '\t'),
  method: 'PUT',
});

export const receiveSubmitCert = ({ status, data }) => {
  switch (status) {
  case 201:
    browserHistory.push('/');
    return {
      type: 'RECEIVE_CERT_SUBMIT',
    };
  default:
    return {
      type: 'FETCH_ERROR',
    };
  }
};
