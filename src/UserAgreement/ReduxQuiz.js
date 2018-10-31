import { connect } from 'react-redux';
import Quiz from './Quiz';
import { userapiPath } from '../configs';
import { fetchWrapper } from '../actions';
import { components } from '../params';


export const receiveSubmitCert = ({ status }, history) => {
  switch (status) {
  case 201:
    history.push('/');
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
 * @param {*} history
 */
export const submitForm = (data, questionList, history) => fetchWrapper({
  path: `${userapiPath}/user/cert/security_quiz?extension=txt`,
  handler: (result) => { receiveSubmitCert(result, history); },
  body: JSON.stringify({ answers: data, certificate_form: questionList }, null, '\t'),
  method: 'PUT',
});

const mapStateToProps = () => ({
  questionList: components.quiz.questions,
  title: components.quiz.title,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (data, questionList) => dispatch(submitForm(data, questionList, ownProps.history)),
});

const ReduxQuiz = connect(mapStateToProps, mapDispatchToProps)(Quiz);
export default ReduxQuiz;
