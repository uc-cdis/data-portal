import React from 'react';
import { installViewer } from '@ohif/viewer';

import './page.less';

const ohifViewerConfig = {
  routerBasename: '/dev.html/dicom-viewer',
  servers: {
    dicomWeb: [
      {
        name: 'DCM4CHEE',
        wadoUriRoot: 'http://localhost/orthanc/wado',
        qidoRoot: 'http://localhost/orthanc/dicom-web',
        wadoRoot: 'http://localhost/orthanc/dicom-web',
        qidoSupportsIncludeField: true,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: true,
        StudiesMetadata: 'MainDicomTags',
        SeriesMetadata: "Full",
      },
    ],
  },
}
const containerId = 'ohif'
const componentRenderedOrUpdatedCallback = function () {
  console.log('OHIF Viewer rendered/updated');
};

class Viewer extends React.Component {
  componentDidMount() {
    installViewer(
      ohifViewerConfig,
      containerId,
      componentRenderedOrUpdatedCallback
    );
  }

  render() {
    return (
      <div id={containerId} className='dicom-viewer' />
    );
  }
}

Viewer.propTypes = {
};

export default Viewer;
