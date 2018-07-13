import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CountBox from './CountBox';

const DataSummaryCardGroupWrapper = styled.div`
  display: flex;
  &.connected-count-card-wrapper {
    width: 100%;
  }
`;

const SummaryCard = styled.div`
  display: inline-block;
  background-color: #ffffff;
  height: 97px;
  flex-grow: 1;
  flex-basis: ${props => props.widthPercentage}%;
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

const SummaryCardLeftBorder = styled.div`
  position: absolute;
  top: 7px;
  bottom: 7px;
`;

const SubCountBoxesWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const SubCountBoxWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const SummarySubCardLeftBorder = styled.div`
  position: absolute;
  top: 28px;
  bottom: 28px;
`;

/**
 * Little card with a bunch of counters on it for cases, experiments, files, ...
 */
class DataSummaryCardGroup extends Component {
  render() {
    const widthPercentage = 100 / this.props.summaryItems.length;
    return (
      <DataSummaryCardGroupWrapper className={'data-summary-card-group '.concat(this.props.connected ? 'connected-data-summary-card-group' : 'separated-data-summary-card-group')}>
        {
          this.props.summaryItems.map(
            (item, index) => (
              <SummaryCard key={`card-${item.label || item[0].label}`} widthPercentage={widthPercentage}>
                {this.props.connected && index > 0
                  && <SummaryCardLeftBorder className="left-silver-border" />
                }
                {
                  !item.length ? (<CountBox label={item.label} value={item.value} align="center" />) : (
                    <SubCountBoxesWrapper>
                      {
                        item.map((subItem, subIndex) => (
                          <SubCountBoxWrapper key={`sub-count-box-${subItem.label}`}>
                            {subIndex > 0
                              && <SummarySubCardLeftBorder className="left-silver-border" />
                            }
                            <CountBox label={subItem.label} value={subItem.value} align="center" />
                          </SubCountBoxWrapper>
                        ))
                      }
                    </SubCountBoxesWrapper>
                  )
                }
              </SummaryCard>
            ),
          )
        }
      </DataSummaryCardGroupWrapper>
    );
  }
}

/**
summaryItems format example : [
  { label: 'test1', value: 123 },
  { label: 'test2', value: 234 },
  { label: 'test3', value: 345 },
  { label: 'test4', value: 123 },
  { label: 'test5', value: 234 },
  { label: 'test6', value: 345 },
  [ // for now we support 2nd hierarchy labels
    { label: 'test7', value: 345 },
    { label: 'test8', value: 345 },
  ],
  { label: 'test9', value: 345 },
];
*/
DataSummaryCardGroup.propTypes = {
  summaryItems: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  connected: PropTypes.bool,
};

DataSummaryCardGroup.defaultProps = {
  connected: false,
};

export default DataSummaryCardGroup;
