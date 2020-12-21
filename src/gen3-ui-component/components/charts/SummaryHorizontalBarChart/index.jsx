import PropTypes from 'prop-types';
import React from 'react';
import LockedContent from '../LockedContent';
import EmptyContent from '../EmptyContent';
import helper from '../helper';
import './SummaryHorizontalBarChart.css';

// FIXME: add back in animation (https://github.com/recharts/recharts/issues/1083)
class SummaryBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  getItemColor(index) {
    if (this.props.useCustomizedColorMap) {
      return this.props.customizedColorMap[index % this.props.customizedColorMap.length];
    }
    if (this.props.color) {
      return this.props.color;
    }
    return helper.getCategoryColor(index);
  }

  toggle() {
    this.setState(prevState => ({ showMore: !prevState.showMore }));
  }

  render() {
    const barChartData = helper.calculateChartData(
      this.props.data,
      this.props.percentageFixedPoint,
    );
    let chart = null;
    if (this.props.chartIsEmpty) {
      chart = (<EmptyContent message={this.props.chartEmptyMessage} />);
    } else if (helper.shouldHideChart(this.props.data, this.props.lockValue)) {
      chart = (<LockedContent lockMessage={this.props.lockMessage} />);
    } else {
      chart = (
        <div>
          {
            barChartData.map((item, index) => {
              if (this.state.showMore || index < this.props.maximumDisplayItem) {
                return (
                  <div key={item.name} className='summary-horizontal-bar-chart__item'>
                    <div className='summary-horizontal-bar-chart__item-label'>{item.name}</div>
                    <div className='summary-horizontal-bar-chart__item-block-wrapper'>
                      <div
                        className='summary-horizontal-bar-chart__item-block'
                        style={{
                          width: `${item.widthPercentage}%`,
                          backgroundColor: this.getItemColor(index),
                        }}
                      />
                      <div className='summary-horizontal-bar-chart__item-value'>
                        { this.props.showPercentage ? `${item.percentage}%` : item.value }
                      </div>
                    </div>
                  </div>
                );
              }
              return (<React.Fragment key={item.name} />);
            })
          }
          {
            barChartData.length > this.props.maximumDisplayItem ? (
              <React.Fragment>
                {
                  this.state.showMore ? (
                    <div
                      className='summary-horizontal-bar-chart__toggle g3-link'
                      onClick={() => this.toggle()}
                      onKeyPress={() => this.toggle()}
                      role='button'
                      tabIndex={0}
                    >
                      <span>Show less</span>
                    </div>
                  ) : (
                    <div
                      className='summary-horizontal-bar-chart__toggle g3-link'
                      onClick={() => this.toggle()}
                      onKeyPress={() => this.toggle()}
                      role='button'
                      tabIndex={0}
                    >
                      {`And ${barChartData.length - this.props.maximumDisplayItem} more`}
                    </div>
                  )
                }
              </React.Fragment>
            ) : (<React.Fragment />)
          }
        </div>
      );
    }
    return (
      <div className='summary-horizontal-bar-chart'>
        <div className='summary-horizontal-bar-chart__title-box'>
          <p className='summary-horizontal-bar-chart__title h4-typo'>
            {this.props.title}
          </p>
        </div>
        {chart}
      </div>
    );
  }
}

const ChartDataShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

SummaryBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(ChartDataShape).isRequired,
  color: PropTypes.string,
  useCustomizedColorMap: PropTypes.bool,
  customizedColorMap: PropTypes.arrayOf(PropTypes.string),
  showPercentage: PropTypes.bool,
  percentageFixedPoint: PropTypes.number,
  lockValue: PropTypes.number, // if one of the value is equal to `lockValue`, lock the chart
  lockMessage: PropTypes.string,
  maximumDisplayItem: PropTypes.number,
  chartIsEmpty: PropTypes.bool,
  chartEmptyMessage: PropTypes.string,
};

SummaryBarChart.defaultProps = {
  color: undefined,
  useCustomizedColorMap: false,
  customizedColorMap: ['#3283c8'],
  showPercentage: true,
  percentageFixedPoint: 2,
  lockValue: -1,
  lockMessage: 'This chart is hidden because it contains fewer than 1000 subjects',
  maximumDisplayItem: 15,
  chartIsEmpty: false,
  chartEmptyMessage: 'Cannot render this chart because some fields don\'t apply',
};

export default SummaryBarChart;
