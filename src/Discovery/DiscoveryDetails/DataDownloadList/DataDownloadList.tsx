import React from 'react';
import { List } from 'antd';
import DataDownloadListItem from './Interfaces/DataDownloadListItem';
import './DataDownloadList.css';
import ProcessData from './Utils/ProcessData';
import ActionButtons from './ActionButtons/ActionButtons';

const DataDownloadList = ({
  discoveryConfig,
  resourceInfo,
  sourceFieldData,
}) => {
  const data = ProcessData(sourceFieldData);
  if (data.length === 0) {
    return null;
  }
  return (
    <div className='discovery-modal__data-download-list'>
      <ActionButtons
        discoveryConfig={discoveryConfig}
        resourceInfo={resourceInfo}
      />
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={(item: DataDownloadListItem) => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={item.description || ''}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default DataDownloadList;
