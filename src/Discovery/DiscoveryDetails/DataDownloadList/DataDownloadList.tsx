import React from 'react';
import { List, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import DataDownloadListItem from './Utils/DataDownloadListItem';
import './DataDownloadList.css';
import ProcessData from './Utils/ProcessData';

const DataDownloadList = ({ sourceFieldData }: any) => {
  const data = ProcessData(sourceFieldData);
  if (data.length === 0) {
    return null;
  }
  return (
    <div className='discovery-modal__data-download-list'>
      <h3>Data Download Links</h3>
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={(item: DataDownloadListItem) => (
          <List.Item
            actions={[
              <Button type='text' disabled icon={<DownloadOutlined />}>
                Download File
              </Button>,
            ]}
          >
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