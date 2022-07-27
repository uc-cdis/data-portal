import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import LockedContent from '../LockedContent';
import EmptyContent from '../EmptyContent';
import helper from '../helper';
import './SummaryHorizontalBarChart.css';

// FIXME: add back in animation (https://github.com/recharts/recharts/issues/1083)
/**
 * @param {Object} props
 * @param {string} [props.chartEmptyMessage]
 * @param {boolean} [props.chartIsEmpty]
 * @param {string} [props.color]
 * @param {string[]} [props.customizedColorMap]
 * @param {{ name: string; value: number }[]} props.data
 * @param {string} [props.lockMessage]
 * @param {number} [props.lockValue]
 * @param {number} [props.maximumDisplayItem]
 * @param {number} [props.percentageFixedPoint]
 * @param {boolean} [props.showPercentage]
 * @param {string} props.title
 * @param {boolean} [props.useCustomizedColorMap]
 */
function SummaryBarChart({
  chartEmptyMessage,
  chartIsEmpty,
  color,
  customizedColorMap,
  data,
  lockMessage,
  lockValue,
  maximumDisplayItem,
  percentageFixedPoint,
  showPercentage,
  title,
  useCustomizedColorMap,
}) {
  const [showMore, setShowMore] = useState(false);
  function toggle() {
    setShowMore((s) => !s);
  }

  function getItemColor(index) {
    if (useCustomizedColorMap)
      return customizedColorMap[index % customizedColorMap.length];

    if (color) return color;

    return helper.getCategoryColor(index);
  }

  const barChartData = helper.calculateChartData(data, percentageFixedPoint);

  return (
    <div className='summary-horizontal-bar-chart'>
      <div className='summary-horizontal-bar-chart__title-box'>
        <p className='summary-horizontal-bar-chart__title h4-typo'>{title}</p>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {chartIsEmpty ? (
        <EmptyContent message={chartEmptyMessage} />
      ) : helper.shouldHideChart(data, lockValue) ? (
        <LockedContent lockMessage={lockMessage} />
      ) : (
        <div>
          {barChartData.map((item, index) =>
            showMore || index < maximumDisplayItem ? (
              <div
                key={item.name}
                className='summary-horizontal-bar-chart__item'
              >
                <div className='summary-horizontal-bar-chart__item-label'>
                  {item.name}
                </div>
                <div className='summary-horizontal-bar-chart__item-block-wrapper'>
                  <div
                    className='summary-horizontal-bar-chart__item-block'
                    style={{
                      width: `${item.widthPercentage}%`,
                      backgroundColor: getItemColor(index),
                    }}
                  />
                  {showPercentage ? (
                    <div className='summary-horizontal-bar-chart__item-value percentage'>
                      {item.value}
                      <br />({item.percentage}%)
                    </div>
                  ) : (
                    <div className='summary-horizontal-bar-chart__item-value'>
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Fragment key={item.name} />
            )
          )}
          {barChartData.length > maximumDisplayItem &&
            (showMore ? (
              <div
                className='summary-horizontal-bar-chart__toggle g3-link'
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
                className='summary-horizontal-bar-chart__toggle g3-link'
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
                  barChartData.length - maximumDisplayItem
                ).toLocaleString()} more`}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

SummaryBarChart.propTypes = {
  chartEmptyMessage: PropTypes.string,
  chartIsEmpty: PropTypes.bool,
  color: PropTypes.string,
  customizedColorMap: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  lockMessage: PropTypes.string,
  lockValue: PropTypes.number, // if one of the value is equal to `lockValue`, lock the chart
  maximumDisplayItem: PropTypes.number,
  percentageFixedPoint: PropTypes.number,
  showPercentage: PropTypes.bool,
  title: PropTypes.string.isRequired,
  useCustomizedColorMap: PropTypes.bool,
};

SummaryBarChart.defaultProps = {
  chartEmptyMessage: "Cannot render this chart because some fields don't apply",
  chartIsEmpty: false,
  color: undefined,
  customizedColorMap: ['var(--pcdc-color__primary)'],
  lockMessage:
    'This chart is hidden because it contains fewer than 1000 subjects',
  lockValue: -1,
  maximumDisplayItem: 15,
  percentageFixedPoint: 2,
  showPercentage: false,
  useCustomizedColorMap: false,
};

export default SummaryBarChart;
