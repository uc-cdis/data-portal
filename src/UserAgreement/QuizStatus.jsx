import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './QuizStatus.less';

/**
 * Little quiz status component - properties: title, questions
 */
class QuizStatus extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  static defaultProps = {
  };

  render() {
    let strQuestions = '';
    let styleCls = 'quiz__status-title';
    if (this.props.questions.length > 0) {
      strQuestions = this.props.questions.reduce((res, item) => (`${res}#${item + 1}, `), strQuestions);
      strQuestions = `Question(s): ${strQuestions.slice(0, -2)}`;
      styleCls = 'quiz__status-title--incorrect';
    } else { strQuestions = 0; }

    return (
      <div className='quiz_status-box'>
        <div className={`${styleCls} introduction`}>{this.props.title}</div>
        <div className={`${styleCls} introduction`}>{strQuestions}</div>
      </div>
    );
  }
}

export default QuizStatus;
