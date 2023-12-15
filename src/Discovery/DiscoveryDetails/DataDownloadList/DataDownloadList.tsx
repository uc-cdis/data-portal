import React from 'react';
import { List } from 'antd';
import DataDownloadListItem from './Interfaces/DataDownloadListItem';
import './DataDownloadList.css';
import ProcessData from './Utils/ProcessData';
import ActionButtons from './ActionButtons/ActionButtons';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import { DiscoveryResource } from '../../Discovery';

interface DataDownloadListProps {
  isUserLoggedIn: boolean;
  discoveryConfig: DiscoveryConfig;
  resourceInfo: DiscoveryResource;
  sourceFieldData: any[];
  healLoginNeeded: boolean;
}

const DataDownloadList = ({
  isUserLoggedIn,
  discoveryConfig,
  resourceInfo,
  sourceFieldData,
  healLoginNeeded,
}: DataDownloadListProps) => {
  const data = ProcessData(sourceFieldData);
  const noData = data.length === 0;
  return (
    <div className='discovery-modal__data-download-list'>
      <ActionButtons
        isUserLoggedIn={isUserLoggedIn}
        discoveryConfig={discoveryConfig}
        resourceInfo={resourceInfo}
        healLoginNeeded={healLoginNeeded}
        noData={noData}
      />
      {!noData && (
        <List
          itemLayout='horizontal'
          dataSource={data}
          data-testid='dataDownloadFileList'
          renderItem={(item: DataDownloadListItem) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description || ''}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
export default DataDownloadList;
