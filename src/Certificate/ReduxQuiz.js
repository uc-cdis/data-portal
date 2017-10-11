import { connect } from 'react-redux';
import Quiz from './Quiz';
import { userapiPath } from '../configs';
import browserHistory from '../history';
import { fetchWrapper } from '../actions';


/**
 * Redux action triggered by quiz form update
 * @method updateForm
 * @param {*} data 
 */
export const updateForm = data => ({
  type: 'UPDATE_CERTIFICATE_FORM',
  data,
});

export const receiveSubmitCert = ({ status }) => {
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

/**
 * Redux action triggered by quiz submit
 * @param {*} data 
 * @param {*} questionList 
 */
export const submitForm = (data, questionList) => fetchWrapper({
  path: `${userapiPath}/user/cert/security_quiz?extension=txt`,
  handler: receiveSubmitCert,
  body: JSON.stringify({ answers: data, certificate_form: questionList }, null, '\t'),
  method: 'PUT',
});


/**
 * answer is the index of the correct option
 */ 
const questionList = [
  {
    question: 'As a registered user, I can:',
    options: ['Browse public Project', 'upload file'],
    id: 'abc',
    answer: 0,
    hint: 'some information about this question',
  },
  {
    question: 'How can I share data',
    id: 'def',
    options: ['I can not share data', 'I can only share data with BPA memebers'],
    answer: 1,
    hint: 'some information about this question',
  },
];

const title = 'Please complete following questions';


const mapStateToProps = state => ({
  user: state.user,
  certificate: state.certificate,
  questionList,
  title,
});

const mapDispatchToProps = dispatch => ({
  onUpdateForm: data => dispatch(updateForm(data)),
  onSubmitForm: data => dispatch(submitForm(data, questionList)),
});

const ReduxQuiz = connect(mapStateToProps, mapDispatchToProps)(Quiz);
export default ReduxQuiz;
