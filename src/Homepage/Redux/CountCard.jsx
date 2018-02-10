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
          <li>
            <Icon><i className="material-icons">{ this.props.icons[0] }</i></Icon>
            <Count>{ this.props.count1.value }</Count>
            <span>{this.props.count1.label}</span>
          </li>
          <li>
            <Icon><i className="material-icons">{ this.props.icons[1] }</i></Icon>
            <Count>{ this.props.count2.value }</Count>
            <span>{this.props.count2.label}</span>
          </li>
          <li>
            <Icon><i className="material-icons">{ this.props.icons[2] }</i></Icon>
            <Count>{ this.props.count3.value }</Count>
            <span>{this.props.count3.label}</span>
          </li>
          <li>
            <Icon><i className="material-icons">{ this.props.icons[3] }</i></Icon>
            <Count>{ this.props.count4.value }</Count>
            <span>{this.props.count4.label}</span>
          </li>
        </ul>
      </CountBox>
    );
  }
}

CountCard.propTypes = {
  count1: PropTypes.object.isRequired,
  count2: PropTypes.object.isRequired,
  count3: PropTypes.object.isRequired,
  count4: PropTypes.object.isRequired,
  icons: PropTypes.array,
};

CountCard.defaultProps = {
  icons: [],
};

export default CountCard;
