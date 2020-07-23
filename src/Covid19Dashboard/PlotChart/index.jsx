import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import Spinner from '../../components/Spinner';
import { numberWithCommas, downloadFromGuppy } from '../dataUtils.js';
import './PlotChart.less';


class PlotChartXAxisTick extends React.Component {
  /* eslint-disable react/prop-types */
  render() {
    const { x, y, payload, isDates } = this.props;

    let formattedValue = payload.value;
    if (isDates) {
      formattedValue = `${new Date(formattedValue).getUTCMonth() + 1}/${new Date(formattedValue).getUTCDate()}`;
    } else {
      const maxLength = 4;
      formattedValue = formattedValue.slice(0, maxLength) + (formattedValue.length > maxLength ? '.' : '');
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor='end' fill='#666' transform='rotate(-60)'>{formattedValue}</text>
      </g>
    );
  }
  /* eslint-enable */
}

function getDates(startDate, endDate, days) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endingDate = new Date(endDate);
  const addDaysToDate = (date) => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getUTCDate() + days);
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

function formatChartDataFromProps(plots) {
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
    guppyData: [],
  };

  componentDidMount() {
    if (!this.props.guppyConfig) {
      return;
    }

    // fetch data from Guppy if the component has a guppyConfig
    let filter = {};
    if (typeof this.props.guppyConfig.filters !== 'undefined') {
      filter = this.props.guppyConfig.filters;
    }
    const fields = [this.props.guppyConfig.xAxisProp, this.props.guppyConfig.yAxisProp];
    downloadFromGuppy(this.props.guppyConfig.dataType, filter, fields)
      .then((res) => {
        this.setState({ guppyData: res.data });
      });
  }

  getGuppyBarChartComponent = (data) => {
    if (!data.length) {
      return null;
    }
    return (<BarChart
      data={data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
      barGap={0}
    >
      <CartesianGrid
        vertical={false}
        strokeDasharray='3 3'
      />
      <XAxis
        dataKey={this.props.guppyConfig.xAxisProp}
        height={50} // default is 30 - labels don't fit
        label={{
          value: this.props.xTitle,
          position: 'bottom',
          offset: -10,
        }}
        tickLine={false}
        tickMargin={-5}
        tick={<PlotChartXAxisTick isDates={false} />}
      />
      <YAxis
        label={{
          className: 'plot-chart__y-title',
          value: this.props.yTitle,
          angle: -90,
          position: 'left',
          offset: 15,
        }}
        type='number'
        domain={[0, 'auto']}
        tickFormatter={value => numberWithCommas(value)}
      />
      <Tooltip
        formatter={
          value => [numberWithCommas(value), this.props.yTitle]
        }
      />
      <Bar
        dataKey={this.props.guppyConfig.yAxisProp}
        fill={this.props.barColor || COLORS[0]}
      />
    </BarChart>);
  }

  getLineChartComponent = (chartData, width) => {
    if (!Object.keys(this.props.plots).length) {
      return null;
    }
    return (<LineChart
      data={chartData.data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid
        vertical={false}
        strokeDasharray='3 3'
      />
      <XAxis
        dataKey='date'
        tick={<PlotChartXAxisTick isDates />}
        ticks={chartData.ticks}
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
      <Tooltip
        content={this.renderTooltip}
      />
      <Legend
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
      {
        this.props.plots.map((entry, index) => {
          const color = COLORS[index % COLORS.length];
          return <Line key={entry.name} type='monotone' dataKey={entry.name} strokeWidth={width[entry.name]} stroke={color} dot={false} />;
        })
      }
    </LineChart>);
  }

  formatChartDataFromGuppy = (guppyData) => {
    let data = guppyData.filter(
      e => (!!e[this.props.guppyConfig.xAxisProp] && !!e[this.props.guppyConfig.yAxisProp]),
    ).sort( // sort in descending order
      (a, b) => (
        a[this.props.guppyConfig.yAxisProp] > b[this.props.guppyConfig.yAxisProp] ? -1 : 1
      ),
    );
    if (this.props.guppyConfig.maxItems) {
      data = data.slice(0, this.props.guppyConfig.maxItems);
    }
    return data;
  }

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
    const nColumns = Math.ceil(props.payload.length / 5); // up to 5 items per column
    return (
      <div className='plot-chart__tooltip'>
        <p>{monthNames[date.getUTCMonth()]} {date.getUTCDate()}, {date.getUTCFullYear()}</p>
        <div style={{ columnCount: nColumns }}>
          {
            props.payload.map((data, i) => (
              <p
                style={{ color: data.stroke }}
                key={i}
              >
                {data.name}: {numberWithCommas(data.value)}
              </p>
            ))
          }
        </div>
      </div>
    );
  }

  render() {
    let component = null;
    // for now, only lineChart with plots or barChart with guppyConfig
    if (this.props.type === 'lineChart') {
      const chartData = formatChartDataFromProps(this.props.plots);
      const { width } = this.state;
      component = this.getLineChartComponent(chartData, width);
    } else if (this.props.type === 'barChart' && this.props.guppyConfig && this.state.guppyData) {
      const chartData = this.formatChartDataFromGuppy(this.state.guppyData);
      component = this.getGuppyBarChartComponent(chartData);
    }

    return (
      <div className='plot-chart'>
        <p className='plot-chart__title'>
          {this.props.title}
        </p>
        {component ?
          <ResponsiveContainer height={250}>
            {component}
          </ResponsiveContainer>
          : <Spinner />
        }
      </div>
    );
  }
}

PlotChart.propTypes = {
  type: PropTypes.string.isRequired,
  plots: PropTypes.array,
  title: PropTypes.string.isRequired,
  xTitle: PropTypes.string,
  yTitle: PropTypes.string,
  barColor: PropTypes.string,
  guppyConfig: PropTypes.object,
};

PlotChart.defaultProps = {
  plots: [],
  xTitle: null,
  yTitle: null,
  barColor: null,
  guppyConfig: {},
};

export default PlotChart;
