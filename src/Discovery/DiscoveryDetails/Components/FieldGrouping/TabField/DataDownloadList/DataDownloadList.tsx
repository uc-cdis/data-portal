import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { List, Alert } from 'antd';
import DataDownloadListItem from './Interfaces/DataDownloadListItem';
import './DataDownloadList.css';
import { ProcessData, MAX_NUMBER_OF_ITEMS_IN_LIST } from './Utils/ProcessData';
import ActionButtons from './ActionButtons/ActionButtons';
import { DiscoveryConfig } from '../../../../../DiscoveryConfig';
import { AccessLevel, DiscoveryResource, accessibleFieldName } from '../../../../../Discovery';
import { INITIAL_DOWNLOAD_STATUS } from './ActionButtons/DownloadUtils/Constants';
import DownloadModal from './ActionButtons/DownloadModal/DownloadModal';
import StandaloneDataDownloadButton from './ActionButtons/StandaloneDataDownloadButton';

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

  let data = [];
  let hasDataBeenTruncated = false;
  if (resourceFieldValueIsValid) {
    const resultFromProcessData = ProcessData(sourceFieldData);
    data = resultFromProcessData.processedDataForDataDownloadList;
    hasDataBeenTruncated = resultFromProcessData.dataForDataDownloadListHasBeenTruncated;
  }
  const noData = data.length === 0;

  let userHasAccessToDownload = true;
  // if auth is enabled, check if user have access to this study
  if (discoveryConfig.features?.authorization?.enabled) {
    userHasAccessToDownload = resourceInfo[accessibleFieldName] === AccessLevel.ACCESSIBLE;
  }
  // disable user's access if there's no manifest found for this study
  const exportToWorkspaceConfig = discoveryConfig.features.exportToWorkspace;
  const { manifestFieldName } = exportToWorkspaceConfig;
  if (!resourceInfo[manifestFieldName] || resourceInfo[manifestFieldName].length === 0) {
    userHasAccessToDownload = false;
  }

  return (
    <div className='discovery-modal__data-download-list'>
      <DownloadModal
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
      />
      <ActionButtons
        isUserLoggedIn={isUserLoggedIn}
        userHasAccessToDownload={userHasAccessToDownload}
        discoveryConfig={discoveryConfig}
        resourceInfo={resourceInfo}
        missingRequiredIdentityProviders={missingRequiredIdentityProviders}
        noData={noData}
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
        history={history}
        location={location}
      />
      {hasDataBeenTruncated && (
        <Alert type='info' message={`More than ${MAX_NUMBER_OF_ITEMS_IN_LIST} files found. Visit repository to view all files.`} />
      )}
      {!noData && resourceFieldValueIsValid && (
        <List
          itemLayout='horizontal'
          dataSource={data}
          data-testid='dataDownloadFileList'
          renderItem={(item: DataDownloadListItem) => (
            <List.Item
              actions={[
                <StandaloneDataDownloadButton
                  discoveryConfig={discoveryConfig}
                  resourceInfo={resourceInfo}
                  noData={noData}
                  isUserLoggedIn={isUserLoggedIn}
                  userHasAccessToDownload={userHasAccessToDownload}
                  downloadStatus={downloadStatus}
                  setDownloadStatus={setDownloadStatus}
                  missingRequiredIdentityProviders={missingRequiredIdentityProviders}
                  item={item}
                />,
              ]}
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
