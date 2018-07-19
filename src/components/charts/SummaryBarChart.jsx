import {
  ResponsiveContainer, BarChart, Bar,
  Tooltip, XAxis, YAxis, LabelList, Cell,
} from 'recharts';
import PropTypes from 'prop-types';
import React from 'react';
import ChartsHelper from './ChartsHelper';
import './SummaryBarChart.less';

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
    const monoFillColor = this.props.monoColor ? this.props.color : undefined;
    const barChartHeight = (this.props.data.length * this.props.barSize)
      + ((this.props.data.length + 1) * this.props.barGap) + 2;
    const barChartData = ChartsHelper.calculateBarChartData(
      this.props.data,
      this.props.showPercentage,
      this.props.percentageFixedPoint,
    );
    const dataKey = ChartsHelper.getDataKey(this.props.showPercentage);
    return (
      <div className="summary-bar-chart">
        <div className="summary-bar-chart__title h4-typo">
          {this.props.title}
        </div>
        <ResponsiveContainer width="100%" height={barChartHeight}>
          <BarChart
            layout={this.props.vertical ? 'vertical' : 'horizontal'}
            data={barChartData}
            barCategoryGap={this.props.barGap}
            barSize={this.props.barSize}
            margin={{ top: 4, right: 35, left: 15 }}
          >
            <Tooltip formatter={ChartsHelper.percentageFormatter(this.props.showPercentage)} />
            <XAxis axisLine={false} tickLine={false} type="number" hide />
            <YAxis axisLine={false} tickLine={false} dataKey="name" type="category" style={yAxisStyle} interval={0} />
            <Bar dataKey={dataKey}>
              {
                barChartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={monoFillColor
                      || ChartsHelper.getCategoryColor(index, this.props.localTheme)}
                  />
                ))
              }
              <LabelList dataKey={dataKey} position="right" offset={8} style={labelValueStyle} formatter={ChartsHelper.percentageFormatter(this.props.showPercentage)} />
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
  vertical: PropTypes.bool,
  monoColor: PropTypes.bool,
  color: PropTypes.string,
  barSize: PropTypes.number,
  barGap: PropTypes.number,
  showPercentage: PropTypes.bool,
  percentageFixedPoint: PropTypes.number,
};

SummaryBarChart.defaultProps = {
  vertical: false,
  monoColor: false,
  color: '#3283c8',
  barSize: 11,
  barGap: 8,
  showPercentage: true,
  percentageFixedPoint: 2,
};

export default SummaryBarChart;
