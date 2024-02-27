import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, List } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import DataDownloadListItem from './Interfaces/DataDownloadListItem';
import './DataDownloadList.css';
import ProcessData from './Utils/ProcessData';
import ActionButtons from './ActionButtons/ActionButtons';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import { DiscoveryResource } from '../../Discovery';
import {
  fenceDownloadPath,
  bundle,
} from '../../../localconf';
import { INITIAL_DOWNLOAD_STATUS } from './ActionButtons/DownloadUtils/Constants';
import DownloadModal from './ActionButtons/DownloadModal/DownloadModal';
import DownloadDataFiles from './ActionButtons/DownloadUtils/DownloadDataFiles/DownloadDataFiles';
import UseHandleRedirectToLoginClick from './ActionButtons/DownloadUtils/UseHandleRedirectToLoginClick';

interface DataDownloadListProps {
  resourceFieldValueIsValid: boolean;
  isUserLoggedIn: boolean;
  discoveryConfig: DiscoveryConfig;
  resourceInfo: DiscoveryResource;
  sourceFieldData: any[];
  missingRequiredIdentityProviders: string[];
}

const DataDownloadList = ({
  resourceFieldValueIsValid,
  isUserLoggedIn,
  discoveryConfig,
  resourceInfo,
  sourceFieldData,
  missingRequiredIdentityProviders,
}: DataDownloadListProps) => {
  const [downloadStatus, setDownloadStatus] = useState(INITIAL_DOWNLOAD_STATUS);
  const history = useHistory();
  const location = useLocation();
  const { HandleRedirectFromDiscoveryDetailsToLoginClick } = UseHandleRedirectToLoginClick();

  const data: [] = resourceFieldValueIsValid
    ? ProcessData(sourceFieldData)
    : [];
  const noData = data.length === 0;

  const uid = resourceInfo[discoveryConfig.minimalFieldMapping.uid] || '';
  const DataDownloadButton = (item: DataDownloadListItem) => {
    const manifestFieldName: string | undefined = discoveryConfig?.features?.exportToWorkspace?.manifestFieldName;
    if (!manifestFieldName || noData) {
      return null;
    }
    // Ask user to login before downloading
    if (!isUserLoggedIn || missingRequiredIdentityProviders.length) {
      return (
        <Button
          className='discovery-action-bar-button'
          disabled={Boolean(noData || downloadStatus.inProgress)}
          onClick={() => {
            HandleRedirectFromDiscoveryDetailsToLoginClick(uid);
          }}
        >
          Login to Download File
        </Button>
      );
    }
    const isEcosystemPortal = bundle === 'heal' || bundle === 'ecosystem';
    const useBatchExportForDataDownloadButton = Boolean(
      discoveryConfig?.features.exportToWorkspace.enableDownloadZip,
    );
    const verifyExternalLoginsNeeded = Boolean(
      discoveryConfig?.features.exportToWorkspace.verifyExternalLogins,
    );
    // for data ecosystem, if using batch export sower job
    if (isEcosystemPortal && useBatchExportForDataDownloadButton) {
      const fileManifestFromStudyMetadata: any[] = resourceInfo?.[manifestFieldName] || [];
      let selectedFileManifest: any[] = [];
      if (item.guid && fileManifestFromStudyMetadata) {
        selectedFileManifest = [fileManifestFromStudyMetadata.find((element:any) => element.object_id === item.guid)];
      }
      return (
        <Button
          className='discovery-action-bar-button'
          disabled={Boolean(noData || downloadStatus.inProgress)}
          loading={downloadStatus.inProgress === 'DownloadDataFiles'}
          onClick={() => DownloadDataFiles(
            downloadStatus,
            setDownloadStatus,
            history,
            location,
            missingRequiredIdentityProviders,
            verifyExternalLoginsNeeded,
            selectedFileManifest,
          )}
        >
          Download File
        </Button>
      );
    }
    // regular download button
    return (
      <Button
        className='discovery-action-bar-button'
        href={`${fenceDownloadPath}/${item.guid}?expires_in=900&redirect`}
        target='_blank'
        type='text'
        // disable button if data has no GUID
        disabled={!item.guid}
        icon={<DownloadOutlined />}
      >
        Download File
      </Button>
    );
  };

  return (
    <div className='discovery-modal__data-download-list'>
      <DownloadModal
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
      />
      <ActionButtons
        isUserLoggedIn={isUserLoggedIn}
        discoveryConfig={discoveryConfig}
        resourceInfo={resourceInfo}
        missingRequiredIdentityProviders={missingRequiredIdentityProviders}
        noData={noData}
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
        history={history}
        location={location}
      />
      {!noData && resourceFieldValueIsValid && (
        <List
          itemLayout='horizontal'
          dataSource={data}
          data-testid='dataDownloadFileList'
          renderItem={(item: DataDownloadListItem) => (
            <List.Item
              actions={[DataDownloadButton(item)]}
            >
              <List.Item.Meta
                title={(
                  <div className='discovery-modal__download-list-title'>
                    {item.title}
                  </div>
                )}
                description={(
                  <div className='discovery-modal__download-list-description'>
                    {item.description || ''}
                  </div>
                )}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
export default DataDownloadList;
