import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import SummaryPieChart from './SummaryPieChart';
import SummaryBarChart from './SummaryBarChart';

const SummaryChartGroupWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const SummaryChart = styled.div`
  display: inline-block;
  background-color: #ffffff;
  flex-grow: 1;
  margin: 0;
  position: relative;
`;

const SummaryChartLeftBorder = styled.div`
  position: absolute;
  top: 10px;
  bottom: 10px;
  border-left: solid gray 1px;
`;

class SummaryChartGroup extends Component {
  render() {
    return (
      <SummaryChartGroupWrapper>
        {
          this.props.summaries.map(
            (item, index) => (
              <SummaryChart key={'summary-chart-'.concat(index)}>
                {
                  index > 0 && <SummaryChartLeftBorder />
                }
                {
                  item.type === 'pie'
                    ? <SummaryPieChart data={item.data} title={item.title} />
                    : <SummaryBarChart data={item.data} title={item.title} vertical monoColor />
                }
              </SummaryChart>

            ),
          )
        }
      </SummaryChartGroupWrapper>
    );
  }
}

SummaryChartGroup.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SummaryChartGroup;
