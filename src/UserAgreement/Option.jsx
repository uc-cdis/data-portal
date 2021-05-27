import React from 'react';
import PropTypes from 'prop-types';
import './Option.less';

function getCharFromA(i) {
  return String.fromCharCode('A'.charCodeAt(0) + i);
}

/**
 * Little question component - properties: option, idx, isCorrectAnswer, onChange, selected
 */
function Option({
  option,
  idx,
  isCorrectAnswer,
  onChange,
  selected,
  hasCorrectAnswers,
}) {
  let frameClassModifier = '';
  let bulletClassModifier = '';
  if (selected) {
    frameClassModifier = isCorrectAnswer
      ? 'option__frame--correct'
      : 'option__frame--incorrect';
    bulletClassModifier = isCorrectAnswer
      ? 'option__bullet--correct'
      : 'option__bullet--incorrect';
  }
  return (
    <div
      className={`option__frame ${frameClassModifier}`}
      role='button'
      onClick={() => onChange(idx)}
      tabIndex={-10}
    >
      {hasCorrectAnswers ? (
        <div
          className={`option__bullet body ${bulletClassModifier}`}
          key={option}
        >
          {getCharFromA(idx)}
        </div>
      ) : null}
      <div className='option__content body'>{option}</div>
    </div>
  );
}

Option.propTypes = {
  option: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  isCorrectAnswer: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  hasCorrectAnswers: PropTypes.bool.isRequired,
};

export default Option;
