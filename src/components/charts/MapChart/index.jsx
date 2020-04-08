import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
// import Slider from 'react-slick';
import { Range } from 'rc-slider';
import { fetchWithCreds } from '../../../actions';
import { colorsForCharts, guppyGraphQLUrl } from '../../../localconf';

import './MapChart.less';

require('echarts/map/js/world.js');

// TODO
// how to display when logged out?

class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: null,
      valuesSet: null,
    };
  }

  getOption = () => {
    // const maxValue = this.props.rawData.reduce((max, p) => p.confirmed > max ? p.confirmed : max, this.props.rawData[0].confirmed);
    const maxValue = Math.max(...this.props.rawData.map(o => o.confirmed));
    const minDotSize = 3;
    const maxDotSize = 40;

    const series = [];
    // this.props.rawData.forEach(function (item, i) {
    //   console.log(item)
    series.push({
      name: 'Confirmed cases', // TODO one name/color per severity?
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 2,
      rippleEffect: {
        brushType: 'fill',
        scale: 2,
      },
      // label: {
      //     normal: {
      //         show: true,
      //         position: 'right',
      //         formatter: '{b}'
      //     }
      // },
      symbolSize(item) {
        const val = item[2];
        if (val == 0) {
          return 0;
        }
        return Math.max(minDotSize, val * maxDotSize / maxValue);
      },
      itemStyle: {
        normal: {
          color: '#ffffff',
        },
      },
      data: this.props.rawData.reduce((res, item) => {
        const label = (item.province_state ? `${item.province_state}, ` : '') + item.country_region;
        if (item.date == '2020-03-26T00:00:00') {
          res.push({
            name: label,
            value: [item.longitude, item.latitude, item.confirmed],
          });
        }
        return res;
      }, []),
      // data: {
      //   name: item.country_region,
      //   value: [100,20, 100] //[item.latitude, item.longitude]
      // }
    });
    // });
    // console.log(series)

    const option = {
      backgroundColor: '#404a59',
      title: {
        text: 'COVID-19',
        subtext: 'Confirmed cases',
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: { // TODO maybe remove?
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        data: ['Confirmed cases'],
        textStyle: {
          color: '#fff',
        },
        selectedMode: 'single',
      },
      geo: {
        map: 'world',
        // boundingCoords: [
        //     // [lng, lat] of left-top corner
        //     [-180, 90],
        //     // [lng, lat] of right-bottom corner
        //     [180, -90]
        // ],
        scaleLimit: {
          min: 1, // do not allow zooming out more than whole world map
        },
        label: {
          emphasis: {
            show: false,
          },
        },
        roam: true,
        itemStyle: {
          normal: { // #421C52
            areaColor: '#323c48',
            borderColor: '#404a59',
          },
          emphasis: {
            areaColor: '#2a333d',
          },
        },
      },
      series,
    };
    return option;
  };

  componentDidMount() {
    const typeName = this.props.dataType;
    const xAxisProp = this.props.xAxisProp;
    const yAxisProp = this.props.yAxisProp;
    // this.downloadData(typeName, xAxisProp, yAxisProp)
    //   .then(({ datasets, valuesSet }) => {
    //     this.setState({ datasets, valuesSet });
    //   });
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
    // console.log("rawData", this.props.rawData)

    // if (!this.state.datasets) return null;
    // const legendSelectedObj = this.props.initialUnselectedKeys.reduce((acc, cur) => {
    //   acc[cur] = false;
    //   return acc;
    // }, {});
    // const dataTypePlural = this.props.dataTypePlural || `${this.props.dataType}s`;
    // const defaultSubTitle = `Number of ${dataTypePlural} by ${this.props.yAxisProp}`;
    // const option = {
    //   title: {
    //     text: this.props.chartTitle,
    //     subtext: this.props.subTitle ? this.props.subTitle : defaultSubTitle,
    //     textStyle: {
    //       fontSize: 12,
    //       color: '#999',
    //     },
    //     left: 'center',
    //   },
    //   yAxis: {
    //     data: Array.from(this.state.valuesSet),
    //     axisTick: false,
    //     axisLabel: {
    //       formatter: (value) => {
    //         const len = 15;
    //         return value.length > len ? `${value.substring(0, len - 3)}...` : value;
    //       },
    //     },
    //   },
    //   xAxis: {
    //     name: this.props.xAxisProp,
    //     nameLocation: 'center',
    //   },
    //   tooltip: {
    //     axisPointer: {
    //       type: 'shadow',
    //     },
    //     trigger: 'axis',
    //   },
    //   legend: {
    //     data: this.state.datasets.map(d => d.key),
    //     bottom: 0,
    //     selected: legendSelectedObj,
    //   },
    //   grid: {
    //     top: 40,
    //     bottom: 50,
    //     right: 25,
    //     left: 100,
    //   },
    //   backgroundColor: '#f5f5f5',
    //   series: this.state.datasets.map((d, i) => ({
    //     name: d.key,
    //     type: 'bar',
    //     data: d.dataset,
    //     stack: d.key,
    //     barGap: 0,
    //     color: colorsForCharts.categorical9Colors[i % colorsForCharts.categorical9Colors.length],
    //   })),
    // };
    // if (this.props.logBase && this.props.logBase !== 1) {
    //   option.xAxis.type = 'log';
    //   option.xAxis.logBase = this.props.logBase;
    // }

    const sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };

    return (
      <div className='blah'>
        <ReactEcharts
          option={this.getOption()}
          style={{ height: '500px', width: '100%' }}
        />
        <Range
          className='g3-range-filter__slider'
          min={1}
          max={4}
          value={[3, 3.5]}
          // onChange={e => this.onSliderChange(e)}
          // onAfterChange={() => this.onAfterSliderChange()}
          step={0.5}
        />
      </div>
    );
  }
}

MapChart.propTypes = {
  rawData: PropTypes.array, // inherited from GuppyWrapper
  // chartTitle: PropTypes.string.isRequired,
  // dataType: PropTypes.string.isRequired,
  // yAxisProp: PropTypes.string.isRequired,
  // xAxisProp: PropTypes.string.isRequired,
  constrains: PropTypes.object,
  logBase: PropTypes.number,
  initialUnselectedKeys: PropTypes.arrayOf(PropTypes.string),
  dataTypePlural: PropTypes.string,
  subTitle: PropTypes.string,
};

MapChart.defaultProps = {
  rawData: [],
  constrains: {},
  logBase: null,
  initialUnselectedKeys: [],
  dataTypePlural: null,
  subTitle: null,
};

export default MapChart;
