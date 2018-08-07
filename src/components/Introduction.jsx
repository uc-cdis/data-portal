import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import IconicLink from './buttons/IconicLink';

const IntroDiv = styled.div`
  width: 450px;
  position: relative;
`;

const IntroTitle = styled.div`
  margin-bottom: 25px;
  line-height: 1.0em;
`;

const IntroText = styled.div`
  padding: 10px 0px;
  text-align: left;

  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
  margin-bottom: 25px;
`;

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
  };

  render() {
    return (
      <IntroDiv>
        <IntroTitle className='h1-typo'>{this.props.data.heading}</IntroTitle>
        <IntroText className='high-light'>{this.props.data.text}</IntroText>
        <IconicLink
          link={this.props.data.link}
          dictIcons={this.props.dictIcons}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '75px',
          }}
          icon='upload'
          iconColor='#'
          caption='Submit Data'
        />
      </IntroDiv>
    );
  }
}

export default Introduction;
