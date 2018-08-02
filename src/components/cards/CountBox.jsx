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
          {Number(this.props.value).toLocaleString()}
        </div>
      </div>
    );
  }
}

CountBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  align: PropTypes.oneOf(['left', 'center']),
};

CountBox.defaultProps = {
  align: 'center',
};

export default CountBox;
