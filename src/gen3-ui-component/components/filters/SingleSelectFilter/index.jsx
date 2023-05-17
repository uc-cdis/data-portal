import { useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import './SingleSelectFilter.css';

/**
 * @typedef {Object} SingleSelectFilterProps
 * @property {boolean} [accessible]
 * @property {number} [count]
 * @property {boolean} [disabled]
 * @property {string} [disabledTooltipMessage]
 * @property {number} [hideValue]
 * @property {boolean} [hideZero]
 * @property {string} [label]
 * @property {string} [optionTooltip]
 * @property {string} [lockedTooltipMessage]
 * @property {(label: string) => void} onSelect
 * @property {boolean} [selected]
 */

/** @param {SingleSelectFilterProps} props */
function SingleSelectFilter({
  accessible = true,
  count = 0,
  disabled = false,
  disabledTooltipMessage = '',
  hideValue = -1,
  hideZero = true,
  label,
  optionTooltip,
  lockedTooltipMessage = '',
  onSelect,
  selected,
}) {
  if (count === 0 && hideZero) {
    return null;
  }

  const [localSelected, setLocalSelected] = useState(selected ?? false);

  function handleCheck() {
    setLocalSelected(!localSelected);
    onSelect(label);
  }

  const isChecked = selected ?? localSelected;
  let inputDisabled = disabled;

  /** @type {JSX.Element} */
  let countIconComponent = null;
  if (count === hideValue) {
    // we don't disable selected filters
    inputDisabled = !isChecked;
    countIconComponent = (
      <span className='g3-single-select-filter__icon-background'>
        <i className='g3-icon--lock g3-icon g3-icon--sm g3-icon-color__base-blue' />
      </span>
    );

    if (inputDisabled && disabledTooltipMessage !== '') {
      countIconComponent = (
        <Tooltip
          placement='right'
          overlay={<span>{disabledTooltipMessage}</span>}
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          trigger={['hover', 'focus']}
        >
          {countIconComponent}
        </Tooltip>
      );
    }
  } else if (accessible) {
    countIconComponent = (
      <span className='g3-badge g3-single-select-filter__count'>
        {Number(count).toLocaleString()}
      </span>
    );
  }

  /** @type {JSX.Element} */
  let lockIconComponent = null;
  if (!accessible) {
    lockIconComponent = (
      <i className='g3-icon g3-icon--md g3-icon--lock g3-icon-color__gray' />
    );
    if (lockedTooltipMessage !== '') {
      lockIconComponent = (
        <Tooltip
          placement='right'
          overlay={<span>{lockedTooltipMessage}</span>}
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          trigger={['hover', 'focus']}
        >
          {lockIconComponent}
        </Tooltip>
      );
    }
  }

  return (
    <div className='g3-single-select-filter'>
      <input
        className='g3-single-select-filter__checkbox'
        type='checkbox'
        onChange={handleCheck}
        checked={isChecked}
        disabled={inputDisabled}
      /> 
      <span className='g3-single-select-filter__label'>
        {
          optionTooltip ? 
          <Tooltip
              placement='right'
              overlay={<span>{optionTooltip}</span>}
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
              trigger={['hover', 'focus']}
          >
            <span>{label}</span>
          </Tooltip> :
          label
        }
      </span>
      {count !== null && countIconComponent}
      {lockIconComponent}
    </div>
  );
}

SingleSelectFilter.propTypes = {
  accessible: PropTypes.bool,
  count: PropTypes.number,
  disabled: PropTypes.bool,
  disabledTooltipMessage: PropTypes.string,
  hideValue: PropTypes.number,
  hideZero: PropTypes.bool,
  label: PropTypes.string.isRequired,
  optionTooltip: PropTypes.string,
  lockedTooltipMessage: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default SingleSelectFilter;
