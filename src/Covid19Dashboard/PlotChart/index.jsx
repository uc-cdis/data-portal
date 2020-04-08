import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import './PlotChart.less';

class CustomizedAxisTick extends React.Component {
  render() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov','Dec'];
    const {
      x, y, stroke, payload,
    } = this.props;
    const formattedDate = `${monthNames[new Date(payload.value).getMonth()]} ${new Date(payload.value).getDate()}`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor='end' fill='#666' transform='rotate(-60)'>{formattedDate}</text>
      </g>
    );
  }
}

class PlotChart extends PureComponent {
  formatChartData = data => {
    let sortedData = [
      {
        date: '03/08/2020',
        observed: 0.0000,
        simulated: 0.0000,
      },
      {
        date: '03/20/2020',
        observed: 0.0050,
        simulated: 0.0050,
      },
      {
        date: '04/17/2020',
        // observed: 0.0000,
        simulated: 0.0125,
      },
      {
        date: '04/01/2020',
        simulated: 0.0150,
      },
    ];
    let max = 0.0150;
    return { data: sortedData, max };
  }

  render() {
    const chartData = this.formatChartData({});

    return (
      <div className='plot-chart'>
        <ResponsiveContainer>
          <LineChart
            data={chartData.data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              // tick={<CustomizedAxisTick />}
              interval={1}
            />
            <YAxis type='number' domain={[0, chartData.max || 'auto']} />
            {/* <Tooltip content={this.renderTooltip} /> */}
            <Legend />
            <Line type='monotone' dataKey='observed' stroke='#aa5e79' />
            <Line type='monotone' dataKey='simulated' stroke='#8884d8' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

PlotChart.propTypes = {
  // onMapStyleChange: PropTypes.func,
  // showLegend: PropTypes.bool,
  // colors: PropTypes.object,
  // showMapStyle: PropTypes.bool,
  // defaultMapStyle: PropTypes.string,
};

PlotChart.defaultProps = {
  // onMapStyleChange: () => {},
  // showLegend: false,
  // colors: {},
  // showMapStyle: false,
  // defaultMapStyle: '',
};

export default PlotChart;
