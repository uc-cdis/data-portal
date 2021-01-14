import React, { useState, useEffect } from 'react';
import { LockOutlined, LockFilled, LinkOutlined, UnlockOutlined, SearchOutlined, StarOutlined, StarFilled, StarTwoTone, CloseOutlined } from '@ant-design/icons';
import { Input, Table, Tag, Radio, Checkbox, Button, Space, Modal } from 'antd';
import { uniq, sum } from 'lodash';

import './DiscoveryBeta.css';

import { hostname, useArboristUI } from '../localconf';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';

// DEV ONLY
if (!useArboristUI) {
  throw new Error('Arborist UI must be enabled for the Discovery page to work. Set `useArboristUI: true` in the portal config.');
}
import config from './mock_config.json';
import mock_data from './mock_mds_studies.json';

const getTagColor = (tagCategory: string): string => {
  const categoryConfig = config.tag_categories.find( category => category.name === tagCategory);
  if (categoryConfig === undefined) {
    console.warn(`Misconfiguration error: tag category ${tagCategory} not found in config. Check the 'tag_categories' section of the Discovery page config.`)
    return 'gray';
  }
  return categoryConfig.color;
};

// FIXME implement
const isFavorite = (study: string): boolean => false;

const isAccesible = (resource: any, userAuthMapping: any): boolean => {
  console.log('userAuthMapping', userAuthMapping);
  return userHasMethodForServiceOnResource('read', '*', resource.authz, userAuthMapping);
}

const loadResources = async (): Promise<any> => {
  const jsonResponse = mock_data;
  const resources = Object.values(jsonResponse).map( (entry: any) => entry.gen3_discovery);
  return Promise.resolve(resources);
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

// getTagsInCategory returns a list of the unique tags in resources which belong
// to the specified category.
const getTagsInCategory = (category: string, resources: any[] | null): string[]  => {
  if (!resources) {
    return [];
  }
  const tagMap = {};
  resources.forEach( resource => {
    const tagField = config.minimal_field_mapping.tags_list_field_name;
    resource[tagField].forEach( tag => {
      if (tag.category === category) {
        tagMap[tag.name] = true;
      }
    });
  });
  return Object.keys(tagMap);
}

const renderFieldContent = (content: any, contentType: 'string'|'paragraphs'|'number' = 'string'): string => {
  switch(contentType) {
    case 'string':
      return content;
    case 'number':
      return content.toLocaleString();
    case 'paragraphs':
      return content.split('\n').map( (paragraph, i) => <p key={i}>{paragraph}</p> );
    default:
      throw new Error(`Unrecognized content type ${contentType}. Check the 'study_page_fields' section of the Discovery config.`);
  }
}

interface DiscoveryBetaProps {
  // config: any
  userAuthMapping: any
}

const DiscoveryBeta: React.FunctionComponent<DiscoveryBetaProps> = ({userAuthMapping}) => {

  // Set up table columns
  const columns = [{
      // Favorite
      render: (_, record) => (isFavorite(record.name) ? <StarTwoTone twoToneColor={'#797979'} /> : <StarOutlined />),
    }];
  config.study_columns.forEach( column => {
    columns.push({
      title: column.name,
      render: (text, record, index) => {
        const value = record[column.field];
        if (value === undefined) {
          if (column.error_if_not_available !== false) {
            throw new Error(`Configuration error: Could not find field ${column.field} in record ${JSON.stringify(record)}. Check the 'study_columns' section of the Discovery config.`);
          }
          if (column.value_if_not_available) {
            return column.value_if_not_available;
          }
          return 'Not available';
        }
        return value;
      }
    })
  });
  columns.push(
    {
      title: 'Tags',
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
      title: 'Access',
      render: (_, record) => (
        isAccesible(record, userAuthMapping)
        // userHasMethodForServiceOnResource(
        //   'read',
        //   '*',
        //   record[config.minimal_field_mapping.authz_field],
        //   userAuthMapping
        // )
        ? <UnlockOutlined />
        : <LockFilled />
      ),
    },
  );

  const [resources, setResources] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

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
            <h3 className='discovery-header__tags-header'>{config.tag_selector.title}</h3>
            <div className='discovery-header__tags'>
              {
                config.tag_categories.map( category => {
                  if (category.display === false) {
                    return null;
                  }
                  const tags = getTagsInCategory(category.name, resources);
                  return (<div className='discovery-header__tag-group' key={category.name}>
                    <h5>{category.name}</h5>
                    <Space direction='vertical' size={4}>
                    { tags.map( tag =>
                      <Tag className='discovery-header__tag' color={category.color} key={category.name + tag}>{tag}</Tag>
                    )}
                    </Space>
                  </div>)
                })
              }
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
          onRow={(record) => ({
            onClick: () => {
              setModalVisible(true);
              setModalData(record);
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
      title={ config.study_page_fields.header &&
        <Space align='baseline'>
          <h3 className='discovery-modal__header-text'>{modalData && modalData[config.study_page_fields.header.field]}</h3>
          <StarOutlined />
          <LinkOutlined />
        </Space>
      }
      footer={false}
    >
          <Space direction='vertical' size='large'>
            { config.study_page_fields.fields_to_show.map( (fieldGroup, i) => (
              <Space key={i} direction='vertical' className='discovery-modal__attribute-group'>
                { fieldGroup.include_name &&
                  <h3 className='discovery-modal__attribute-group-name'>{fieldGroup.group_name}</h3>
                }
                { fieldGroup.fields.map( field => {
                  // display nothing if selected resource doesn't have this field
                  // and this field isn't configured to show a default value
                  if (!modalData || (!modalData[field.field] && !field.include_if_not_available)) {
                    return null;
                  }
                  return (
                    <Space key={field.name} align='start' className='discovery-modal__attribute'>
                      { field.include_name !== false &&
                        <span className='discovery-modal__attribute-name'>{field.name}</span>
                      }
                      <span className='discovery-modal__attribute-value'>
                        { modalData[field.field]
                          ? renderFieldContent(modalData[field.field], field.content_type)
                          : (field.value_if_not_available || 'Not available')
                        }
                      </span>
                    </Space>
                  )
                })}
              </Space>
            ))}
          </Space>
    </Modal>
  </div>);
}

export default DiscoveryBeta;
