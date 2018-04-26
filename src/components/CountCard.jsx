import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Title = styled.div`
  height: 120px;
  width: 450px;
  vertical-align: top;
  padding-top: 10px;
`;

const TopBoard = styled.div`
  float: left;
  width: 1220px;
  display: inline-flex;
`;

const CountBox = styled.div`
  display: inline-block;
  &:first-child {
    margin-left: 0px;
  }
  float: left;
  background-color: #ffffff;
  width: 180px;
  height: 120px;
  padding: 20px;
  margin-left: 15px;
  position: relative;
`;

const CountBoxTitle = styled.div`
  margin-bottom: 15px;
  vertical-align: top;
`;

const CountBoxNumber = styled.div`
  position: absolute;
  vertical-align: bottom;
  bottom: 20px;
`;


/**
 * Little card with a bunch of counters on it for cases, experiments, files, ...
 */
class CountCard extends Component {
  render() {
    return (
      <TopBoard>
        <Title className="h1-typo">
          Data Submission Summary
        </Title>
        <div style={{ display: 'flex' }}>
          {
            this.props.countItems.map(
              item => (
                <CountBox key={item.label}>
                  <CountBoxTitle className="h4-typo">
                    {item.label}
                  </CountBoxTitle>
                  <CountBoxNumber className="special-number">
                    {item.value}
                  </CountBoxNumber>
                </CountBox>
              ),
            )
          }
        </div>
      </TopBoard>
    );
  }
}

CountCard.propTypes = {
  countItems: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CountCard;
