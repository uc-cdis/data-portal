import React from 'react';
import PropTypes from 'prop-types';
import SummaryPieChart from '../SummaryPieChart';
import SummaryHorizontalBarChart from '../SummaryHorizontalBarChart';
import './SummaryChartGroup.css';
import helper from '../helper.js';

function SummaryChartGroup({
  summaries,
  width,
  barChartColor,
  lockMessage,
  lockValue,
  useCustomizedColorMap,
  customizedColorMap,
  maximumDisplayItem,
  chartEmptyMessage,
}) {
  return (
    <div
      className='summary-chart-group'
      style={{ width: helper.parseParamWidth(width) }}
    >
      {summaries.map((item, index) => (
        <div className='summary-chart-group__column' key={item.title}>
          {index > 0 && (
            <div className='summary-chart-group__column-left-border' />
          )}
          {item.type === 'pie' ? (
            <SummaryPieChart
              data={item.data}
              title={item.title}
              lockValue={lockValue}
              lockMessage={lockMessage}
              useCustomizedColorMap={useCustomizedColorMap}
              customizedColorMap={customizedColorMap}
              maximumDisplayItem={maximumDisplayItem}
              chartIsEmpty={item.chartIsEmpty}
              chartEmptyMessage={chartEmptyMessage}
              showPercentage={item.showPercentage}
            />
          ) : (
            <SummaryHorizontalBarChart
              data={item.data}
              title={item.title}
              vertical
              color={useCustomizedColorMap ? undefined : barChartColor}
              lockValue={lockValue}
              lockMessage={lockMessage}
              useCustomizedColorMap={useCustomizedColorMap}
              customizedColorMap={customizedColorMap}
              maximumDisplayItem={maximumDisplayItem}
              chartIsEmpty={item.chartIsEmpty}
              chartEmptyMessage={chartEmptyMessage}
              showPercentage={item.showPercentage}
            />
          )}
        </div>
      ))}
    </div>
  );
}

SummaryChartGroup.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  barChartColor: PropTypes.string,
  lockValue: PropTypes.number, // if one of the value is equal to `lockValue`, lock the chart
  lockMessage: PropTypes.string,
  useCustomizedColorMap: PropTypes.bool,
  customizedColorMap: PropTypes.arrayOf(PropTypes.string),
  maximumDisplayItem: PropTypes.number,
  chartEmptyMessage: PropTypes.string,
};

SummaryChartGroup.defaultProps = {
  width: '100%',
  barChartColor: 'var(--pcdc-color__primary)',
  lockValue: -1,
  lockMessage:
    'This chart is hidden because it contains fewer than 1000 subjects',
  useCustomizedColorMap: false,
  customizedColorMap: ['var(--pcdc-color__primary)'],
  maximumDisplayItem: 15,
  chartEmptyMessage: "Cannot render this chart because some fields don't apply",
};

export default SummaryChartGroup;
