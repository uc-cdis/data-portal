import React from 'react';
import PropTypes from 'prop-types';
import Button from '../gen3-ui-component/components/Button';
import QuizStatus from './QuizStatus';
import './QuizSummary.less';

/**
 * Little quiz summary component - properties: notDone, wrongs, onSubmit
 */
function QuizSummary({ notDone, wrongs, onSubmit }) {
  const finishedAnswer = notDone.length + wrongs.length === 0;
  return (
    <div className='quiz__right'>
      <div className='quiz__right--box'>
        <QuizStatus title='Not Answered Yet:' questions={notDone} />
        <QuizStatus title='Incorrect:' questions={wrongs} />
        <Button label='Submit' enabled={finishedAnswer} onClick={onSubmit} />
      </div>
    </div>
  );
}

QuizSummary.propTypes = {
  notDone: PropTypes.arrayOf(PropTypes.number).isRequired,
  wrongs: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default QuizSummary;
