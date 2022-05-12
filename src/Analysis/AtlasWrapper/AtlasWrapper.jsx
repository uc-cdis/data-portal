import React, { useState, useEffect } from 'react';

const AtlasWrapper = ({ handleIframeApp, url }) => {
    const EVENT_TYPE = "message"; // from event types https://developer.mozilla.org/en-US/docs/Web/API/EventSource/message_event

    useEffect(() => {
        window.addEventListener(EVENT_TYPE, (event) => {
            console.log("got message (event.origin): " + event.origin);
            console.log("got message (event.data): " + event.data);
            // TODO: update user session when "message" posted from child iframe
        });
    }, [])
    return (
        <React.Fragment>
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
