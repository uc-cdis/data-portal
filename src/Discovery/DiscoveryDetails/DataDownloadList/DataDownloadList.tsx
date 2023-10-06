import React from 'react';
import { List, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import CheckThatDataHasTitles from './Utils/processData';
import DataDownloadListItem from './Utils/DataDownloadListItem';
import './DataDownloadList.css';
import ProcessData from './Utils/processData';


const DataDownloadList = ({ sourceFieldData }: any) => {
  /* const data = sourceFieldData[0].filter((item:sourceFieldDataObj) => {
    if (!("title" in item || "file_name" in item)) {
      console.log("Item without title or file_name:", item);
    }
    return "title" in item || "file_name" in item;
  }).map((obj:{title?:string, file_name?:string,description?:string,[key: string]: any }) => ({
    title: obj.title || obj.file_name,
    description: obj.description,
  }));*/

  const data = ProcessData(sourceFieldData);

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
