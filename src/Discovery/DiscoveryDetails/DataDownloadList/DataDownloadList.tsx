import React from 'react';
import { Collapse, List, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import CheckThatDataHasTitles from './Utils/CheckThatDataHasTitles';
import DataDownloadListItem from './Utils/DataDownloadListItem';


const { Panel } = Collapse;


const DataDownloadList = ({sourceFieldData}: any) => {
  const data = sourceFieldData[0].map((obj) => (
      {
        title: obj.title,
        description: obj.description,
      }
    ),
  );
  if (CheckThatDataHasTitles(data) === false) return null;
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header={'Data Download Links'} key='1'>
        <List
          itemLayout='horizontal'
          dataSource={data}
          renderItem={(item:DataDownloadListItem) => (
            <List.Item
              actions={[
                <Button
                  type='text'
                  disabled
                  icon={<DownloadOutlined />}
                >
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
      </Panel>
    </Collapse>
  );
};
export default DataDownloadList;
