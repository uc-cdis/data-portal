import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import SummaryPieChart from './SummaryPieChart';
import SummaryBarChart from './SummaryBarChart';

const SummaryChartGroupWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: ${props => props.width};
`;

const SummaryChart = styled.div`
  display: inline-block;
  background-color: #ffffff;
  flex-basis: 0;
  flex-grow: 1;
  margin: 0;
  position: relative;
`;

const SummaryChartLeftBorder = styled.div`
  position: absolute;
  top: 10px;
  bottom: 10px;
`;

class SummaryChartGroup extends Component {
  render() {
    const width = (typeof this.props.width === 'number') ? `${this.props.width}px` : this.props.width;
    return (
      <SummaryChartGroupWrapper width={width}>
        {
          this.props.summaries.map((item, index) => (
            <SummaryChart key={'summary-chart-'.concat(index)}>
              {
                index > 0 && <SummaryChartLeftBorder className="left-silver-border" />
              }
              {
                item.type === 'pie'
                  ? (
                    <SummaryPieChart
                      data={item.data}
                      title={item.title}
                      localTheme={this.props.localTheme}
                    />
                  ) : (
                    <SummaryBarChart
                      data={item.data}
                      title={item.title}
                      localTheme={this.props.localTheme}
                      vertical
                      monoColor
                    />
                  )
              }
            </SummaryChart>
          ))
        }
      </SummaryChartGroupWrapper>
    );
  }
}

SummaryChartGroup.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  localTheme: PropTypes.object.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SummaryChartGroup.defaultProps = {
  width: '100%',
};

export default SummaryChartGroup;
