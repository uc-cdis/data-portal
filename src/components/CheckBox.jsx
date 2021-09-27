import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.less';

/**
 * @typedef {Object} CheckBoxProps
 * @property {?string} [disabledText]
 * @property {string} id
 * @property {boolean} [isEnabled]
 * @property {boolean} isSelected
 * @property {Object} [item]
 * @property {(id: string) => void} onChange
 */

/** @param {CheckBoxProps} props */
function CheckBox({
  disabledText = null,
  id,
  isEnabled = true,
  isSelected,
  item = {},
  onChange,
}) {
  return (
    <div className={'checkbox '.concat(isEnabled ? '' : 'checkbox--disabled')}>
      <input
        type='checkbox'
        id={id}
        value={item}
        checked={isSelected}
        onChange={() => onChange(id)}
        title={isEnabled ? null : disabledText}
      />
    </div>
  );
}

CheckBox.propTypes = {
  disabledText: PropTypes.string,
  id: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default CheckBox;
