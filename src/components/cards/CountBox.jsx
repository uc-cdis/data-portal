import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CountBox.less';

class CountBox extends Component {
  render() {
    return (
      <div className={`count-box count-box--align-${this.props.align}`}>
        <div className={`count-box__title--align-${this.props.align} h4-typo`}>
          {this.props.label}
        </div>
        <div className={`count-box__number--align-${this.props.align} special-number`}>
          {this.props.value === this.props.lockValue ? (
            <i className='count-box__lock g3-icon g3-icon--lock' />
          ) : Number(this.props.value).toLocaleString()}
        </div>
      </div>
    );
  }
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
