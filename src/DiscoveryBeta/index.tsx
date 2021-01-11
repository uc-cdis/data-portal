import React, { useState } from 'react';

import { Input, Table, Tag, Radio, Checkbox, Button, Space } from 'antd';
import { LockOutlined, LockFilled, LinkOutlined, UnlockOutlined, SearchOutlined, StarOutlined, StarFilled, StarTwoTone, CloseOutlined } from '@ant-design/icons';

import './DiscoveryBeta.css';
import Modal from 'antd/lib/modal/Modal';

const getTagColor = (tag) => {
  const TAG_BLUE = 'rgba(129, 211, 248)';
  const TAG_RED = 'rgb(236, 128, 141)';
  const TAG_GREEN = 'rgba(112, 182, 3)';
  switch (tag) {
  case 'TOPMed':
  case 'COVID 19':
  case 'Parent':
    return TAG_BLUE;
  case 'Blood Disease':
  case 'Lung Disease':
  case 'Heart Disease':
    return TAG_RED;
  case 'Freeze 5':
  case 'Freeze 8':
  case 'Freeze 9':
    return TAG_GREEN;
  default:
    return 'gray';
  }
};

const columns = [
  {
    dataIndex: 'favorite',
    key: 'favorite',
    render: fav => (fav ? <StarTwoTone twoToneColor={'#797979'} /> : <StarOutlined />),
  },
  {
    title: 'STUDY NAME',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'dbGaP ACCESSION NUMBER',
    dataIndex: 'phs_id',
    key: 'phs_id',
  },
  {
    title: 'NUMBER OF SUBJECTS',
    dataIndex: 'num_subjects',
    key: 'num_subjects',
  },
  {
    title: 'TAGS',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <React.Fragment>
        {tags.map(tag => (
          <Tag color={getTagColor(tag)} key={tag}>{tag}</Tag>
        ))}
      </React.Fragment>
    ),
  },
  {
    title: 'ACCESS',
    key: 'accessible',
    render: accessible => (accessible ? <UnlockOutlined /> : <LockFilled />),
  },
];

const data = [
  {
    key: '1',
    name: 'TOPMED_HMB_IRB_NPU',
    phs_id: 'phs000123.v1.p1',
    favorite: true,
    accessible: true,
    num_subjects: 500000,
    tags: ['TOPMed', 'Heart Disease'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  },
  {
    key: '2',
    name: 'topmed-SAPPHIRE_asthma_DS-ASTHMA-IRB-COL',
    phs_id: 'phs000234.v1.p1',
    num_subjects: 1,
    favorite: false,
    accessible: true,
    tags: ['TOPMed', 'Lung Disease'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  },
  {
    key: '3',
    name: 'parent-SAPPHIRE_asthma_DS-ASTHMA-IRB-COL',
    phs_id: 'phs000121.v1.p1',
    num_subjects: 1100,
    favorite: true,
    accessible: false,
    tags: ['Parent', 'Lung Disease'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  },
];

const DiscoveryBeta: React.FunctionComponent = () => {
  const [modalVisible, setModalVisible] = useState(true); // default val is true for development only

  return (<div className='discovery-container'>
    <h1 className='discovery-page-title'>DISCOVERY</h1>
    <div className='discovery-header'>
      <div className='discovery-header__stats-container'>
        <div className='discovery-header__stat'>
          <div className='discovery-header__stat-number'>
            137
          </div>
          <div className='discovery-header__stat-label'>
            Studies
          </div>
        </div>
        <div className='discovery-header__stat'>
          <div className='discovery-header__stat-number'>
            306,583
          </div>
          <div className='discovery-header__stat-label'>
            Files
          </div>
        </div>
        <div className='discovery-header__stat'>
          <div className='discovery-header__stat-number'>
            406,853
          </div>
          <div className='discovery-header__stat-label'>
            Subjects
          </div>
        </div>
        <div className='discovery-header__stat'>
          <div className='discovery-header__stat-number'>
            3.03 PB
          </div>
          <div className='discovery-header__stat-label'>
            Data
          </div>
        </div>
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
        onRow={() => ({
          onClick: () => {
            setModalVisible(true);
          }
        })}
        dataSource={data}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowClassName: () => 'discovery-table__expanded-row',
          expandedRowRender: record => record.description,
          expandIconColumnIndex: -1, // don't render expand icon
        }}
      />
    </div>
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
