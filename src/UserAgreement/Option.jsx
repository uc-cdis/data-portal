import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './Option.less';

function getCharFromA(i) {
  return String.fromCharCode('A'.charCodeAt(0) + i);
}

/**
 * Little question component - properties: option, idx, isCorrectAnswer, onChange, selected
 */
class Option extends Component {
  static propTypes = {
    option: PropTypes.string.isRequired,
    idx: PropTypes.number.isRequired,
    isCorrectAnswer: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
  };

  render() {
    let frameClassModifier = '';
    let bulletClassModifier = '';
    if (this.props.selected) {
      frameClassModifier = this.props.isCorrectAnswer ? 'option__frame--correct' : 'option__frame--incorrect';
      bulletClassModifier = this.props.isCorrectAnswer ? 'option__bullet--correct' : 'option__bullet--incorrect';
    }
    return (
      <div
        className={`option__frame ${frameClassModifier}`}
        role='button'
        onClick={() => this.props.onChange(this.props.idx)}
        onKeyDown={this.handleKeyDown}
        tabIndex={-10}
      >
        <div
          className={`option__bullet body ${bulletClassModifier}`}
          key={this.props.option}
        >
          {getCharFromA(this.props.idx)}
        </div>
        <div className='option__content body'>{this.props.option}</div>
      </div>
    );
  }
}

export default Option;
