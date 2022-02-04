import { Fragment, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import PropTypes from 'prop-types';
import LockedContent from '../LockedContent';
import EmptyContent from '../EmptyContent';
import helper from '../helper';
import './SummaryPieChart.css';

/**
 * @param {Object} props
 * @param {string} [props.chartEmptyMessage]
 * @param {boolean} [props.chartIsEmpty]
 * @param {string[]} [props.customizedColorMap]
 * @param {{ name: string; value: number }[]} props.data
 * @param {number} [props.innerRadius]
 * @param {string} [props.lockMessage]
 * @param {number} [props.lockValue]
 * @param {number} [props.maximumDisplayItem]
 * @param {number} [props.outerRadius]
 * @param {number} [props.percentageFixedPoint]
 * @param {any} [props.pieChartStyle]
 * @param {boolean} [props.showPercentage]
 * @param {string} props.title
 * @param {boolean} [props.useCustomizedColorMap]
 */
function SummaryPieChart({
  chartEmptyMessage,
  chartIsEmpty,
  customizedColorMap,
  data,
  innerRadius,
  lockMessage,
  lockValue,
  maximumDisplayItem,
  outerRadius,
  percentageFixedPoint,
  pieChartStyle,
  showPercentage,
  title,
  useCustomizedColorMap,
}) {
  const [showMore, setShowMore] = useState(false);
  function toggle() {
    setShowMore((s) => !s);
  }

  function getItemColor(index) {
    if (data.length === 2) return helper.getCategoryColorFrom2Colors(index);

    if (useCustomizedColorMap)
      return customizedColorMap[index % customizedColorMap.length];

    return helper.getCategoryColor(index);
  }

  const dataKey = helper.getDataKey(showPercentage);
  const pieChartData = helper.calculateChartData(data, percentageFixedPoint);

  return (
    <div className='summary-pie-chart'>
      <div className='summary-pie-chart__title-box'>
        <p className='summary-pie-chart__title h4-typo'>{title}</p>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {chartIsEmpty ? (
        <EmptyContent message={chartEmptyMessage} />
      ) : helper.shouldHideChart(data, lockValue) ? (
        <LockedContent lockMessage={lockMessage} />
      ) : (
        <div className='summary-pie-chart__body'>
          <div className='summary-pie-chart__legend'>
            {pieChartData.map((entry, index) =>
              showMore || index < maximumDisplayItem ? (
                <div
                  className='summary-pie-chart__legend-item'
                  key={'text'.concat(entry.name)}
                >
                  <div className='summary-pie-chart__legend-item-name'>
                    {entry.name}
                  </div>
                  <div className='summary-pie-chart__legend-item-value form-special-number'>
                    <span className='summary-pie-chart__legend-item-value-number'>
                      {Number(entry.value).toLocaleString()}
                    </span>
                    <br />
                    {showPercentage && (
                      <span className='summary-pie-chart__legend-item-value-percentage'>
                        {helper.addPercentage(entry[dataKey])}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <Fragment key={'text'.concat(entry.name)} />
              )
            )}
            {pieChartData.length > maximumDisplayItem &&
              (showMore ? (
                <div
                  className='summary-pie-chart__toggle g3-link'
                  onClick={toggle}
                  onKeyPress={(e) => {
                    if (e.charCode === 13 || e.charCode === 32) {
                      e.preventDefault();
                      toggle();
                    }
                  }}
                  role='button'
                  tabIndex={0}
                  aria-label='Show less'
                >
                  <span>Show less</span>
                </div>
              ) : (
                <div
                  className='summary-pie-chart__toggle g3-link'
                  onClick={toggle}
                  onKeyPress={(e) => {
                    if (e.charCode === 13 || e.charCode === 32) {
                      e.preventDefault();
                      toggle();
                    }
                  }}
                  role='button'
                  tabIndex={0}
                  aria-label='Show more'
                >
                  {`And ${(
                    pieChartData.length - maximumDisplayItem
                  ).toLocaleString()} more`}
                </div>
              ))}
          </div>
          <PieChart
            width={outerRadius * 2}
            height={outerRadius * 2}
            style={pieChartStyle}
          >
            <Pie
              dataKey={dataKey}
              isAnimationActive={false}
              data={pieChartData}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill={pieChartStyle.fill}
            >
              {pieChartData.map((_, index) => (
                <Cell key={dataKey} fill={getItemColor(index)} />
              ))}
            </Pie>
            <Tooltip formatter={helper.percentageFormatter(showPercentage)} />
          </PieChart>
        </div>
      )}
    </div>
  );
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

SummaryPieChart.propTypes = {
  chartEmptyMessage: PropTypes.string,
  chartIsEmpty: PropTypes.bool,
  customizedColorMap: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  innerRadius: PropTypes.number,
  lockMessage: PropTypes.string,
  lockValue: PropTypes.number, // if one of the value is equal to `lockValue`, lock the chart
  maximumDisplayItem: PropTypes.number,
  outerRadius: PropTypes.number,
  percentageFixedPoint: PropTypes.number,
  pieChartStyle: PropTypes.object,
  showPercentage: PropTypes.bool,
  title: PropTypes.string.isRequired,
  useCustomizedColorMap: PropTypes.bool,
};

SummaryPieChart.defaultProps = {
  chartEmptyMessage: "Cannot render this chart because some fields don't apply",
  chartIsEmpty: false,
  customizedColorMap: ['var(--pcdc-color__primary)'],
  innerRadius: 31.5,
  lockMessage:
    'This chart is hidden because it contains fewer than 1000 subjects',
  lockValue: -1,
  maximumDisplayItem: 15,
  outerRadius: 43,
  percentageFixedPoint: 2,
  pieChartStyle: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '22px',
    fill: '#8884d8',
  },
  showPercentage: false,
  useCustomizedColorMap: false,
};

export default SummaryPieChart;
