import React from 'react';
import { storiesOf } from '@storybook/react';
import Quiz from '../UserAgreement/Quiz';

/**
 * Redux action triggered by quiz form update
 * @method updateForm
 * @param {*} data
 */
export const updateForm = data => ({
  type: 'UPDATE_CERTIFICATE_FORM',
  data,
});

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

const questionList = [
  {
    name: 'The first question',
    question: 'As a registered user, I can do the following things without any problem. Is it true or not:',
    options: ['Browse public Project', 'upload file', 'download file', 'invite people'],
    answer: 0,
    hint: 'some information about this question',
  },
  {
    name: 'The second question',
    question: 'In order to be a register user, I must do the following things otherwise:',
    options: ['Agree the user agreement', 'accept a consent', 'None of them', 'Both of them'],
    answer: 2,
    hint: 'some information about this question',
  },
  {
    name: 'The third question',
    question: 'How can I share data with other people according to the policy of the commons',
    options: ['I can not share data', 'I can only share data with BPA memebers', 'I can share data with family', 'I can share data with my wife'],
    answer: 1,
    hint: 'some information about this question',
  },
];

const title = 'Please complete following questions';


storiesOf('User agreement', module)
  .add('User agreement', () => (
    <Quiz
      questionList={questionList}
      title={title}
      user={{ username: 'test', certificates_uploaded: [] }}
      certificate={{ certificate_result: [] }}
      onSubmit={() => {}}
    />
  ));
