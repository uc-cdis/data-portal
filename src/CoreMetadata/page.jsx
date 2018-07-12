import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import { ReduxCoreMetadataHeader } from './reduxer';
import { ReduxFileTypePicture } from './reduxer';
import { ReduxCoreMetadataTable } from './reduxer';
import dictIcons from '../img/icons/coremetadata';
import IconComponent from '../components/Icon';

const BACK_CAPTION = 'Back to data overview'

export const Column = styled.div`
  float: left;
  width: 50%;
  padding: 20px 50px 20px 0px;
`;

export const BackComponent = styled.div`
  display: inline;
  padding-right: 15px;
`;

class BackLink extends Component {
  render() {
    return (
      <Link to={'/files'}>
        <br/>
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

class CoreMetadataPage extends Component {
  render() {
    return (
      <div>
        <BackLink/>
        <div>
          <Column><ReduxFileTypePicture dictIcons={dictIcons}/></Column>
          <Column><ReduxCoreMetadataHeader/></Column>
        </div>
        <ReduxCoreMetadataTable/>
      </div>
    );
  }
}

export default CoreMetadataPage;
