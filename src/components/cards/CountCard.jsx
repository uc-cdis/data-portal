import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CountBox from './CountBox';

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
                <CountBox key={item.label} label={item.label} value={item.value} />
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
