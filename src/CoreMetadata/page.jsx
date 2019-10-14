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
        <div className='core-metadata-page__grid'>
          <div className='core-metadata-page__picture'>
            <ReduxFileTypePicture dictIcons={dictIcons} />
          </div>
          <div className='core-metadata-page__header'><ReduxCoreMetadataHeader /></div>
          <div className='core-metadata-page__table'><ReduxCoreMetadataTable /></div>
        </div>
      </div>
    );
  }
}

export default CoreMetadataPage;
