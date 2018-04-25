import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const IntroDiv = styled.div`
  width: 450px;
  position: relative;
`;

const IntroButton = styled.button`
  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
  margin-bottom: 75px;
`;

const IntroTitle = styled.div`
  margin-top: 75px;
  margin-bottom: 25px;
  line-height: 0.5em;
`;

const IntroText = styled.div`
  margin-top: 25px;
  padding: 10px 0px;
  text-align: left;
`;

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    return (
      <IntroDiv>
        <IntroTitle className="h1-typo">{this.props.data.heading}</IntroTitle>
        <IntroText className="high-light">{this.props.data.text}</IntroText>
        <Link to={this.props.data.link}>
          <IntroButton className="button-primary-white">
            Submit Data
          </IntroButton>
        </Link>
      </IntroDiv>
    );
  }
}

export default Introduction;
