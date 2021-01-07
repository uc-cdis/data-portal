import React from 'react';

import { Input, Table, Tag, Space } from 'antd';

import './DiscoveryBeta.css';

const columns = [
  {
    title: 'STUDY NAME',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'dbGaP ACCESSION NUMBER',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'NUMBER OF SUBJECTS',
    dataIndex: 'address',
    key: 'address',
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
    key: 'action',
    render: (text, record) => (
      <Space size='middle'>
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const { Search } = Input;

class DiscoveryBeta extends React.PureComponent {
  render() {
    return (<div className='discovery-container'>
      <h1>Discovery</h1>
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
              <Tag className='discovery-header__tag' color={'rgba(129, 211, 248)'}>TOPMed</Tag>
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
      <div className='discovery-list-container'>
        <Search style={{ width: '300px' }} />
        <Table columns={columns} dataSource={data} />
      </div>
    </div>);
  }
}

export default DiscoveryBeta;
