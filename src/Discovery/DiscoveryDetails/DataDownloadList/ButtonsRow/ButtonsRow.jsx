import React, { useState, useEffect } from 'react';
import { Col, Row, Button } from 'antd';
import './ButtonsRow.css';


import { fetchWithCreds } from '../../../../actions';
import { jobAPIPath } from '../../../../localconf';


const ButtonsRow = ({resourceInfo, data}) => {

/* NEW STUFF OCT 19 */
console.log("resourceInfo ",resourceInfo);
console.log("study_id",resourceInfo.study_id);
console.log("data",data);
const [downloadStatus, setDownloadStatus] = useState({
  inProgress: false,
  message: { title: '', content: <h1>lol</h1>, active: false },
});

const studyIDs = [resourceInfo.study_id];
const initFetch = () => fetchWithCreds({
  path: `${jobAPIPath}dispatch`,
  method: 'POST',
  body: JSON.stringify({ action: 'batch-export', input: { study_ids: studyIDs } }), // NEW TO FIND studyIDs
}).then(
  (dispatchResponse) => {
    const { uid } = dispatchResponse.data;
    if (dispatchResponse.status === 403 || dispatchResponse.status === 302) {
      setDownloadStatus({
        inProgress: false,
        message: {
          title: 'Download failed',
          content: <p> { 'Unable to authorize download. Please refresh the page and ensure you are logged in.'} </p>,
          active: true,
        },
      });
    } else if (dispatchResponse.status !== 200 || !uid) {
      setDownloadStatus({
        inProgress: false,
        message: {
          title: 'Download failed',
          content: <p> { 'There was a problem preparing your download. Please consider using the Gen3 SDK for Python (w/ CLI) to download these files via a manifest.'} </p>,
          active: true,
        },
      });
    } else {
      setDownloadStatus({
        inProgress: true,
        message: {
          title: 'Your download is being prepared',
          content: <p> { 'Please remain on this page until your download completes. When your download is ready, '
          + 'it will begin automatically. You can close this window.' } </p>,
          active: true,
        },
      });
      //setTimeout(checkDownloadStatus, JOB_POLLING_INTERVAL, uid, downloadStatus, setDownloadStatus, selectedResources);
    }
  },
).catch(() => setDownloadStatus({
  inProgress: false,
  message: {
    title: 'Download failed',
    content: <p> { 'CATCH ERR: There was a problem preparing your download. Please consider using the Gen3 SDK for Python (w/ CLI) to download these files via a manifest.'} </p>,
    active: true,
  },
}));

useEffect(() => {
  console.log("initFetch", initFetch());
}, []);
/* END NEW STUFF OCT 19 */

  return (
    <div className='discovery-modal_buttons-row'>
      <Row className='row'>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download <br />
            Variable-Level Metadata
          </Button>
        </Col>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download <br />
            Study-Level Metadata
          </Button>
        </Col>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download File Manifest
          </Button>
        </Col>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download All Files
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default ButtonsRow;
