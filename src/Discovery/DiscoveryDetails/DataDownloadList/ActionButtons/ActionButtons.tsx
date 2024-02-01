import React, { useState } from 'react';
import { Col, Row, Button, Popover } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DiscoveryConfig } from '../../../DiscoveryConfig';
import { DiscoveryResource } from '../../../Discovery';
import { INITIAL_DOWNLOAD_STATUS } from './DownloadUtils/Constants';
import DataDictionaries from '../Interfaces/DataDictionaries';
import UseHandleRedirectToLoginClick from './DownloadUtils/UseHandleRedirectToLoginClick';
import HandleDownloadManifestClick from './DownloadUtils/HandleDownloadManifestClick';
import DownloadModal from './DownloadModal/DownloadModal';
import DownloadAllFiles from './DownloadUtils/DownloadAllFiles/DownloadAllFiles';
import DownloadJsonFile from './DownloadUtils/DownloadJsonFile';
import DownloadVariableMetadata from './DownloadUtils/DownloadVariableMetadata/DownloadVariableMetadata';
import { mdsURL } from '../../../../localconf';
import { fetchWithCreds } from '../../../../actions';
import './ActionButtons.css';

interface ActionButtonsProps {
  isUserLoggedIn: boolean;
  discoveryConfig: DiscoveryConfig;
  resourceInfo: DiscoveryResource;
  healLoginNeeded: boolean;
  noData: boolean;
}

const ActionButtons = ({
  isUserLoggedIn,
  discoveryConfig,
  resourceInfo,
  healLoginNeeded,
  noData,
}: ActionButtonsProps): JSX.Element => {
  const [downloadStatus, setDownloadStatus] = useState(INITIAL_DOWNLOAD_STATUS);
  const { HandleRedirectToLoginClick } = UseHandleRedirectToLoginClick();
  const history = useHistory();
  const location = useLocation();

  const studyMetadataFieldNameReference: string | undefined =
    discoveryConfig?.features.exportToWorkspace.studyMetadataFieldName;
  const manifestFieldName: string | undefined =
    discoveryConfig?.features.exportToWorkspace.manifestFieldName;
  const showDownloadStudyLevelMetadataButton = Boolean(
    discoveryConfig?.features.exportToWorkspace.enableDownloadStudyMetadata &&
      studyMetadataFieldNameReference &&
      resourceInfo?.[studyMetadataFieldNameReference]
  );
  const showDownloadFileManifestButtons = Boolean(
    discoveryConfig?.features.exportToWorkspace.enableDownloadManifest
  );
  const showDownloadAllFilesButtons = Boolean(
    discoveryConfig?.features.exportToWorkspace.enableDownloadZip
  );
  const verifyExternalLoginsNeeded = Boolean(
    discoveryConfig?.features.exportToWorkspace.verifyExternalLogins
  );

  const showDownloadVariableMetadataButton = Boolean(
    discoveryConfig.features.exportToWorkspace.variableMetadataFieldName &&
      discoveryConfig.features.exportToWorkspace.enableDownloadVariableMetadata
  );

  // let noVariableLevelMetadata = true;
  const [noVariableLevelMetadata, setNoVariableLevelMetadata] = useState(true);
  const dataDictionaryReference =
    discoveryConfig.features.exportToWorkspace.variableMetadataFieldName;
  let dataDictionaries: DataDictionaries;
  if (showDownloadVariableMetadataButton) {
    const studyID = resourceInfo._hdp_uid;
    fetchWithCreds({ path: `${mdsURL}/${studyID}` }).then((statusResponse) => {
      const { data } = statusResponse;
      if (
        statusResponse.status !== 200 ||
        !data ||
        !data[dataDictionaryReference as string] ||
        Array.isArray(data[dataDictionaryReference as string]) ||
        data[dataDictionaryReference as string].length
      ) {
        return;
      } else {
        dataDictionaries = data.data_dictionaries;
        setNoVariableLevelMetadata(false);
        console.log(dataDictionaries);
      }
    });
  }

  const ConditionalPopover = ({ children }) =>
    noData ? (
      <Popover title={'This file is not available for the selected study'}>
        {children}
      </Popover>
    ) : (
      children
    );

  return (
    <div className='discovery-modal_buttons-row' data-testid='actionButtons'>
      <DownloadModal
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
      />
      <Row className='row'>
        {showDownloadVariableMetadataButton && (
          <Col flex='1 0 auto'>
            <Button
              className='discovery-action-bar-button'
              disabled={Boolean(
                downloadStatus.inProgress || noVariableLevelMetadata
              )}
              loading={downloadStatus.inProgress === 'DownloadVariableMetadata'}
              onClick={() => {
                DownloadVariableMetadata(
                  dataDictionaries,
                  resourceInfo,
                  setDownloadStatus
                );
              }}
            >
              Download <br />
              Variable-Level Metadata
            </Button>
          </Col>
        )}
        {showDownloadStudyLevelMetadataButton && (
          <Col flex='1 0 auto'>
            <ConditionalPopover>
              <Button
                className='discovery-action-bar-button'
                disabled={Boolean(noData || downloadStatus.inProgress)}
                onClick={() =>
                  DownloadJsonFile(
                    'study-level-metadata',
                    studyMetadataFieldNameReference &&
                      resourceInfo[studyMetadataFieldNameReference]
                  )
                }
              >
                Download <br />
                Study-Level Metadata
              </Button>
            </ConditionalPopover>
          </Col>
        )}
        {showDownloadFileManifestButtons && (
          <Col flex='1 0 auto'>
            {isUserLoggedIn && !healLoginNeeded && (
              <ConditionalPopover>
                <Button
                  className='discovery-action-bar-button'
                  disabled={Boolean(noData || downloadStatus.inProgress)}
                  onClick={() => {
                    HandleDownloadManifestClick(
                      discoveryConfig,
                      [resourceInfo],
                      healLoginNeeded
                    );
                  }}
                >
                  Download File Manifest
                </Button>
              </ConditionalPopover>
            )}
            {(!isUserLoggedIn || healLoginNeeded) && (
              <Button
                className='discovery-action-bar-button'
                disabled={Boolean(noData || downloadStatus.inProgress)}
                onClick={() => {
                  HandleRedirectToLoginClick(
                    resourceInfo,
                    discoveryConfig,
                    'manifest'
                  );
                }}
              >
                Login to
                <br /> Download Manifest
              </Button>
            )}
          </Col>
        )}
        {showDownloadAllFilesButtons && (
          <Col flex='1 0 auto'>
            {isUserLoggedIn && !healLoginNeeded && (
              <ConditionalPopover>
                <Button
                  className='discovery-action-bar-button'
                  disabled={Boolean(noData || downloadStatus.inProgress)}
                  loading={downloadStatus.inProgress === 'DownloadAllFiles'}
                  onClick={() =>
                    DownloadAllFiles(
                      resourceInfo,
                      downloadStatus,
                      setDownloadStatus,
                      history,
                      location,
                      healLoginNeeded,
                      verifyExternalLoginsNeeded,
                      manifestFieldName
                    )
                  }
                >
                  Download All Files
                </Button>
              </ConditionalPopover>
            )}
            {(!isUserLoggedIn || healLoginNeeded) && (
              <Button
                className='discovery-action-bar-button'
                disabled={Boolean(noData || downloadStatus.inProgress)}
                onClick={() => {
                  HandleRedirectToLoginClick(
                    resourceInfo,
                    discoveryConfig,
                    'download'
                  );
                }}
              >
                Login to
                <br /> Download All Files
              </Button>
            )}
          </Col>
        )}
      </Row>
    </div>
  );
};
export default ActionButtons;
