import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QuizStatus from './QuizStatus';
import './QuizSummary.less';

/**
 * Little quiz summary component - properties: notDone, wrongs, onSubmit
 */
class QuizSummary extends Component {
  static propTypes = {
    notDone: PropTypes.arrayOf(PropTypes.number).isRequired,
    wrongs: PropTypes.arrayOf(PropTypes.number).isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  render() {
    const finishedAnswer = (this.props.notDone.length + this.props.wrongs.length === 0);
    const btnCls = finishedAnswer ? 'g3-button--primary' : 'g3-button--secondary';
    return (
      <div className='quiz__right'>
        <div className='quiz__right--box'>
          <QuizStatus title='Not Answered Yet:' questions={this.props.notDone} />
          <QuizStatus title='Incorrect:' questions={this.props.wrongs} />
          <button
            className={btnCls}
            disabled={!finishedAnswer}
            onClick={this.props.onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default QuizSummary;
