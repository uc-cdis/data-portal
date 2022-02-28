import {
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';
import LockedContent from '../LockedContent';
import helper from '../helper';
import './PercentageStackedBarChart.css';

// FIXME: add back in animation (https://github.com/recharts/recharts/issues/1083)
/**
 * @param {Object} props
 * @param {any} [props.barChartStyle]
 * @param {string[]} [props.customizedColorMap]
 * @param {{ name: string; value: number }[]} props.data
 * @param {any} [props.labelListStyle]
 * @param {string} [props.lockMessage]
 * @param {number} [props.lockValue]
 * @param {number} [props.percentageFixedPoint]
 * @param {string} props.title
 * @param {boolean} [props.useCustomizedColorMap]
 * @param {any} [props.xAxisStyle]
 */
function PercentageStackedBarChart({
  barChartStyle,
  customizedColorMap,
  data,
  labelListStyle,
  lockMessage,
  lockValue,
  percentageFixedPoint,
  title,
  useCustomizedColorMap,
  xAxisStyle,
}) {
  function getItemColor(index) {
    return useCustomizedColorMap
      ? customizedColorMap[index % customizedColorMap.length]
      : helper.getCategoryColor(index);
  }
  return (
    <div className='percentage-bar-chart'>
      <div className='percentage-bar-chart__title-box'>
        <p className='percentage-bar-chart__title h4-typo'>{title}</p>
      </div>
      <div className='percentage-bar-chart__content-box'>
        {helper.shouldHideChart(data, lockValue) ? (
          <div className='percentage-bar-chart__locked'>
            <LockedContent lockMessage={lockMessage} />
          </div>
        ) : (
          <div className='percentage-bar-chart__content'>
            <div className='percentage-bar-chart__chart'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={helper.getPercentageData(data, percentageFixedPoint)}
                  {...barChartStyle}
                >
                  <Tooltip />
                  <CartesianGrid />
                  <XAxis
                    type='number'
                    style={xAxisStyle}
                    tickFormatter={helper.addPercentage}
                    {...xAxisStyle}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey='name'
                    type='category'
                    hide
                  />
                  {data.map(({ name }, index) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      stackId='a'
                      isAnimationActive={false}
                      fill={getItemColor(index)}
                    >
                      <LabelList
                        dataKey={name}
                        position={labelListStyle.position}
                        style={labelListStyle}
                        formatter={helper.addPercentage}
                        className='percentage-bar-chart__label-list'
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className='percentage-bar-chart__legend'>
              <div className='percentage-bar-chart__ul'>
                {data.map(({ name }, index) => (
                  <li
                    className='percentage-bar-chart__legend-item'
                    key={`label-${name}`}
                  >
                    <span
                      className='percentage-bar-chart__legend-color'
                      style={{
                        background: getItemColor(index),
                      }}
                    />
                    <span className='percentage-bar-chart__legend-name'>
                      {name}
                    </span>
                    <span className='percentage-bar-chart__legend-value'>
                      {'('
                        .concat(Number(data[index].value).toLocaleString())
                        .concat(')')}
                    </span>
                  </li>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

PercentageStackedBarChart.propTypes = {
  barChartStyle: PropTypes.object,
  customizedColorMap: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  labelListStyle: PropTypes.object,
  lockMessage: PropTypes.string,
  lockValue: PropTypes.number, // if one of the value is equal to `lockValue`, lock the chart
  percentageFixedPoint: PropTypes.number,
  title: PropTypes.string.isRequired,
  useCustomizedColorMap: PropTypes.bool,
  xAxisStyle: PropTypes.object,
};

PercentageStackedBarChart.defaultProps = {
  barChartStyle: {
    layout: 'vertical',
    margin: {
      top: 28,
      right: 12,
      bottom: 8,
      left: 12,
    },
    barSize: 30,
  },
  customizedColorMap: ['var(--pcdc-color__primary)'],
  percentageFixedPoint: 2,
  labelListStyle: {
    fill: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 600,
    position: 'center',
  },
  lockValue: -1,
  lockMessage:
    'This chart is hidden because it contains fewer than 1000 subjects',
  useCustomizedColorMap: false,
  xAxisStyle: {
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: '1em',
    letterSpacing: '.02rem',
    color: 'var(--pcdc-color__primary)',
    axisLine: false,
    tickLine: false,
    ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    domain: [0, 100],
    tickMargin: 10,
  },
};

export default PercentageStackedBarChart;
