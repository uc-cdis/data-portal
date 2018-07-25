import React, { Component } from 'react';
import styled from 'styled-components';
import BackLink from '../components/BackLink';
import { ReduxCoreMetadataHeader } from './reduxer';
import { ReduxFileTypePicture } from './reduxer';
import { ReduxCoreMetadataTable } from './reduxer';
import dictIcons from '../img/icons/file-icons/file-icons';

export const ColumnL = styled.div`
  float: left;
  width: 50%;
  padding: 20px 25px 20px 0px;
`;

export const ColumnR = styled.div`
  float: left;
  width: 50%;
  padding: 20px 0px 20px 25px;
`;

class CoreMetadataPage extends Component {
  render() {
    return (
      <div>
        <BackLink />
        <div>
          <ColumnL>
            <ReduxFileTypePicture dictIcons={dictIcons} />
          </ColumnL>
          <ColumnR><ReduxCoreMetadataHeader /></ColumnR>
        </div>
        <ReduxCoreMetadataTable />
      </div>
    );
  }
}

export default CoreMetadataPage;
