import React from 'react';
import PropTypes from 'prop-types';
import './CountBox.less';

function CountBox({ label, value, align, lockValue }) {
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
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  align: PropTypes.oneOf(['left', 'center']),
  lockValue: PropTypes.number,
};

CountBox.defaultProps = {
  align: 'center',
  lockValue: -1,
};

export default CountBox;
