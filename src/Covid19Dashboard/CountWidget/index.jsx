import React from 'react';
import PropTypes from 'prop-types';

import './CountWidget.less';

class CountWidget extends React.Component {
  render() {
    const val = this.props.value ? Number(this.props.value).toLocaleString() : '...';
    return (
      <div className='count-widget'>
        <div className='count-widget_label'>
          {this.props.label}
        </div>
        <div className='count-widget_value'>
          {val}
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
