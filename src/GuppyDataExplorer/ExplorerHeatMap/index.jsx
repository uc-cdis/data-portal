import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import { EditorBorderRight } from 'material-ui/svg-icons';
import './ExplorerHeatMap.less';

let yAxisVars = ["subject_id"].concat([ // TODO get from config
  "status",
  "age_at_visit",
  "abc",
  "abcv",
  "drug_used",
  "thrpy",
  "thrpyv",
  "trz",
  "trzv",
  "cd4dt",
  "chol",
  "leu2n",
  "viral_load",
  "cocuse",
  "drinkcat",
  "eductn",
  "emotl",
  "employ",
  "income",
  "insurance",
  "paidsex"
].sort()); // alphabetical order. "subject_id" on top

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

class ExplorerHeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.maxCellValue = 0, // updated when data is received
    this.state = {
      xAxisVar: 'visit_number', // TODO: configurable
      fakeData: true // TODO remove
    };
  }

  /**
   * @returns transformed data in format [[x index, y index, value], ...]
   */
  getTransformedData = () => {
    let transformed_data = [];
    // rawData is either [] (no data) or {...} (data)
    if (this.props.rawData && this.props.rawData.length !== 0) {
      const number_of_decimals = 1;
      const precision = Math.pow(10, number_of_decimals);
      this.maxCellValue = 0;

      let data = this.props.rawData;

      // convert string keys to ints
      for (var i in data) {
        data[i].key = parseInt(data[i].key);
      }

      // sort the data by key (x axis values on the graph must be sorted)
      data = data.sort(
        (a, b) => a.key > b.key ? 1 : a.key < b.key ? -1 : 0
      );

      data.map(details => {
        let xIndex = details.key;
        let fieldToMissingCount = details.missingFields.reduce(function(res, x) {
          res[x.field] = x.count;
          return res;
        }, {});

        yAxisVars.map(fieldName => {
          if (typeof fieldToMissingCount[fieldName] === 'undefined') {
            if (fieldName !== "subject_id") { // TODO remove
              // TODO remove this if not needed anymore
              console.warn(`Heatmap field "${fieldName}" is not in nested aggregation data: ignoring`)
              yAxisVars.pop(fieldName);
            }
          }
          else {
            let rate;
          //   if (fieldName == "subject_id") { // TODO: configurable
          //     rate = details[fieldName].count / this.props.nodeTotalCount;
          //   }
          //   else {
              rate = 1 - fieldToMissingCount[fieldName] / details.count;
              if (this.state.fakeData)
                rate = Math.random() * 0.7; // TODO remove!
          //   }
            // Note: if '-' for zeros, there is no tooltip about which x/y is zero
            rate = round(rate, 2); // || '-'; // 2 decimals / zero -> empty
            transformed_data.push([
              xIndex,
              yAxisVars.indexOf(fieldName),
              rate // round with 2 decimals in cells
            ]);
            if (rate > this.maxCellValue) {
              // round UP with 1 decimal in legend
              this.maxCellValue = Math.ceil(rate * precision) / precision;
            }
          }
        });
      });
    }
    return transformed_data;
  };

  /**
   * See echarts docs at https://echarts.apache.org/en/option.html
   */
  getHeatMapOptions = (data) => {
    let xAxisVar = this.state.xAxisVar;
    return {
      tooltip: {
        position: 'top',
        formatter: function (params) {
          // params = [x, y, value]
          let yAxisVar = yAxisVars[params.data[1]];
          return `variable: ${yAxisVar}<br/>${xAxisVar}: ${params.data[0]}<br/>data percentage: ${params.data[2]}`;
        }
      },
      // toolbox: {
      //   dataZoom: {
      //   }
      // },
      grid: {
        containLabel: true, // axis labels are cut off if not grid.containLabel
        // distance to edges of the box:
        top: 0,
        bottom: 80, // space for x axis title and legend
        left: "5%",
        right: "5%"
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        name: xAxisVar,
        nameLocation: 'middle'
      },
      yAxis: {
        type: 'category',
        data: yAxisVars,
        axisTick: {
          show: false
        },
        inverse: true
      },
      visualMap: {
        min: 0,
        max: this.maxCellValue, // round up (1 decimal) of max value
        precision: 2, // 2 decimals in label
        calculable: true, // handles on legend to adjust selected range
        orient: 'horizontal',
        left: 'center', // horizontal alignment
        align: 'right', // position of bar relatively to handles and label
        inRange: {
          color: ['#EBF7FB', '#3188C6'] // [smallest value, greatest value]
        }
      },
      series: [{
        type: 'heatmap',
        data: data
      }]
    };
  };
  
  render() {
    let data = this.getTransformedData();
    const height = "450px"; // TODO need to display all yaxis vars https://github.com/hustcc/echarts-for-react/issues/208
    return (
      <React.Fragment>
      {
        data && data.length && (
          <div className={`explorer-heat-map`}>
            <div className={'checkbox'}>
              <input
                // TODO remove
                type='checkbox'
                value={this.state.fakeData}
                checked={this.state.fakeData}
                onChange={
                  () => this.setState({fakeData: !this.state.fakeData})
                }
              /> use fake data
            </div>

            <div className={`explorer-heat-map__title--align-center h4-typo`}>
              Data availability
            </div>
            <div className='explorer-heat-map__chart'>
              <ReactEcharts
                option={this.getHeatMapOptions(data)}
                style={{height}}
              />
            </div>
          </div>
        )
      }
      </React.Fragment>
    );
  }
}

ExplorerHeatMap.propTypes = {
  rawData: PropTypes.array, // inherited from GuppyWrapper
  nodeTotalCount: PropTypes.number, // Note: total number of subject_ids
};

ExplorerHeatMap.defaultProps = {
  nodeTotalCount: null,
};

export default ExplorerHeatMap;
