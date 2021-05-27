import React from 'react';
import PropTypes from 'prop-types';
import GroupedBarChart from './GroupedBarChart';

const CUSTOM_CHART_TYPE = {
  HORIZONTAL_GROUPED_BAR: 'horizontalGroupedBar',
};

function HomepageCustomCharts(props) {
  if (props.chartType === CUSTOM_CHART_TYPE.HORIZONTAL_GROUPED_BAR) {
    return <GroupedBarChart {...props} />;
  }
  return null;
}

HomepageCustomCharts.propTypes = {
  chartType: PropTypes.oneOf(Object.values(CUSTOM_CHART_TYPE)).isRequired,
};

export default HomepageCustomCharts;
