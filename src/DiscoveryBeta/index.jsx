import React from 'react';

import { Input, Table, Tag, Radio, Checkbox } from 'antd';
import { LockOutlined, LockFilled, UnlockOutlined, SearchOutlined, StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';

import './DiscoveryBeta.css';

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
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
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

class DiscoveryBeta extends React.PureComponent {
  render() {
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
        <Table className='discovery-table__table' columns={columns} dataSource={data} />
      </div>
    </div>);
  }
}

export default DiscoveryBeta;
