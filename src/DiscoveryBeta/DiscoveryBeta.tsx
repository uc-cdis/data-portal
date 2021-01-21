import React, { useState, useEffect } from 'react';
import { uniq, sum } from 'lodash';
import * as JsSearch from 'js-search';
import { LockOutlined, LockFilled, LinkOutlined, UnlockOutlined, SearchOutlined, StarOutlined, StarFilled, StarTwoTone, CloseOutlined } from '@ant-design/icons';
import {
  Input,
  Table,
  Tag,
  Radio,
  Checkbox,
  Button,
  Space,
  Modal,
  Switch,
} from 'antd';

if (!useArboristUI) {
  throw new Error('Arborist UI must be enabled for the Discovery page to work. Set `useArboristUI: true` in the portal config.');
}
// DEV ONLY
import config from './mock_config.json';
import mock_data from './mock_mds_studies.json';
// END DEV ONLY

import { hostname, useArboristUI } from '../localconf';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';

import './DiscoveryBeta.css';

enum AccessLevel {
  BOTH = 'both',
  ACCESSIBLE = 'accessible',
  UNACCESSIBLE = 'unaccessible',
}

const getTagColor = (tagCategory: string): string => {
  const categoryConfig = config.tag_categories.find( category => category.name === tagCategory);
  if (categoryConfig === undefined) {
    console.error(`Misconfiguration error: tag category ${tagCategory} not found in config. Check the 'tag_categories' section of the Discovery page config.`)
    return 'gray';
  }
  return categoryConfig.color;
};

const isAccesible = (resource: any, userAuthMapping: any): boolean => {
  return userHasMethodForServiceOnResource('read', '*', resource.authz, userAuthMapping);
}

const accessibleFieldName = '__accessible';

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

const highlightSearchTerm = (value: string, searchTerm: string, highlighClassName = 'matched'): {highlighted: React.ReactNode, matchIndex: number} => {
  const matchIndex = value.toLowerCase().indexOf(searchTerm.toLowerCase());
  const noMatchFound = matchIndex === -1;
  if (noMatchFound) {
    return {highlighted: value, matchIndex: -1};
  }
  const prev = value.slice(0, matchIndex);
  const matched = value.slice(matchIndex, matchIndex + searchTerm.length)
  const after = value.slice(matchIndex + searchTerm.length);
  return {
    highlighted: (
      <React.Fragment>
        {prev}
        <span className={highlighClassName}>{matched}</span>
        {after}
      </React.Fragment>
    ),
    matchIndex
  };
}

const filterByAccessLevel = (resources: any[], accessLevel: AccessLevel, accessibleProperty: string): any[] => {
  switch(accessLevel) {
    case AccessLevel.ACCESSIBLE:
      return resources.filter(r => r[accessibleProperty]);
    case AccessLevel.UNACCESSIBLE:
      return resources.filter(r => !r[accessibleProperty]);
    case AccessLevel.BOTH:
      return resources;
    default:
      throw new Error(`Unrecognized access level ${accessLevel}.`);
  }
}

const filterByTags = (resources: any[], selectedTags: any): any[] => {
  // if no tags selected, show all resources
  if (Object.values(selectedTags).every( selected => selected != true )) {
    return resources;
  }
  return resources.filter(resource => {
    return resource.tags.some( tag => selectedTags[tag.name]);
  });
}

interface DiscoveryBetaProps {
  // config: any
  userAuthMapping: any
  params: any // from React Router
}

const DiscoveryBeta: React.FunctionComponent<DiscoveryBetaProps> = (props) => {

  const {userAuthMapping} = props;

  // Set up table columns
  // -----
  const columns = config.study_columns.map( column => ({
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
        if (!column.content_type || column.content_type === 'string') {
          // Show search highlights if there's an active search term
          if (searchTerm) {
            return highlightSearchTerm(value, searchTerm).highlighted;
          }
        }
        return value;
      }
    })
  );
  columns.push(
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (_, record) => (
        <React.Fragment>
          {record.tags.map( ({name, category}) => {
            const isSelected = selectedTags[name] ? true : false
            const color = getTagColor(category);
            return (
              <Tag
                key={record.name + name}
                role='button'
                tabIndex={0}
                aria-pressed={isSelected ? 'true' : 'false'}
                className={`discovery-header__tag-btn discovery-tag ${isSelected && 'discovery-tag--selected'}`}
                aria-label={name}
                style={{
                  backgroundColor: isSelected ? color : 'initial',
                  borderColor: color
                  }}
                onKeyPress={ (ev) => {
                  ev.stopPropagation();
                  setSelectedTags({
                    ...selectedTags,
                    [name]: selectedTags[name] ? undefined : true,
                  });
                }}
                onClick={ (ev) => {
                  ev.stopPropagation();
                  setSelectedTags({
                    ...selectedTags,
                    [name]: selectedTags[name] ? undefined : true,
                  });
                }}
              >
                {name}
              </Tag>
            );
          })}
        </React.Fragment>
      ),
    },
    {
      title: 'Access',
      render: (_, record) => (
        record[accessibleFieldName]
        ? <UnlockOutlined />
        : <LockFilled />
      ),
    },
  );
  // -----

  const [jsSearch, setJsSearch] = useState(null);
  const [resources, setResources] = useState(null);
  const [searchFilteredResources, setSearchFilteredResources] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accessLevel, setAccessLevel] = useState(AccessLevel.BOTH);
  const [selectedTags, setSelectedTags] = useState({});

  useEffect(() => {


    // Load resources and index them
    loadResources().then( rs => {

      // Add a property to resources showing whether user has access to resources
      const resources = rs.map( resource => {
        return {
          ...resource,
          [accessibleFieldName]: isAccesible(resource, userAuthMapping)
        }
      });

      // Initialize JS search.
      // ------------------------
      const jsSearch = new JsSearch.Search(config.minimal_field_mapping.uid);
      jsSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
      // Enable search only over text fields present in the table
      config.study_columns.forEach( column => {
        if (!column.content_type || column.content_type === 'string') {
          jsSearch.addIndex(column.field);
        }
      });
      // Also enable search over preview field if present
      if (config.study_preview_field) {
        jsSearch.addIndex(config.study_preview_field.field);
      }
      // Index the resources
      jsSearch.addDocuments(resources);
      // expose the search function
      setJsSearch(jsSearch);
      // -----------------------

      setResources(resources);
      setSearchFilteredResources(resources);

      // If opening to a study by default, open that study
      if (props.params && props.params.studyUID) {
        const modalData = resources.find( r => r[config.minimal_field_mapping.uid] === props.params.studyUID );
        if (modalData) {
          setModalData(modalData);
          setModalVisible(true);
        } else {
          console.error(`Could not find study with UID ${props.params.studyUID}.`)
        }
      }
    }).catch(err => {
      // FIXME how to handle this / retry?
      throw new Error(err);
    });
  }, [])

  const handleSearchChange = ev => {
    const searchTerm = ev.currentTarget.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      setSearchFilteredResources(resources);
      return;
    }
    if (!jsSearch) {
      return;
    }
    const results = jsSearch.search(searchTerm);
    setSearchFilteredResources(results);
  };

  const handleAccessLevelChange = ev => {
    const accessLevel = ev.target.value as AccessLevel;
    setAccessLevel(accessLevel);
  }

  const visibleResources = searchFilteredResources !== null
    ? filterByTags(filterByAccessLevel(searchFilteredResources, accessLevel, accessibleFieldName), selectedTags)
    : null;

  return (<div className='discovery-container'>
    <h1 className='discovery-page-title'>DISCOVERY</h1>
    { visibleResources
      ? (<React.Fragment>
        <div className='discovery-header'>
          <div className='discovery-header__stats-container'>
            {
              config.aggregations.map( aggregation => (
                <div className='discovery-header__stat' key={aggregation.name}>
                  <div className='discovery-header__stat-number'>
                    {renderAggregation(aggregation, visibleResources)}
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
                    { tags.map( tag =>
                      <Tag
                        key={category.name + tag}
                        role='button'
                        tabIndex={0}
                        aria-pressed={selectedTags[tag] ? 'true' : 'false'}
                        className={`discovery-header__tag-btn discovery-tag ${selectedTags[tag] && 'discovery-tag--selected'}`}
                        aria-label={tag}
                        style={{
                          backgroundColor: selectedTags[tag] ? category.color : 'initial',
                          borderColor: category.color
                         }}
                        onKeyPress={ () => {
                          setSelectedTags({
                            ...selectedTags,
                            [tag]: selectedTags[tag] ? undefined : true,
                          })
                        }}
                        onClick={ () => {
                          setSelectedTags({
                            ...selectedTags,
                            [tag]: selectedTags[tag] ? undefined : true,
                          })
                        }}
                      >
                        {tag}
                      </Tag>
                    )}
                  </div>)
                })
              }
            </div>
          </div>
        </div>
        <div className='discovery-table-container'>
          <div className='discovery-table__header'>
            <Input
              className='discovery-table__search'
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className='disvovery-table__controls'>
              <Radio.Group
                onChange={handleAccessLevelChange}
                value={accessLevel}
                className='discovery-table__access-button'
                defaultValue='both'
                buttonStyle='solid'
              >
                <Radio.Button value={AccessLevel.BOTH}>All</Radio.Button>
                <Radio.Button value={AccessLevel.UNACCESSIBLE}><LockFilled /></Radio.Button>
                <Radio.Button value={AccessLevel.ACCESSIBLE}><UnlockOutlined /></Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <Table
            columns={columns}
            rowKey={config.minimal_field_mapping.uid}
            rowClassName='discovery-table__row'
            onRow={(record) => ({
              onClick: () => {
                setModalVisible(true);
                setModalData(record);
              },
              onKeyPress: () => {
                setModalVisible(true);
                setModalData(record);
              }
            })}
            dataSource={visibleResources}
            expandable={config.study_preview_field && ({
              expandedRowKeys: visibleResources.map(r => r[config.minimal_field_mapping.uid]), // expand all rows
              expandedRowRender: record => {
                const value = record[config.study_preview_field.field];
                const renderValue = (value: string | undefined): React.ReactNode => {
                  if (!value) {
                    if (config.study_preview_field.include_if_not_available) {
                      return config.study_preview_field.value_if_not_available;
                    }
                  }
                  if (searchTerm) {
                    // get index of searchTerm match
                    const matchIndex = value.toLowerCase().indexOf(searchTerm.toLowerCase());
                    if (matchIndex == -1) {
                      // if searchterm doesn't match this record, don't highlight anything
                      return value;
                    }
                    // Scroll the text to the search term and highlight the search term.
                    let start = matchIndex - 100;
                    if (start < 0) {
                      start = 0;
                    }
                    return (<React.Fragment>
                        { start > 0 && '...' }
                        {value.slice(start, matchIndex)}
                        <span className='matched'>{value.slice(matchIndex, matchIndex + searchTerm.length)}</span>
                        {value.slice(matchIndex + searchTerm.length)}
                      </React.Fragment>
                    );
                  }
                  return value;
                }
                return (
                  <div
                    className='discovery-table__expanded-row-content'
                    onClick={ () => {
                      setModalData(record);
                      setModalVisible(true);
                    }}
                  >
                    {renderValue(value)}
                  </div>
                );
              },
              expandedRowClassName: () => 'discovery-table__expanded-row',
              expandIconColumnIndex: -1, // don't render expand icon
            })}
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
          <a href={`/discovery/${modalData && modalData[config.minimal_field_mapping.uid]}/`}><LinkOutlined /> Permalink</a>
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
