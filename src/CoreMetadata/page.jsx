import React from 'react';
import BackLink from '../components/BackLink';
import {
  ReduxCoreMetadataHeader,
  ReduxFileTypePicture,
  ReduxCoreMetadataTable,
} from './reduxer';
import dictIcons from '../img/icons/file-icons/file-icons';
import './page.less';

function CoreMetadataPage() {
  return (
    <div className='core-metadata-page'>
      <div className='core-metadata-page__grid'>
        <div className='core-metadata-page__picture'>
          <ReduxFileTypePicture dictIcons={dictIcons} />
        </div>
        <div className='core-metadata-page__header'>
          <ReduxCoreMetadataHeader />
        </div>
        <div className='core-metadata-page__table'>
          <ReduxCoreMetadataTable />
        </div>
      </div>
    </div>
  );
}

export default CoreMetadataPage;
