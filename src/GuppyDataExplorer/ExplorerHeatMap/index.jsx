import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import { capitalizeFirstLetter } from '../../utils';
import './ExplorerHeatMap.less';

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

class ExplorerHeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.maxCellValue = 0; // updated when data is received
  }

  /**
   * @returns transformed data in format [[x index, y index, value], ...]
   */
  getTransformedData = (yAxisVars) => {
    let transformed_data = [];
    if (this.props.rawData && this.props.rawData.length) {
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
          let rate;
          if (fieldName == this.props.mainYAxisVar) {
            const totalCount = this.props.filter[this.props.mainYAxisVar].selectedValues.length;
            rate = details.count / totalCount;
          }
          else {
            rate = 1 - fieldToMissingCount[fieldName] / details.count;
          }
          // Note: if '-' for zeros, there is no tooltip about which x/y is zero
          rate = round(rate, 2); // 2 decimals / zero -> empty
          transformed_data.push([
            xIndex,
            yAxisVars.indexOf(fieldName),
            rate // round with 2 decimals in cells
          ]);
          if (rate > this.maxCellValue) {
            // round UP with 1 decimal in legend
            this.maxCellValue = Math.ceil(rate * precision) / precision;
          }
        });
      });
    }
    return transformed_data;
  };

  /**
   * See echarts docs at https://echarts.apache.org/en/option.html
   */
  getHeatMapOptions = (data, xAxisVarTitle, yAxisVars, yAxisVarsMapping) => {
    return {
      tooltip: {
        position: 'top',
        formatter: function (params) {
          // Note: params.data = [x, y, value]
          const yField = yAxisVars[params.data[1]];
          const mappingEntry = yAxisVarsMapping && yAxisVarsMapping.find(
            i => i.field === yField
          );
          const yAxisVar = mappingEntry && mappingEntry.name || yField;
          return `Variable: ${capitalizeFirstLetter(yAxisVar)}<br/>${xAxisVarTitle}: ${params.data[0]}<br/>Data availability: ${params.data[2]}`;
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
        name: xAxisVarTitle,
        nameLocation: 'middle'
      },
      yAxis: {
        type: 'category',
        data: yAxisVars.map(field => {
          const fieldMappingEntry = yAxisVarsMapping.find(i => i.field === field);
          return capitalizeFirstLetter(fieldMappingEntry && fieldMappingEntry.name || field);
        }),
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
    // y axis items in alpha order. mainYAxisVar (i.e. "subject_id") on top
    const xAxisVarTitle = this.props.guppyConfig.mainFieldTitle;
    const yAxisVars = [this.props.mainYAxisVar].concat(
      this.props.guppyConfig.aggFields.sort()
    );
    const yAxisVarsMapping = this.props.guppyConfig.fieldMapping;
    const data = this.getTransformedData(yAxisVars);
    const height = "450px"; // TODO need to display all yaxis vars https://github.com/hustcc/echarts-for-react/issues/208
  
    return (
      <React.Fragment>
      {
        data && data.length && (
          <div className={`explorer-heat-map`}>
            <div className={`explorer-heat-map__title--align-center h4-typo`}>
              Data availability
            </div>
            <div className='explorer-heat-map__chart'>
              <ReactEcharts
                option={this.getHeatMapOptions(data, xAxisVarTitle, yAxisVars, yAxisVarsMapping)}
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
  filter: PropTypes.object, // inherited from GuppyWrapper
  mainYAxisVar: PropTypes.string.isRequired,
};

ExplorerHeatMap.defaultProps = {
  rawData: [],
}

export default ExplorerHeatMap;
