import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CountBox from './CountBox';

const DataSummaryCardGroupWrapper = styled.div`
  display: flex;
  width: ${props => props.width};
  flex-basis: ${props => props.width};
`;

const SummaryCard = styled.div`
  display: inline-block;
  background-color: #ffffff;
  height: ${props => props.height}px;
  flex-grow: 1;
  flex-basis: 0;
  .separated & {
    margin-left: 15px;
    &:first-child {
      margin-left: 0px;
    }
  }
  .connected & {
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
    const totalWidth = typeof this.props.width === 'string' || `${this.props.width}px`;
    return (
      <DataSummaryCardGroupWrapper className={this.props.connected ? 'connected' : 'separated'} width={totalWidth}>
        {
          this.props.summaryItems.map((item, index) => (
            <SummaryCard key={index} height={this.props.height}>
              {this.props.connected && index > 0
                && <SummaryCardLeftBorder className="left-silver-border" />
              }
              {
                !item.length ? (
                  <CountBox
                    label={item.label}
                    value={item.value}
                    align={this.props.align}
                  />
                ) : (
                  <SubCountBoxesWrapper>
                    {
                      item.map((subItem, subIndex) => (
                        <SubCountBoxWrapper key={subIndex}>
                          {subIndex > 0
                            && <SummarySubCardLeftBorder className="left-silver-border" />
                          }
                          <CountBox
                            label={subItem.label}
                            value={subItem.value}
                            align={this.props.align}
                          />
                        </SubCountBoxWrapper>
                      ))
                    }
                  </SubCountBoxesWrapper>
                )
              }
            </SummaryCard>
          ))
        }
      </DataSummaryCardGroupWrapper>
    );
  }
}

const summaryValueShape = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.number,
});
const summarySubValueShape = PropTypes.arrayOf(summaryValueShape);
DataSummaryCardGroup.propTypes = {
  summaryItems: PropTypes.arrayOf(PropTypes.oneOfType([
    summaryValueShape,
    summarySubValueShape,
  ])).isRequired,
  connected: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'center']),
  width: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  height: PropTypes.number,
};

DataSummaryCardGroup.defaultProps = {
  connected: false,
  align: 'center',
  width: '100%',
  height: 97,
};

export default DataSummaryCardGroup;
