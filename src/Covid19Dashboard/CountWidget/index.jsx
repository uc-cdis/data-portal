import React from 'react';
import PropTypes from 'prop-types';

import './CountWidget.less';

const numberWithCommas = x => {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
}

class CountWidget extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const val = this.props.value ? this.props.value : '...'
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
  rawData: PropTypes.array, // inherited from GuppyWrapper
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

CountWidget.defaultProps = {
  rawData: [],
};

export default CountWidget;
