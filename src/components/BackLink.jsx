import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import dictIcons from '../img/icons/index';
import IconComponent from '../components/Icon';

const BACK_CAPTION = 'Back to data overview';

export const BackComponent = styled.div`
  display: inline;
  padding-right: 15px;
`;

class BackLink extends Component {
  render() {
    return (
      <Link to={'/files'}>
        <br />
        <BackComponent>
          <IconComponent
            dictIcons={dictIcons}
            iconName="back"
            height="12px"
          />
        </BackComponent>
        <BackComponent>{BACK_CAPTION}</BackComponent>
      </Link>
    );
  }
}

export default BackLink;
