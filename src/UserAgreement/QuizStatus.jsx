import React from 'react';
import PropTypes from 'prop-types';
import './QuizStatus.less';

/**
 * Little quiz status component - properties: title, questions
 */
function QuizStatus({ title, questions }) {
  let strQuestions = '';
  let styleCls = 'quiz__status-title';
  if (questions.length > 0) {
    strQuestions = questions.reduce(
      (res, item) => `${res}#${item + 1}, `,
      strQuestions
    );
    strQuestions = `Question(s): ${strQuestions.slice(0, -2)}`;
    styleCls = 'quiz__status-title--incorrect';
  } else {
    strQuestions = 0;
  }

  return (
    <div className='quiz_status-box'>
      <div className={`${styleCls} introduction`}>{title}</div>
      <div className={`${styleCls} introduction`}>{strQuestions}</div>
    </div>
  );
}

QuizStatus.propTypes = {
  title: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default QuizStatus;
