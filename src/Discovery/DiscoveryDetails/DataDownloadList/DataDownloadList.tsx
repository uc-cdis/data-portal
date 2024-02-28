import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { List } from 'antd';
import DataDownloadListItem from './Interfaces/DataDownloadListItem';
import './DataDownloadList.css';
import ProcessData from './Utils/ProcessData';
import ActionButtons from './ActionButtons/ActionButtons';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import { DiscoveryResource } from '../../Discovery';

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

  const data: [] = resourceFieldValueIsValid
    ? ProcessData(sourceFieldData)
    : [];
  const noData = data.length === 0;

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
              actions={[
                <StandaloneDataDownloadButton
                  discoveryConfig={discoveryConfig}
                  resourceInfo={resourceInfo}
                  noData={noData}
                  isUserLoggedIn={isUserLoggedIn}
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
