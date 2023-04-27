import React, { createRef } from 'react';
import { basename, dicomServerUrl } from '../localconf';
import { installViewer } from '@ohif/viewer';

import './page.less';

const ohifViewerConfig = {
  routerBasename: `${basename}/ohif-viewer/`,
  servers: {
    dicomWeb: [
      {
        name: 'DCM4CHEE',
        wadoUriRoot: `${dicomServerUrl}dicom-web/wado`,
        qidoRoot: `${dicomServerUrl}dicom-web`,
        wadoRoot: `${dicomServerUrl}dicom-web`,
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
  parentRef = createRef();
  observer = null;

  componentDidMount() {
    installViewer(
      ohifViewerConfig,
      containerId,
      componentRenderedOrUpdatedCallback
    );
    this.checkAndUpdateParentHeight();
  }

  componentDidUpdate() {
    this.checkAndUpdateParentHeight();
  }

  checkAndUpdateParentHeight() {
    const parent = this.parentRef.current;
    const child1 = parent && parent.querySelector('.study-list-container');
    let height = 201;

    if (child1) {
      const childHeight = parseInt(window.getComputedStyle(child1).height);
      height += childHeight;
    } else {
      setTimeout(() => {
        this.checkAndUpdateParentHeight();
      }, 500);
    }

    parent.style.minHeight = height + "px";
  }

  render() {
    return (
      <div id={containerId} ref={this.parentRef} className='dicom-viewer' />
    );
  }
}

Viewer.propTypes = {
};

export default Viewer;
