import React, { useState, useEffect } from 'react';
import { uniq, sum } from 'lodash';

import { Input, Table, Tag, Radio, Checkbox, Button, Space, Modal } from 'antd';
import { LockOutlined, LockFilled, LinkOutlined, UnlockOutlined, SearchOutlined, StarOutlined, StarFilled, StarTwoTone, CloseOutlined } from '@ant-design/icons';

import './DiscoveryBeta.css';

import { hostname } from '../localconf';
import config from './mock_config.json';

const getTagColor = (tagCategory: string): string => {
  const TAG_BLUE = 'rgba(129, 211, 248)';
  const TAG_RED = 'rgb(236, 128, 141)';
  const TAG_GREEN = 'rgba(112, 182, 3)';
  switch (tagCategory) {
  case 'Program':
    return TAG_BLUE;
  case 'Data Type':
    return TAG_RED;
  case 'Study Registration':
    return TAG_GREEN;
  default:
    return 'gray';
  }
};

// FIXME implement
const isFavorite = (study: string): boolean => false;

// FIXME implement
const isAccessible = (study: string): boolean => false;

const columns = [
  {
    // Favorite
    render: (_, record) => (isFavorite(record.name) ? <StarTwoTone twoToneColor={'#797979'} /> : <StarOutlined />),
  },
  {
    title: 'SHORT NAME',
    dataIndex: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'FULL NAME',
    dataIndex: 'full_name',
  },
  {
    title: 'dbGaP ACCESSION NUMBER',
    dataIndex: 'study_id',
  },
  {
    title: 'NUMBER OF SUBJECTS',
    dataIndex: '_subjects_count',
  },
  {
    title: 'TAGS',
    dataIndex: 'tags',
    render: (_, record) => (
      <React.Fragment>
        {record.tags.map( ({name, category}) => (
          <Tag color={getTagColor(category)} key={record.name + name}>{name}</Tag>
        ))}
      </React.Fragment>
    ),
  },
  {
    title: 'ACCESS',
    render: (_, record) => (isAccessible(record.name) ? <UnlockOutlined /> : <LockFilled />),
  },
];

const loadResources = async (): Promise<any> => {
  const RESOURCE_DATA_URL = 'mds/metadata?_guid_type=discovery_metadata&data=True';
  const url = hostname + RESOURCE_DATA_URL;
  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      throw new Error(`Request for resource data failed: ${JSON.stringify(res, null, 2)}`);
    }
    const jsonResponse = await res.json();
    const resources = Object.values(jsonResponse).map( (entry: any) => entry.gen3_discovery);
    return resources;
  } catch(err) {
    throw new Error(`Request for resource data failed: ${err}`);
  }
}

interface AggregationConfig {
  name: string
  field: string
  type: 'sum' | 'count'
}

const renderAggregation = (aggregation: AggregationConfig, resources: any[] | null): string => {
  if (!resources) {
    return '';
  }
  const {field, type} = aggregation;
  const fields = resources.map( r => r[field] );
  switch(type) {
  case 'sum':
    return sum(fields).toLocaleString();
  case 'count':
    const uniqueFields = uniq(fields);
    return uniqueFields.length.toLocaleString();
  default:
    throw new Error(`Misconfiguration error: Unrecognized aggregation type ${type}. Check the 'aggregations' block of the Discovery page config.`);
  }

}

const DiscoveryBeta: React.FunctionComponent = () => {

  const [resources, setResources] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // load resources on first render
  useEffect(() => {
    loadResources().then( resources => {
      console.log('resources', resources);
      setResources(resources);
    }).catch(err => {
      // FIXME how to handle this / retry?
      throw new Error(err);
    });
  }, [])

  return (<div className='discovery-container'>
    <h1 className='discovery-page-title'>DISCOVERY</h1>
    { resources
      ? (<React.Fragment>
        <div className='discovery-header'>
          <div className='discovery-header__stats-container'>
            {
              config.aggregations.map( aggregation => (
                <div className='discovery-header__stat' key={aggregation.name}>
                  <div className='discovery-header__stat-number'>
                    {renderAggregation(aggregation, resources)}
                  </div>
                  <div className='discovery-header__stat-label'>
                    {aggregation.name}
                  </div>
                </div>
              ))
            }
          </div>
          <div className='discovery-header__tags-container' >
            <h3 className='discovery-header__tags-header'>ASSOCIATED TAGS BY CATEGORY</h3>
            <div className='discovery-header__tags'>
              <div className='discovery-header__tag-group'>
                <h5>Program</h5>
                <Tag className='discovery-header__tag' color={'rgba(129, 211, 248, 0.5)'}>TOPMed</Tag>
                <Tag className='discovery-header__tag' color={'rgba(129, 211, 248)'}>COVID 19</Tag>
                <Tag className='discovery-header__tag' color={'rgba(129, 211, 248)'}>Parent</Tag>
              </div>
              <div className='discovery-header__tag-group'>
                <h5>Disease</h5>
                <Tag className='discovery-header__tag' color={'rgba(236, 128, 141)'}>Blood Disease</Tag>
                <Tag className='discovery-header__tag' color={'rgba(236, 128, 141)'}>Lung Disease</Tag>
                <Tag className='discovery-header__tag' color={'rgba(236, 128, 141)'}>Heart Disease</Tag>
              </div>
              <div className='discovery-header__tag-group'>
                <h5>Data Freeze</h5>
                <Tag className='discovery-header__tag' color={'rgba(112, 182, 3)'}>Freeze 5</Tag>
                <Tag className='discovery-header__tag' color={'rgba(112, 182, 3)'}>Freeze 8</Tag>
                <Tag className='discovery-header__tag' color={'rgba(112, 182, 3)'}>Freeze 9</Tag>
              </div>
            </div>
          </div>
        </div>
        <div className='discovery-table-container'>
        <div className='discovery-table__header'>
          <Input className='discovery-table__search' prefix={<SearchOutlined />} />
          <div className='disvovery-table__controls'>
            <Checkbox className='discovery-table__show-favorites'>Show Favorites</Checkbox>
            <Radio.Group
              className='discovery-table__access-button'
              defaultValue='both'
              buttonStyle='solid'
            >
              <Radio.Button value='both'>Both</Radio.Button>
              <Radio.Button value='access'><LockFilled /></Radio.Button>
              <Radio.Button value='no-access'><UnlockOutlined /></Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <Table
          columns={columns}
          rowKey={config.minimal_field_mapping.uid}
          onRow={() => ({
            onClick: () => {
              setModalVisible(true);
            }
          })}
          dataSource={resources}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowClassName: () => 'discovery-table__expanded-row',
            expandedRowRender: record => record.study_description.slice(0, 250) + '...',
            expandIconColumnIndex: -1, // don't render expand icon
          }}
        />
      </div>
      </React.Fragment>)
      : <div>Loading...</div>
    }
    <Modal
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
      width='80vw'
      title={
        <Space align='baseline'>
          <h3 className='discovery-modal__header-text'>topmed-SAPPHIRE_asthma_DS-ASTHMA-IRB-COL</h3>
          <StarOutlined />
          <LinkOutlined />
        </Space>
      }
      footer={false}
    >
          <Space direction='vertical' size='large'>
            <Space direction='vertical' className='discovery-modal__attribute-group'>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>PI</span>
                <span className='discovery-modal__attribute-value'>Jackie Slivka</span>
              </Space>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Author</span>
                <span className='discovery-modal__attribute-value'>CTDS</span>
              </Space>
            </Space>

            <Space direction='vertical' className='discovery-modal__attribute-group'>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Number of Subjects</span>
                <span className='discovery-modal__attribute-value'>100</span>
              </Space>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Target Population</span>
                <span className='discovery-modal__attribute-value'>Vegetarians</span>
              </Space>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Setting</span>
                <span className='discovery-modal__attribute-value'>At home</span>
              </Space>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Geography</span>
                <span className='discovery-modal__attribute-value'>Northwest</span>
              </Space>
            </Space>

            <Space direction='vertical' className='discovery-modal__attribute-group'>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Tags</span>
                <Tag color={'rgba(112, 182, 3)'}>Freeze 5</Tag>
                <Tag color={'rgba(236, 128, 141)'}>Heart Disease</Tag>
              </Space>
            </Space>

            <Space direction='vertical' className='discovery-modal__attribute-group'>
              <Space align='start' className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Abstract</span>
                <span className='discovery-modal__attribute-value'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
              </Space>
            </Space>

            <Space direction='vertical' className='discovery-modal__attribute-group'>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Primary Outcome</span>
                <span className='discovery-modal__attribute-value'>Intervention</span>
              </Space>
              <Space className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Description of Intervention</span>
                <span className='discovery-modal__attribute-value'>Intervention</span>
              </Space>
            </Space>

            <Space direction='vertical' className='discovery-modal__attribute-group'>
              <Space align='start' className='discovery-modal__attribute'>
                <span className='discovery-modal__attribute-name'>Study Design</span>
                <span className='discovery-modal__attribute-value'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
              </Space>
            </Space>

          </Space>
    </Modal>
  </div>);
}

export default DiscoveryBeta;
