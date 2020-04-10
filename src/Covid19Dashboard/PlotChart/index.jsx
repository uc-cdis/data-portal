import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import './PlotChart.less';


class CustomizedAxisTick extends React.Component {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;
    const formattedDate = `${new Date(payload.value).getMonth()}/${new Date(payload.value).getDate()}`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor='end' fill='#666' transform='rotate(-60)'>{formattedDate}</text>
      </g>
    );
  }
}

class PlotChart extends PureComponent {
  formatChartData (plots) {
    let dateToData = {};
    if (!plots || !plots.length) {
      return dateToData;
    }

    // let max = 0;
    plots.forEach(plot => {
      Object.entries(plot.data).forEach(e => {
        const dateVal = e[0];
        const value = Number(e[1]);
        // max = Math.max(max, value);
        if (!(dateVal in dateToData)) {
          dateToData[dateVal] = { date: dateVal };
        }
        dateToData[dateVal][plot.name] = value;
      });
    });
    let sortedData = Object.values(dateToData);
    sortedData = sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    // console.log(sortedData);
    return { data: sortedData }; //, max };
  }

  renderTooltip = props => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov','Dec'];
    const date = new Date(props.label);
    return (
      <div className='map-chart__tooltip'>
        <p>{monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
        {
          props.payload.map((data, i) => (
            <p style={{color: data.stroke}} key={i}>{data.name}: {data.value.toExponential()}</p>
          ))
        }
      </div>
    )
  }

  render() {
    const chartData = this.formatChartData(this.props.plots);

    return (
      <div className='plot-chart'>
        <p className='plot-chart__title'>
          {this.props.title}
        </p>
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
              // label={this.props.xTitle}
              tick={<CustomizedAxisTick />}
              interval={1}
            />
            <YAxis
              label={{
                className: 'plot-chart__y-title',
                value: this.props.yTitle,
                angle: -90,
                position: 'insideLeft',
              }}
              type='number'
              domain={[0, 'auto']}
            />
            <Tooltip content={this.renderTooltip} />
            <Legend />
            <Line type='monotone' dataKey={this.props.plots[0].name} stroke='#8884d8' dot={false} />
            <Line type='monotone' dataKey={this.props.plots[1].name} stroke='#aa5e79' dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

PlotChart.propTypes = {
  plots: PropTypes.array,
};

PlotChart.defaultProps = {
  plots: [],
};

export default PlotChart;
