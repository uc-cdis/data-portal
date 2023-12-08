import React from 'react';
import { List } from 'antd';
import DataDownloadListItem from './Interfaces/DataDownloadListItem';
import './DataDownloadList.css';
import ProcessData from './Utils/ProcessData';
import ActionButtons from './ActionButtons/ActionButtons';

const DataDownloadList = ({
  isUserLoggedIn,
  discoveryConfig,
  resourceInfo,
  sourceFieldData,
  healLoginNeeded,
}) => {
  const data = ProcessData(sourceFieldData);
  return (
    <div className='discovery-modal__data-download-list'>
      <ActionButtons
        isUserLoggedIn={isUserLoggedIn}
        discoveryConfig={discoveryConfig}
        resourceInfo={resourceInfo}
        healLoginNeeded={healLoginNeeded}
      />
      {data.length !== 0 && (
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
