import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import Quiz from './Quiz';

describe('the User Agreement component', () => {
  const quiz = {
    title: 'BloodPAC User agreement',
    questions: [
      {
        name: 'The first question',
        question: 'As a registered user, I can do the following things without any problem. Is it true or not:',
        options: [
          'Browse public Project',
          'Upload file',
          'Download file',
          'Invite people',
        ],
        answer: 0,
        hint: 'some information about this question',
      },
      {
        name: 'The second question',
        question: 'In order to be a register user, I must do the following things otherwise:',
        options: [
          'Agree the user agreement',
          'accept a consent',
          'None of them',
          'Both of them',
        ],
        answer: 2,
        hint: 'some information about this question',
      },
      {
        name: 'The third question',
        question: 'How can I share data with other people according to the policy of the commons',
        options: [
          'I can not share data',
          'I can only share data with BPA memebers',
          'I can share data with family',
          'I can share data with my wife',
        ],
        answer: 1,
        hint: 'some information about this question',
      },
    ],
  };

  const noop = () => {};

  it('lists question quiz', () => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/quiz' }} context={{}}>
        <Quiz title={quiz.title} questionList={quiz.questions} onSubmit={noop} />
      </StaticRouter>,
    );
    const optionLength = quiz.questions.reduce(
      (res, item) => (res + item.options.length), 0,
    );
    expect($vdom.find('.quiz__content')).toHaveLength(1);
    expect($vdom.find('.question__content')).toHaveLength(quiz.questions.length);
    expect($vdom.find('.question__name.h4')).toHaveLength(quiz.questions.length);
    expect($vdom.find('.option__bullet')).toHaveLength(optionLength);
    expect($vdom.find('.quiz__menu-bullet')).toHaveLength(quiz.questions.length);
    expect($vdom.find('.quiz__menu-bullet--active')).toHaveLength(1);
  });
});
