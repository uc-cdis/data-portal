import React, { Component } from 'react';
import BackLink from '../components/BackLink';
import { ReduxCoreMetadataHeader, ReduxFileTypePicture, ReduxCoreMetadataTable } from './reduxer';
import dictIcons from '../img/icons/file-icons/file-icons';
import './page.less';

class CoreMetadataPage extends Component {
  render() {
    return (
      <div className='core-metadata-page'>
        <BackLink url='/files' label='Back to File Explorer' />
        <div>
          <div className='core-metadata-page__column core-metadata-page__column--left'>
            <ReduxFileTypePicture dictIcons={dictIcons} />
          </div>
          <div className='core-metadata-page__column core-metadata-page__column--right'><ReduxCoreMetadataHeader /></div>
        </div>
        <ReduxCoreMetadataTable />
      </div>
    );
  }
}

export default CoreMetadataPage;
