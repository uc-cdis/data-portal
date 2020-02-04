import React from 'react';
import PropTypes from 'prop-types';
import GroupedBarChart from './GroupedBarChart';

const CUSTOM_CHART_TYPE = {
  HORIZONTAL_GROUPED_BAR: 'horizontalGroupedBar',
};

class HomepageCustomCharts extends React.Component {
  render() {
    if (this.props.chartType === CUSTOM_CHART_TYPE.HORIZONTAL_GROUPED_BAR) {
      return (<GroupedBarChart {...this.props} />);
    }
    return null;
  }
}

HomepageCustomCharts.propTypes = {
  chartType: PropTypes.oneOf(Object.values(CUSTOM_CHART_TYPE)).isRequired,
};

export default HomepageCustomCharts;
