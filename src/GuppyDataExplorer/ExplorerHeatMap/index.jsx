import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import LockedContent from '@gen3/ui-component/dist/components/charts/LockedContent';
import { capitalizeFirstLetter } from '../../utils';
import { GuppyConfigType } from '../configTypeDef';
import './ExplorerHeatMap.less';

function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
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
    const transformedData = [];
    let data = this.props.rawData;
    if (data && data.length) {
      const numberOfDecimals = 1;
      const precision = 10 ** numberOfDecimals;
      this.maxCellValue = 0;
      const totalCount = this.props.filter[this.props.mainYAxisVar] ?
        this.props.filter[this.props.mainYAxisVar].selectedValues.length : 0;

      // convert string keys to numbers if needed (avoids 10 < 2 when sorting)
      if (this.props.guppyConfig.mainFieldIsNumeric) {
        for (let i = 0; i < data.length; i += 1) {
          data[i].key = parseFloat(data[i].key, 10);
        }
      }

      // sort the data by key (x axis values on the graph must be sorted)
      data = data.sort((a, b) => {
        if (a.key > b.key) return 1;
        if (a.key < b.key) return -1;
        return 0;
      });

      data.forEach((details) => {
        const xIndex = details.key;
        const fieldToMissingCount = details.missingFields.reduce((res, x) => {
          res[x.field] = x.count;
          return res;
        }, {});

        yAxisVars.forEach((fieldName) => {
          let rate;
          if (fieldName === this.props.mainYAxisVar) {
            rate = details.count / totalCount;
          } else {
            rate = 1 - (fieldToMissingCount[fieldName] / details.count);
          }
          // Note: if we use rate='-' for zeros, it looks clean but there
          // is no tooltip about which x/y is zero
          rate = round(rate, 2);
          transformedData.push([
            xIndex,
            yAxisVars.indexOf(fieldName),
            rate, // round with 2 decimals in cells
          ]);
          if (rate > this.maxCellValue) {
            // round UP with 1 decimal in legend
            this.maxCellValue = Math.ceil(rate * precision) / precision;
          }
        });
      });
    }
    return transformedData;
  };

  /**
   * See echarts docs at https://echarts.apache.org/en/option.html
   */
  getHeatMapOptions = (data, xAxisVarTitle, yAxisVars, yAxisVarsMapping, colorRange) => ({
    tooltip: { // displayed when hover on cell
      position: 'top',
      formatter(params) {
        // Note: params.data = [x, y, value]
        const yField = yAxisVars[params.data[1]];
        const mappingEntry = yAxisVarsMapping && yAxisVarsMapping.find(
          i => i.field === yField,
        );
        const yAxisVar = (mappingEntry && mappingEntry.name) || yField;
        return `Variable: ${capitalizeFirstLetter(yAxisVar)}<br/>${xAxisVarTitle}: ${params.data[0]}<br/>Data availability: ${params.data[2]}`;
      },
    },
    grid: {
      containLabel: true, // axis labels are cut off if not grid.containLabel
      // distance to edges of the box:
      top: 0,
      bottom: 80, // space for x axis title and legend
      left: '5%',
      right: '5%',
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      name: xAxisVarTitle,
      nameLocation: 'middle',
    },
    yAxis: {
      type: 'category',
      data: yAxisVars.map((field) => {
        const fieldMappingEntry = yAxisVarsMapping.find(i => i.field === field);
        return capitalizeFirstLetter((fieldMappingEntry && fieldMappingEntry.name) || field);
      }),
      axisTick: {
        show: false,
      },
      inverse: true,
    },
    visualMap: { // legend
      min: 0,
      max: this.maxCellValue, // round up (1 decimal) of max value
      precision: 2, // 2 decimals in label
      calculable: true, // handles on legend to adjust selected range
      orient: 'horizontal',
      left: 'center', // horizontal alignment
      align: 'right', // position of bar relatively to handles and label
      inRange: {
        // [min value color, max value color]:
        color: colorRange || ['#EBF7FB', '#3188C6'],
      },
    },
    series: [{
      type: 'heatmap',
      data,
    }],
  });

  render() {
    // y axis items in alpha order. mainYAxisVar (i.e. "subject_id") on top
    const yAxisVars = [this.props.mainYAxisVar].concat(
      this.props.guppyConfig.aggFields.sort(),
    );
    const yAxisVarsMapping = this.props.guppyConfig.fieldMapping;
    const xAxisVarTitle = capitalizeFirstLetter(this.props.guppyConfig.mainFieldTitle);
    const data = this.getTransformedData(yAxisVars);
    const height = `${(yAxisVars.length * 17) + 80}px`; // default is 300px

    return (
      <React.Fragment>
        {
          (data && data.length) || this.props.isLocked ? (
            <div className='explorer-heat-map'>
              <div className='explorer-heat-map__title--align-center h4-typo'>
                Data availability
              </div>
              {
                this.props.isLocked ? (
                  <div>
                    <LockedContent lockMessage={this.props.lockMessage} />
                  </div>
                ) : (
                  <div>
                    <ReactEcharts
                      option={this.getHeatMapOptions(
                        data, xAxisVarTitle, yAxisVars, yAxisVarsMapping,
                        this.props.guppyConfig.colorRange,
                      )}
                      style={{ height }}
                    />
                  </div>
                )
              }
            </div>
          ) : null
        }
      </React.Fragment>
    );
  }
}

ExplorerHeatMap.propTypes = {
  rawData: PropTypes.array, // inherited from GuppyWrapper
  filter: PropTypes.object, // inherited from GuppyWrapper
  guppyConfig: GuppyConfigType,
  mainYAxisVar: PropTypes.string.isRequired,
  isLocked: PropTypes.bool,
  lockMessage: PropTypes.string.isRequired,
};

ExplorerHeatMap.defaultProps = {
  rawData: [],
  filter: {},
  guppyConfig: {},
  isLocked: false,
};

export default ExplorerHeatMap;
