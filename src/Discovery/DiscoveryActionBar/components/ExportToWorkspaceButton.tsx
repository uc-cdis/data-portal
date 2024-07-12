import React from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import handleExportToWorkspaceClick from '../utils/handleExportToWorkspaceClick/handleExportToWorkspaceClick';
import {handleRedirectToLoginClickResumable} from '../../Utils/HandleRedirectToLoginClick';

const ExportToWorkspaceButton = ({
  props, healIDPLoginNeeded, onlyInCommonMsg, setDownloadStatus, history, location,
}) => (props.config.features.exportToWorkspace?.enabled && (
  <Popover
    className='discovery-popover'
    arrowPointAtCenter
    content={(
      <React.Fragment>
        {healIDPLoginNeeded.length > 0 ? (
          onlyInCommonMsg
        ) : (
          <React.Fragment>
              Open selected studies in the&nbsp;
            <a
              target='blank'
              rel='noreferrer'
              href='https://gen3.org/resources/user/analyze-data/'
            >
                Gen3 Workspace
            </a>
              .
          </React.Fragment>
        )}
      </React.Fragment>
    )}
  >
    <Button
      type='default'
      className={`discovery-action-bar-button${
        props.discovery.selectedResources.length === 0 ? '--disabled' : ''
      }`}
      disabled={props.discovery.selectedResources.length === 0}
      loading={props.exportingToWorkspace}
      icon={<ExportOutlined />}
      onClick={
        props.user.username && !(healIDPLoginNeeded.length > 0)
          ? async () => {
            handleExportToWorkspaceClick(
              props.config,
              props.discovery.selectedResources,
              props.setExportingToWorkspace,
              setDownloadStatus,
              history,
              location,
              healIDPLoginNeeded.length > 0,
            );
          }
          : () => {
            handleRedirectToLoginClickResumable('export', props, history, location);
          }
      }
    >
      {props.user.username && !(healIDPLoginNeeded.length > 0)
        ? 'Open In Workspace'
        : 'Login to Open In Workspace'}
    </Button>
  </Popover>
));

export default ExportToWorkspaceButton;
