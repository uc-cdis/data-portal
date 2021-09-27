import React from 'react';
import PropTypes from 'prop-types';
import './CountBox.less';

/**
 * @typedef {Object} CountBoxProps
 * @property {('left' | 'center')} [align]
 * @property {string} label
 * @property {number} [lockValue]
 * @property {number} value
 */

/** @param {CountBoxProps} props */
function CountBox({ align = 'center', label, lockValue = -1, value }) {
  return (
    <div className={`count-box count-box--align-${align}`}>
      <div className={`count-box__title--align-${align} h4-typo`}>{label}</div>
      <div className={`count-box__number--align-${align} special-number`}>
        {value === lockValue ? (
          <i className='count-box__lock g3-icon g3-icon--lock' />
        ) : (
          Number(value).toLocaleString()
        )}
      </div>
    </div>
  );
}

CountBox.propTypes = {
  align: PropTypes.oneOf(['left', 'center']),
  label: PropTypes.string.isRequired,
  lockValue: PropTypes.number,
  value: PropTypes.number.isRequired,
};

export default CountBox;
