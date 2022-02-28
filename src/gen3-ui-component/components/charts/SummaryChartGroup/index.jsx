import PropTypes from 'prop-types';
import SummaryPieChart from '../SummaryPieChart';
import SummaryHorizontalBarChart from '../SummaryHorizontalBarChart';
import './SummaryChartGroup.css';
import helper from '../helper.js';

/**
 * @typedef {Object} ChartSummary
 * @property {boolean} [chartIsEmpty]
 * @property {{ name: string; value: number }[]} data
 * @property {boolean} [showPercentage]
 * @property {string} title
 * @property {'bar' | 'pie'} type
 */

/**
 * @param {Object} props
 * @param {string} props.barChartColor
 * @param {string} props.chartEmptyMessage
 * @param {string[]} props.customizedColorMap
 * @param {string} props.lockMessage
 * @param {number} props.lockValue
 * @param {number} props.maximumDisplayItem
 * @param {ChartSummary[]} props.summaries
 * @param {boolean} props.useCustomizedColorMap
 * @param {number | string} props.width
 */
function SummaryChartGroup({
  barChartColor,
  chartEmptyMessage,
  customizedColorMap,
  lockMessage,
  lockValue,
  maximumDisplayItem,
  summaries,
  useCustomizedColorMap,
  width,
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
  barChartColor: PropTypes.string,
  chartEmptyMessage: PropTypes.string,
  customizedColorMap: PropTypes.arrayOf(PropTypes.string),
  lockMessage: PropTypes.string,
  lockValue: PropTypes.number, // if one of the value is equal to `lockValue`, lock the chart
  maximumDisplayItem: PropTypes.number,
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  useCustomizedColorMap: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SummaryChartGroup.defaultProps = {
  barChartColor: 'var(--pcdc-color__primary)',
  chartEmptyMessage: "Cannot render this chart because some fields don't apply",
  customizedColorMap: ['var(--pcdc-color__primary)'],
  lockMessage:
    'This chart is hidden because it contains fewer than 1000 subjects',
  lockValue: -1,
  useCustomizedColorMap: false,
  maximumDisplayItem: 15,
  width: '100%',
};

export default SummaryChartGroup;
