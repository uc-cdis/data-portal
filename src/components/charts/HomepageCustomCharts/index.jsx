import React from 'react';
import PropTypes from 'prop-types';
import StackedBarChart from './StackedBarChart';

const CUSTOM_CHART_TYPE = {
  HORIZONTAL_STACKED_BAR: 'horizontalStackedBar',
};

class HomepageCustomCharts extends React.Component {
  render() {
    if (this.props.chartType === CUSTOM_CHART_TYPE.HORIZONTAL_STACKED_BAR) {
      return (<StackedBarChart {...this.props} />);
    }
    return null;
  }
}

HomepageCustomCharts.propTypes = {
  chartType: PropTypes.oneOf(Object.values(CUSTOM_CHART_TYPE)).isRequired,
};

export default HomepageCustomCharts;
