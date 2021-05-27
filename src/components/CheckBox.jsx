import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.less';

function CheckBox({ id, item, onChange, isSelected, isEnabled, disabledText }) {
  return (
    <div className={'checkbox '.concat(!isEnabled ? 'checkbox--disabled' : '')}>
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
  id: PropTypes.string.isRequired,
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEnabled: PropTypes.bool,
  disabledText: PropTypes.string,
};

CheckBox.defaultProps = {
  item: {},
  isEnabled: true,
  disabledText: null,
};

export default CheckBox;
