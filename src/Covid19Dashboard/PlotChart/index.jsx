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
  const addDaysToDate = (date) => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };
  while (currentDate <= endingDate) {
    const year = currentDate.getUTCFullYear();
    const month = `${currentDate.getUTCMonth() + 1}`.padStart(2, 0);
    const day = `${currentDate.getUTCDate()}`.padStart(2, 0);
    const stringDate = [year, month, day].join('-');
    const fmtDate = `${stringDate} 00:00:00+00:00`;
    dates.push(fmtDate);
    currentDate = addDaysToDate(currentDate);
  }
  return dates;
}

function formatChartData(plots) {
  const dateToData = {};
  if (!plots || !plots.length) {
    return dateToData;
  }
  plots.forEach((plot) => {
    Object.entries(plot.data).forEach((e) => {
      const dateVal = e[0];
      const value = Number(e[1]);
      if (!(dateVal in dateToData)) {
        dateToData[dateVal] = { date: dateVal };
      }
      dateToData[dateVal][plot.name] = value;
    });
  });
  let sortedData = Object.values(dateToData);
  sortedData = sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  return {
    data: sortedData,
    ticks: getDates(sortedData[0].date, sortedData[sortedData.length - 1].date, 7),
  };
}

// 10 colors generated with
// https://medialab.github.io/iwanthue/
// Intense + colorblind option + hard (force vector)
const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

class PlotChart extends PureComponent { // eslint-disable-line react/no-multi-comp
  state = {
    width: Object.fromEntries(
      Object.entries(this.props.plots).map((e) => {
        const value = e[1];
        return [value.name, 1];
      }),
    ),
  };

  // change the width of line based on the mouse over the legend
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
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(props.label);
    return (
      <div className='plot-chart__tooltip'>
        <p>{monthNames[date.getUTCMonth()]} {date.getUTCDate()}, {date.getUTCFullYear()}</p>
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
            <CartesianGrid
              horizontal
              vertical={false}
              strokeDasharray='3 3'
            />
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
                offset: -10,
              }}
              type='number'
              domain={[0, 'auto']}
            />
            <Tooltip content={this.renderTooltip} />
            <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
            {
              this.props.plots.map((entry, index) => {
                const color = COLORS[index % COLORS.length];
                return <Line key={entry.name} type='monotone' dataKey={entry.name} strokeWidth={width[entry.name]} stroke={color} dot={false} />;
              })
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

PlotChart.propTypes = {
  plots: PropTypes.array,
  title: PropTypes.string.isRequired,
  yTitle: PropTypes.string.isRequired,
};

PlotChart.defaultProps = {
  plots: [],
};

export default PlotChart;
