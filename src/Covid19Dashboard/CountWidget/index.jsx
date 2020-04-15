import React from 'react';
import PropTypes from 'prop-types';

import { numberWithCommas } from '../dataUtils.js';

import './CountWidget.less';

class CountWidget extends React.Component {
  render() {
    const val = this.props.value ? this.props.value : '...';
    return (
      <div className='count-widget'>
        <div className='count-widget_label'>
          {this.props.label}
        </div>
        <div className='count-widget_value'>
          {numberWithCommas(val)}
        </div>
      </div>
    );
  }
}

CountWidget.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default CountWidget;
