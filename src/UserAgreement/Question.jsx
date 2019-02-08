import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Question.less';
import Option from './Option';

const makeDefaultState = answer => ({
  answer,
});

/**
 * Little question component - properties: content, onChange, idx, sectionId
 */
class Question extends Component {
  static propTypes = {
    content: PropTypes.shape({
      name: PropTypes.string,
      question: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
      answer: PropTypes.number,
      hint: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    sectionId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = makeDefaultState(null);
    this.resetState = this.resetState.bind(this);
  }

  onAnswerChanged(idx) {
    this.setState({ answer: idx });
    this.props.onChange(idx === this.props.content.answer);
  }

  resetState() {
    this.setState(makeDefaultState());
  }

  render() {
    return (
      <section id={this.props.sectionId} className='question'>
        <h4 className='question__name h4'>
          {
            `${this.props.idx + 1}. ${this.props.content.name}`
              ? this.props.content.name !== '' : ''
          }
        </h4>
        <div className='question__content'>{this.props.content.question}</div>
        {
          this.props.content.options.map(
            (option, i) => (
              <Option
                option={option}
                onChange={idx => this.onAnswerChanged(idx)}
                idx={i}
                isCorrectAnswer={i === this.props.content.answer}
                selected={i === this.state.answer}
                key={`option${i}`}
              />
            ),
          )
        }
      </section>
    );
  }
}

export default Question;
