import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
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
    return (
      <div className='quiz__right'>
        <div className='quiz__right--box'>
          <QuizStatus title='Not Answered Yet:' questions={this.props.notDone} />
          <QuizStatus title='Incorrect:' questions={this.props.wrongs} />
          <Button
            label='Submit'
            enabled={finishedAnswer}
            onClick={this.props.onSubmit}
          />
        </div>
      </div>
    );
  }
}

export default QuizSummary;
