import React from 'react';
import { Collapse, List, Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import CheckThatDataHasTitles from './Utils/CheckThatDataHasTitles';
import DataDownloadListItem from './Utils/DataDownloadListItem';
import './DataDownloadList.css';

const DataDownloadList = ({ sourceFieldData }: any) => {
  const data = sourceFieldData[0].map((obj) => ({
    title: obj.title || obj.file_name,
    description: obj.description,
  }));
  if (CheckThatDataHasTitles(data) === false) return null;
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
