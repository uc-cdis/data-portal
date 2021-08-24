import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '../../../utils';

/**
 * @typedef {Object} AnchorFilterProps
 * @property {string} anchorField
 * @property {string} anchorValue
 * @property {string} [defaultOptionLabel]
 * @property {string} [defaultOptionValue]
 * @property {(anchor: string) => void} onChange
 * @property {string[]} options
 * @property {string[]} [optionsInUse]
 */

/** @param {AnchorFilterProps} props */
function AnchorFilter({
  anchorField,
  anchorValue,
  defaultOptionLabel = 'Any',
  defaultOptionValue = '',
  onChange,
  options,
  optionsInUse,
}) {
  return (
    <div
      className='g3-filter-section'
      style={{
        borderTop: '1px solid var(--g3-color__silver)',
        borderBottom: 'none',
      }}
    >
      <div
        className='g3-filter-section__header'
        style={{ marginBottom: '0.875rem' }}
      >
        <div
          className='g3-filter-section__title-container'
          role='button'
          tabIndex={0}
          aria-label='Filter: patient ids'
        >
          <span className='g3-filter-section__toggle-icon-container'>
            <FontAwesomeIcon icon='anchor' />
          </span>
          <span
            className={`g3-filter-section__title${
              defaultOptionValue !== anchorValue
                ? ' g3-filter-section__title--active'
                : ''
            }`}
          >
            {capitalizeFirstLetter(anchorField)}
          </span>
        </div>
      </div>
      {[defaultOptionValue, ...options].map((option) => (
        <label key={option} className={`g3-single-select-filter`}>
          <input
            name={anchorField}
            type='radio'
            style={{ margin: '0 14px' }}
            value={option}
            checked={option === anchorValue}
            onChange={() => onChange(option)}
          />
          <span
            className={
              optionsInUse.includes(option)
                ? 'g3-filter-section__title--active'
                : ''
            }
          >
            {option === defaultOptionValue ? defaultOptionLabel : option}
          </span>
        </label>
      ))}
    </div>
  );
}

AnchorFilter.propTypes = {
  anchorField: PropTypes.string.isRequired,
  anchorValue: PropTypes.string.isRequired,
  defaultOptionLabel: PropTypes.string,
  defaultOptionValue: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionsInUse: PropTypes.arrayOf(PropTypes.string),
};

export default AnchorFilter;
