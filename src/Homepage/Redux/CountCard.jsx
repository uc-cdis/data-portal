import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { localTheme } from '../../localconf';

const CountBox = styled.div`
  float: left;
  width: 40%;
  height: 280px;
  padding: 20px;
  border: 2px solid ${localTheme['summary.borderColor']};
  border-top: 3px solid ${localTheme['summary.borderTopColor']};
  min-width:300px;
  h4 {
    margin-top: 0px;
  }
  ul {
    width: 100%;
    overflow: hidden;
    li {
      float: left;
      width: 50%;
      padding-left: 10px;
      padding-top: 10px;
    }
  }
`;

const Count = styled.span`
  color: ${localTheme['summary.countColor']};
  margin-right: 10px;
`;

const Icon = styled.div`
  color: ${localTheme['summary.iconColor']};
  height: 24px;
  margin-top: 10px;
  margin-left: 20px;
`;

/**
 * Little card with a bunch of counters on it for cases, experiments, files, ...
 */
class CountCard extends Component {
  render() {
    return (
      <CountBox>
        <h4>
          Project Submission Summary
        </h4>
        <ul>
          {
            this.props.countItems.map(
              (item, i) => (
                <li key={item.label}>
                  <Icon><i className="material-icons">{ this.props.icons[i] }</i></Icon>
                  <Count>{item.value}</Count>
                  <span>{item.label}</span>
                </li>
              ),
            )
          }
        </ul>
      </CountBox>
    );
  }
}

CountCard.propTypes = {
  countItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  icons: PropTypes.array,
};

CountCard.defaultProps = {
  icons: [],
};

export default CountCard;
