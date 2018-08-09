import {
  ResponsiveContainer, BarChart, Bar,
  Tooltip, XAxis, YAxis, LabelList, Cell,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import helper from '../helper';
import './SummaryHorizontalBarChart.less';

const yAxisStyle = {
  fontSize: '12px',
  fontWeight: 'regular',
  lineHeight: '1em',
  letterSpacing: '.03rem',
  color: '#606060',
};

const labelValueStyle = {
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '1em',
  letterSpacing: '.02rem',
  color: '#3283c8',
};

class SummaryBarChart extends React.Component {
  render() {
    const barChartHeight = (this.props.data.length * this.props.barSize)
      + ((this.props.data.length + 1) * this.props.barGap) + 2;
    const barChartData = helper.calculateChartData(
      this.props.data,
      this.props.showPercentage,
      this.props.percentageFixedPoint,
    );
    const dataKey = helper.getDataKey(this.props.showPercentage);
    return (
      <div className='summary-horizontal-bar-chart'>
        <div className='summary-horizontal-bar-chart__title h4-typo'>
          {this.props.title}
        </div>
        <ResponsiveContainer width='100%' height={barChartHeight}>
          <BarChart
            layout='vertical'
            data={barChartData}
            barCategoryGap={this.props.barGap}
            barSize={this.props.barSize}
            margin={{ top: 4, right: 35, left: 15 }}
          >
            <Tooltip formatter={helper.percentageFormatter(this.props.showPercentage)} />
            <XAxis axisLine={false} tickLine={false} type='number' hide />
            <YAxis axisLine={false} tickLine={false} dataKey='name' type='category' style={yAxisStyle} interval={0} />
            <Bar dataKey={dataKey}>
              {
                barChartData.map((entry, index) => (
                  <Cell
                    key={dataKey}
                    fill={this.props.color
                      || helper.getCategoryColor(index, this.props.localTheme)}
                  />
                ))
              }
              <LabelList dataKey={dataKey} position='right' offset={8} style={labelValueStyle} formatter={helper.percentageFormatter(this.props.showPercentage)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

SummaryBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  localTheme: PropTypes.object.isRequired,
  color: PropTypes.string,
  barSize: PropTypes.number,
  barGap: PropTypes.number,
  showPercentage: PropTypes.bool,
  percentageFixedPoint: PropTypes.number,
};

SummaryBarChart.defaultProps = {
  color: undefined,
  barSize: 11,
  barGap: 8,
  showPercentage: true,
  percentageFixedPoint: 2,
};

export default SummaryBarChart;
