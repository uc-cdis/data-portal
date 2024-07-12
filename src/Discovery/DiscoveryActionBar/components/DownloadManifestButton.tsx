import React from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import handleDownloadManifestClick from '../utils/handleDownloadManifestClick';
import { handleRedirectToLoginClickResumable } from '../../Utils/HandleRedirectToLoginClick';

const DownloadManifestButton = ({
  props, healIDPLoginNeeded, onlyInCommonMsg, history, location,
}) => (props.config.features.exportToWorkspace?.enableDownloadManifest && (
  <Popover
    className='discovery-popover'
    arrowPointAtCenter
    title={(
      <React.Fragment>
        {healIDPLoginNeeded.length > 0 ? (
          onlyInCommonMsg
        ) : (
          <React.Fragment>
              Download a Manifest File for use with the&nbsp;
            <a
              target='_blank'
              rel='noreferrer'
              href='https://gen3.org/resources/user/gen3-client/'
            >
              {'Gen3 Client'}
            </a>
              .
          </React.Fragment>
        )}
      </React.Fragment>
    )}
    content={(
      <span className='discovery-popover__text'>
          With the Manifest File, you can use the Gen3 Client to download the
          data from the selected studies to your local computer.
      </span>
    )}
  >
    <Button
      onClick={
        props.user.username && !(healIDPLoginNeeded.length > 0)
          ? () => {
            handleDownloadManifestClick(
              props.config,
              props.discovery.selectedResources,
              healIDPLoginNeeded.length > 0,
            );
          }
          : () => {
            handleRedirectToLoginClickResumable('manifest', props, history, location);
          }
      }
      type='default'
      className={`discovery-action-bar-button${
        props.discovery.selectedResources.length === 0 ? '--disabled' : ''
      }`}
      disabled={props.discovery.selectedResources.length === 0}
      icon={<FileTextOutlined />}
    >
      {props.user.username && !(healIDPLoginNeeded.length > 0)
        ? `${
          props.config.features.exportToWorkspace
            .downloadManifestButtonText || 'Download Manifest'
        }`
        : `Login to ${
          props.config.features.exportToWorkspace
            .downloadManifestButtonText || 'Download Manifest'
        }`}
    </Button>
  </Popover>
));
export default DownloadManifestButton;
