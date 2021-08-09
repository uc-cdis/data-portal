import moment from 'moment';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import Spinner from '../../components/Spinner';
import { downloadFromGuppy } from '../dataUtils.js';
import './PlotChart.less';

class PlotChartAxisTick extends React.Component {
  render() {
    // type is one of ['date', 'string', 'number']
    const {
      x, y, payload, axis, type, labelMaxLength, labelFontSize,
    } = this.props;
    if (!x || !y || !payload) {
      return null;
    }

    let formattedValue = payload.value;
    if (type === 'date') {
      formattedValue = `${moment(formattedValue).month() + 1}/${moment(formattedValue).date()}`;
    } else if (type === 'number') {
      formattedValue = Number(formattedValue).toLocaleString();
    } else if (type === 'string' && labelMaxLength) {
      // truncate long labels and add "..."
      formattedValue = formattedValue.slice(0, labelMaxLength)
        + (formattedValue.length > labelMaxLength ? '...' : '');
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={5}
          textAnchor='end'
          fill='#666'
          fontSize={labelFontSize}
          transform={axis === 'x' ? 'rotate(-35)' : null}
        >
          {formattedValue}
        </text>
      </g>
    );
  }
}

PlotChartAxisTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
  axis: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  labelMaxLength: PropTypes.number,
  labelFontSize: PropTypes.number,
};

PlotChartAxisTick.defaultProps = {
  x: undefined,
  y: undefined,
  payload: undefined,
  labelMaxLength: undefined,
  labelFontSize: 10,
};

function getDates(startDate, endDate, days) {
  const dates = [];
  let currentDate = moment(startDate);
  const endingDate = moment(endDate);
  const addDaysToDate = (date) => {
    const newDate = moment(date);
    newDate.add(days, 'days');
    return newDate;
  };
  while (currentDate.isSameOrBefore(endingDate)) {
    dates.push(currentDate.utc().format('YYYY-MM-DD HH:mm:ssZ'));
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
  sortedData = sortedData.sort((a, b) => moment(a.date) - moment(b.date));
  return {
    data: sortedData,
    ticks: getDates(sortedData[0].date, sortedData[sortedData.length - 1].date, 7),
  };
}

// 10 colors generated with
// https://medialab.github.io/iwanthue/
// Intense + colorblind option + hard (force vector)
const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

class PlotChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: Object.fromEntries(
        Object.entries(this.props.plots).map((e) => {
          const value = e[1];
          return [value.name, 1];
        }),
      ),
      guppyData: [],
    };
  }

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
        if (res.status !== 200 || (res.data && res.data.error)) {
          const msg = `Guppy error while fetching chart data, status ${res.status}${res.data && res.data.error ? `: ${res.data.error}` : ''}`;
          console.error(msg); // eslint-disable-line no-console
        } else {
          this.setState({ guppyData: res.data });
        }
      });
  }

  getGuppyBarChartComponent = (data) => {
    const {
      xTitle, yTitle, layout, axisLabelMaxLength,
      axisLabelFontSize, barColor, guppyConfig,
    } = this.props;
    if (!data.length) {
      return null;
    }
    return (
      <BarChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
        layout={layout}
      >
        <CartesianGrid
          vertical={layout === 'vertical'}
          horizontal={layout === 'horizontal'}
          strokeDasharray='3 3'
        />
        <XAxis
          height={50} // default is 30 - labels don't fit
          label={{
            value: xTitle,
            position: 'bottom',
            offset: -10,
          }}
          dataKey={layout === 'horizontal' ? guppyConfig.xAxisProp : null}
          type={layout === 'horizontal' ? 'category' : 'number'}
          tickLine={layout === 'horizontal' && false}
          tick={(
            <PlotChartAxisTick
              axis='x'
              type={layout === 'vertical' ? 'number' : 'string'}
              labelMaxLength={axisLabelMaxLength}
              labelFontSize={axisLabelFontSize}
            />
          )}
        />
        <YAxis
          label={{
            className: 'plot-chart__y-title',
            value: yTitle,
            angle: -90,
            position: 'left',
            offset: 15,
          }}
          dataKey={layout === 'vertical' ? guppyConfig.xAxisProp : null}
          type={layout === 'horizontal' ? 'number' : 'category'}
          tickLine={layout === 'vertical' && false}
          tick={(
            <PlotChartAxisTick
              axis='y'
              type={layout === 'horizontal' ? 'number' : 'string'}
              labelMaxLength={axisLabelMaxLength}
              labelFontSize={axisLabelFontSize}
            />
          )}
        />
        <Tooltip
          formatter={
            (value) => [Number(value).toLocaleString(), yTitle || 'Value']
          }
        />
        <Bar
          dataKey={guppyConfig.yAxisProp}
          fill={barColor || COLORS[0]}
        />
      </BarChart>
    );
  }

  getLineChartComponent = (chartData, width) => {
    const { yTitle, axisLabelFontSize } = this.props;
    if (!Object.keys(this.props.plots).length) {
      return null;
    }
    return (
      <LineChart
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
          tick={(
            <PlotChartAxisTick
              axis='x'
              type='date'
              labelFontSize={axisLabelFontSize}
            />
          )}
          ticks={chartData.ticks}
          interval={Math.round(chartData.ticks.length / 25)}
        />
        <YAxis
          label={{
            className: 'plot-chart__y-title',
            value: yTitle,
            angle: -90,
            position: 'insideLeft',
            offset: -10,
          }}
          type='number'
          tick={(
            <PlotChartAxisTick
              axis='y'
              type='number'
              labelFontSize={axisLabelFontSize}
            />
          )}
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
      </LineChart>
    );
  }

  formatChartDataFromGuppy = (guppyData) => {
    let data = guppyData.filter(
      (e) => (!!e[this.props.guppyConfig.xAxisProp] && !!e[this.props.guppyConfig.yAxisProp]),
    ).sort( // sort in descending order
      (a, b) => (
        a[this.props.guppyConfig.yAxisProp] > b[this.props.guppyConfig.yAxisProp] ? -1 : 1
      ),
    );
    if (this.props.maxItems) {
      data = data.slice(0, this.props.maxItems);
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
    const date = moment(props.label);
    const nColumns = Math.ceil(props.payload.length / 5); // up to 5 items per column
    return (
      <div className='plot-chart__tooltip'>
        <p>{monthNames[date.month()]} {date.date()}, {date.year()}</p>
        <div style={{ columnCount: nColumns }}>
          {
            props.payload.map((data, i) => (
              <p
                style={{ color: data.stroke }}
                key={i}
              >
                {data.name}: {Number(data.value).toLocaleString()}
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
        {component
          ? (
            <ResponsiveContainer height={250}>
              {component}
            </ResponsiveContainer>
          )
          : <Spinner />}
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
  axisLabelMaxLength: PropTypes.number,
  axisLabelFontSize: PropTypes.number,
  layout: PropTypes.string,
  maxItems: PropTypes.number,
  barColor: PropTypes.string,
  guppyConfig: PropTypes.object,
};

PlotChart.defaultProps = {
  plots: [],
  xTitle: undefined,
  yTitle: undefined,
  axisLabelMaxLength: undefined,
  axisLabelFontSize: 10,
  layout: 'horizontal',
  maxItems: undefined,
  barColor: undefined,
  guppyConfig: {},
};

export default PlotChart;
