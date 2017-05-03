import { userapi_path } from '../../configs';
import browserHistory from '../../history';
import { fetchWrapper, fetchOAuthURL, updatePopup } from '../actions';
import { certificate_form } from './constants';

export const updateForm = ( data ) => {
  return {
    type: 'UPDATE_CERTIFICATE_FORM',
    data: data
  }
}

export const submitForm = ( data ) => {
  return fetchWrapper({
    path: userapi_path + '/user/cert/security_quiz?extension=txt',
    handler: receiveSubmitCert,
    body: JSON.stringify({answers: data, certificate_form:certificate_form}, null, '\t'),
    method: 'PUT'
  })
}

export const receiveSubmitCert = ({status, data}) => {
  switch (status) {
    case 201:
      browserHistory.push('/')
      return {
        type: 'RECEIVE_CERT_SUBMIT'
      }
    default:
      return {
        type: 'FETCH_ERROR'
      }
  }
}
