import React, { useState, useEffect } from 'react';
import ReduxAtlasShutdownPopup from '../../Popup/ReduxAtlasShutdownBanner';
import { AtlasSessionMonitor } from './AtlasSessionMonitor';


const AtlasWrapper = ({ handleIframeApp, url }) => {


  useEffect(() => {
    AtlasSessionMonitor.start();
  }, []);

  return (
    <React.Fragment>
      <ReduxAtlasShutdownBanner></ReduxAtlasShutdownBanner>
      <ReduxAtlasShutdownPopup></ReduxAtlasShutdownPopup>
      <div className='analysis-app__iframe-wrapper'>
        <iframe
          className='analysis-app__iframe'
          title='Analysis App'
          frameBorder='0'
          src={url}
          onLoad={handleIframeApp}
        />
      </div>
    </React.Fragment>
  )
}

export default AtlasWrapper
