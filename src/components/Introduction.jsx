import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import SubmitButton from './SubmitButton';

const IntroDiv = styled.div`
  width: 450px;
  position: relative;
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

  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
  margin-bottom: 75px;
`;

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
  };

  render() {
    return (
      <IntroDiv>
        <IntroTitle className="h1-typo">{this.props.data.heading}</IntroTitle>
        <IntroText className="high-light">{this.props.data.text}</IntroText>
        <SubmitButton
          link={this.props.data.link}
          dictIcons={this.props.dictIcons}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "25px",
            marginBottom: "75px"
          }}
        />
      </IntroDiv>
    );
  }
}

export default Introduction;
