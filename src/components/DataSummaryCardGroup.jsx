import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DataSummaryCardGroupWrapper = styled.div`
  display: flex;
  &.connected-count-card-wrapper {
    width: 100%;
  }
`;

const SummaryCard = styled.div`
  display: inline-block;
  float: left;
  background-color: #ffffff;
  height: 120px;
  flex-grow: 1;
  .separated-data-summary-card-group & {
    margin-left: 15px;
    &:first-child {
      margin-left: 0px;
    }
  }
  .connected-data-summary-card-group & {
    margin: 0;
    &:first-child {
      border: none;
    }
  }
  position: relative;
`;

const SummaryCardTitle = styled.div`
  text-align: center;
`;

const SummaryCardNumber = styled.div`
  text-align: center;
`;

const SummaryCardLeftBorder = styled.div`
  position: absolute;
  top: 10px;
  bottom: 10px;
  border-left: solid gray 1px;
`;

/**
 * Little card with a bunch of counters on it for cases, experiments, files, ...
 */
class DataSummaryCardGroup extends Component {
  render() {
    return (
      <DataSummaryCardGroupWrapper className={'data-summary-card-group '.concat(this.props.connected ? 'connected-data-summary-card-group' : 'separated-data-summary-card-group')}>
        {
          this.props.summaryItems.map(
            (item, index) => (
              <SummaryCard key={item.label}>
                {index > 0
                  && <SummaryCardLeftBorder />
                }
                <SummaryCardTitle className="h4-typo">
                  {item.label}
                </SummaryCardTitle>
                <SummaryCardNumber className="special-number">
                  {item.value}
                </SummaryCardNumber>
              </SummaryCard>
            ),
          )
        }
      </DataSummaryCardGroupWrapper>
    );
  }
}

DataSummaryCardGroup.propTypes = {
  summaryItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  connected: PropTypes.bool,
};

DataSummaryCardGroup.defaultProps = {
  connected: false,
};

export default DataSummaryCardGroup;
