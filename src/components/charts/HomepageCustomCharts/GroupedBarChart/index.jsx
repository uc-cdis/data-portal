import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import { fetchWithCreds } from '../../../../actions';
import { colorsForCharts, guppyGraphQLUrl } from '../../../../localconf';

class GroupedBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: null,
      valuesSet: null,
    };
  }

  componentDidMount() {
    const typeName = this.props.dataType;
    const { xAxisProp } = this.props;
    const { yAxisProp } = this.props;
    this.downloadData(typeName, xAxisProp, yAxisProp)
      .then(({ datasets, valuesSet }) => {
        this.setState({ datasets, valuesSet });
      });
  }

  async downloadData(typeName, xAxisProp, yAxisProp) {
    try {
      const query = `
        query ($nestedAggFields: JSON, $filter: JSON) {
          _aggregation {
            ${typeName}(nestedAggFields: $nestedAggFields, filter: $filter) {
              ${xAxisProp} {
                histogram {
                  key
                  count
                  termsFields {
                    field
                    terms {
                      key
                      count
                    }
                  }
                }
              }
            }
          }
        }`;
      const variables = {
        nestedAggFields: {
          termsFields: [
            yAxisProp,
          ],
        },
        filter: {},
      };
      if (typeof this.props.constrains !== 'undefined') {
        variables.filter = {
          '=': {
            ...this.props.constrains,
          },
        };
      }
      const body = { query, variables };
      const res = await fetchWithCreds({
        path: guppyGraphQLUrl,
        method: 'POST',
        body: JSON.stringify(body),
      });

      const yAxisValueSet = new Set(); // a set of y axis prop values
      const tempDatasets = {}; // a temp dataset, tempDatasets[xAxis][yAxis] = count
      // eslint-disable-next-line no-underscore-dangle
      res.data.data._aggregation[typeName][xAxisProp].histogram.forEach(({ key, termsFields }) => {
        const xAxisValue = key;

        // validate the response result format is correct
        if (!(termsFields.length === 1 && termsFields[0].field === yAxisProp)) {
          throw Error('Error when parsing chart data');
        }
        if (typeof tempDatasets[xAxisValue] === 'undefined') {
          tempDatasets[xAxisValue] = {};
        }

        // assign value to tempDatasets, also add y value to yAxisValueSet
        termsFields[0].terms.forEach((d) => {
          const yAxisValue = d.key;
          yAxisValueSet.add(yAxisValue);
          tempDatasets[xAxisValue][yAxisValue] = d.count;
        });
      });

      // sort in alphabetical order
      // (reverse because charts show items from bottom to top)
      const sortedYAxisValues = Array.from(yAxisValueSet).sort().reverse();

      // need a map to remember y value => index
      const yAxisValueToIndex = sortedYAxisValues
        .reduce((acc, cur, i) => { acc[cur] = i; return acc; }, {});

      // assign counts to datasets, datasets[xAxis] is an array of counts
      const datasets = Object.keys(tempDatasets).map((xAxisValue) => {
        const dataset = Array(sortedYAxisValues.size);
        dataset.fill(0);
        Object.keys(yAxisValueToIndex).forEach((yAxisValue) => {
          const index = yAxisValueToIndex[yAxisValue];
          dataset[index] = tempDatasets[xAxisValue][yAxisValue];
        });
        return {
          key: xAxisValue,
          dataset,
        };
      });
      return {
        datasets,
        valuesSet: sortedYAxisValues,
      };
    } catch (err) {
      throw Error('Error when getting chart data', err);
    }
  }

  render() {
    if (!this.state.datasets) return null;
    const legendSelectedObj = this.props.initialUnselectedKeys.reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {});
    const dataTypePlural = this.props.dataTypePlural || `${this.props.dataType}s`;
    const defaultSubTitle = `Number of ${dataTypePlural} by ${this.props.yAxisProp}`;
    const option = {
      title: {
        text: this.props.chartTitle,
        subtext: this.props.subTitle ? this.props.subTitle : defaultSubTitle,
        textStyle: {
          fontSize: 12,
          color: '#999',
        },
        left: 'center',
      },
      yAxis: {
        data: Array.from(this.state.valuesSet),
        axisTick: false,
        axisLabel: {
          formatter: (value) => {
            const len = 15;
            return value.length > len ? `${value.substring(0, len - 3)}...` : value;
          },
        },
      },
      xAxis: {
        name: this.props.xAxisProp,
        nameLocation: 'center',
      },
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        trigger: 'axis',
      },
      legend: {
        data: this.state.datasets.map((d) => d.key),
        bottom: 0,
        selected: legendSelectedObj,
      },
      grid: {
        top: 40,
        bottom: 50,
        right: 25,
        left: 100,
      },
      backgroundColor: '#f5f5f5',
      series: this.state.datasets.map((d, i) => ({
        name: d.key,
        type: 'bar',
        data: d.dataset,
        stack: d.key,
        barGap: 0,
        color: colorsForCharts.categorical9Colors[i % colorsForCharts.categorical9Colors.length],
      })),
    };
    if (this.props.logBase && this.props.logBase !== 1) {
      option.xAxis.type = 'log';
      option.xAxis.logBase = this.props.logBase;
    }
    return (
      <ReactEcharts
        option={option}
      />
    );
  }
}

GroupedBarChart.propTypes = {
  chartTitle: PropTypes.string.isRequired,
  dataType: PropTypes.string.isRequired,
  yAxisProp: PropTypes.string.isRequired,
  xAxisProp: PropTypes.string.isRequired,
  constrains: PropTypes.object,
  logBase: PropTypes.number,
  initialUnselectedKeys: PropTypes.arrayOf(PropTypes.string),
  dataTypePlural: PropTypes.string,
  subTitle: PropTypes.string,
};

GroupedBarChart.defaultProps = {
  constrains: {},
  logBase: null,
  initialUnselectedKeys: [],
  dataTypePlural: null,
  subTitle: null,
};

export default GroupedBarChart;
