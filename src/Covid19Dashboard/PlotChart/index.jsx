import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import './PlotChart.less';


class CustomizedAxisTick extends React.Component {
  render() {
    const { x, y, payload } = this.props; // eslint-disable-line react/prop-types
    const val = payload.value; // eslint-disable-line react/prop-types
    const formattedDate = `${new Date(val).getUTCMonth() + 1}/${new Date(val).getUTCDate()}`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor='end' fill='#666' transform='rotate(-60)'>{formattedDate}</text>
      </g>
    );
  }
}

function getDates(startDate, endDate, days) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endingDate = new Date(endDate);
  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endingDate) {
    const year = currentDate.getUTCFullYear();
    const month = `${currentDate.getUTCMonth() + 1}`.padStart(2, 0);
    const day = `${currentDate.getUTCDate()}`.padStart(2, 0);
    const stringDate = [year, month, day].join('-');
    const fmtDate = `${stringDate} 00:00:00+00:00`;
    dates.push(fmtDate);
    currentDate = addDays.call(currentDate, days);
  }
  return dates;
}

function formatChartData(plots) {
  const dateToData = {};
  if (!plots || !plots.length) {
    return dateToData;
  }
  // let max = 0;
  plots.forEach((plot) => {
    Object.entries(plot.data).forEach((e) => {
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
  return { data: sortedData, ticks: getDates(sortedData[0].date, sortedData[sortedData.length - 1].date, 7) }; // , max };
}

// 10 colors generated with
// https://medialab.github.io/iwanthue/
// Intense + colorblind option
const COLORS = ['#ae5d47', '#d46c2e', '#88b33a', '#6c894d', '#4c9e8e', '#7384b4', '#6b52ad', '#9d4cd9', '#cd4a98', '#9f566f'];

class PlotChart extends PureComponent { // eslint-disable-line react/no-multi-comp
  state = {
    width: Object.fromEntries(
      Object.entries(this.props.plots).map(([k, v], i) => [v.name, 1]),
    ),
  };

  handleMouseEnter = (o) => {
    const { dataKey } = o;
    const { width } = this.state;

    this.setState({
      width: { ...width, [dataKey]: 2 },
    });
  }

  handleMouseLeave = (o) => {
    const { dataKey } = o;
    const { width } = this.state;

    this.setState({
      width: { ...width, [dataKey]: 1 },
    });
  }

  renderTooltip = (props) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date(props.label);
    return (
      <div className='map-chart__tooltip'>
        <p>{monthNames[date.getUTCMonth() - 1]} {date.getUTCDate()}, {date.getUTCFullYear()}</p>
        {
          props.payload.map((data, i) => (
            <p style={{ color: data.stroke }} key={i}>{data.name}: {data.value}</p>
          ))
        }
      </div>
    );
  }

  render() {
    const chartData = formatChartData(this.props.plots);
    const { width } = this.state;

    return (
      <div className='plot-chart'>
        <p className='plot-chart__title'>
          {this.props.title}
        </p>
        <ResponsiveContainer height={250}>
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
              ticks={chartData.ticks}
              // interval='preserveStartEnd'
              interval={0}
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
            <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
            {
              this.props.plots.map((entry, index) => {
                const color = COLORS[index];
                return <Line key={entry.name} type='monotone' dataKey={entry.name} strokeWidth={width[entry.name]} stroke={color} dot={false} />;
              })
            }
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop: `${2}em` }}><p>{this.props.description}</p></div>
      </div>
    );
  }
}

PlotChart.propTypes = {
  plots: PropTypes.array,
  title: PropTypes.string.isRequired,
  yTitle: PropTypes.string.isRequired,
  description: PropTypes.string,
};

PlotChart.defaultProps = {
  plots: [],
};

export default PlotChart;
