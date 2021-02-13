import React, { useState, useEffect } from 'react';
import uniq from 'lodash/uniq';
import sum from 'lodash/sum';
import * as JsSearch from 'js-search';
import { LockFilled, LinkOutlined, UnlockOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Input,
  Table,
  Tag,
  Radio,
  Space,
  Modal,
  Alert,
  Popover,
} from 'antd';

import { DiscoveryConfig } from './DiscoveryConfig';
import './Discovery.css';


const accessibleFieldName = '__accessible';

const ARBORIST_READ_PRIV = 'read';
export enum AccessLevel {
  BOTH = 'both',
  ACCESSIBLE = 'accessible',
  UNACCESSIBLE = 'unaccessible',
}

const getTagColor = (tagCategory: string, config: DiscoveryConfig): string => {
  const categoryConfig = config.tagCategories.find(category => category.name === tagCategory);
  if (categoryConfig === undefined) {
    // eslint-disable-next-line no-console
    console.error(`Misconfiguration error: tag category ${tagCategory} not found in config. Check the 'tag_categories' section of the Discovery page config.`);
    return 'gray';
  }
  return categoryConfig.color;
};
interface AggregationConfig {
  name: string
  field: string
  type: 'sum' | 'count'
}

const renderAggregation = (aggregation: AggregationConfig, studies: any[] | null): string => {
  if (!studies) {
    return '';
  }
  const { field, type } = aggregation;
  const fields = studies.map(s => s[field]);
  switch (type) {
  case 'sum':
    return sum(fields).toLocaleString();
  case 'count':
    return uniq(fields).length.toLocaleString();
  default:
    throw new Error(`Misconfiguration error: Unrecognized aggregation type ${type}. Check the 'aggregations' block of the Discovery page config.`);
  }
};

// getTagsInCategory returns a list of the unique tags in studies which belong
// to the specified category.
const getTagsInCategory =
  (category: string, studies: any[] | null, config: DiscoveryConfig): string[] => {
    if (!studies) {
      return [];
    }
    const tagMap = {};
    studies.forEach((study) => {
      const tagField = config.minimalFieldMapping.tagsListFieldName;
      study[tagField].forEach((tag) => {
        if (tag.category === category) {
          tagMap[tag.name] = true;
        }
      });
    });
    return Object.keys(tagMap);
  };

const renderFieldContent = (content: any, contentType: 'string'|'paragraphs'|'number' = 'string'): string => {
  switch (contentType) {
  case 'string':
    return content;
  case 'number':
    return content.toLocaleString();
  case 'paragraphs':
    return content.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>);
  default:
    throw new Error(`Unrecognized content type ${contentType}. Check the 'study_page_fields' section of the Discovery config.`);
  }
};

const highlightSearchTerm = (value: string, searchTerm: string, highlighClassName = 'matched'): {highlighted: React.ReactNode, matchIndex: number} => {
  const matchIndex = value.toLowerCase().indexOf(searchTerm.toLowerCase());
  const noMatchFound = matchIndex === -1;
  if (noMatchFound) {
    return { highlighted: value, matchIndex: -1 };
  }
  const prev = value.slice(0, matchIndex);
  const matched = value.slice(matchIndex, matchIndex + searchTerm.length);
  const after = value.slice(matchIndex + searchTerm.length);
  return {
    highlighted: (
      <React.Fragment>
        {prev}
        <span className={highlighClassName}>{matched}</span>
        {after}
      </React.Fragment>
    ),
    matchIndex,
  };
};

const filterByAccessLevel =
  (studies: any[], accessLevel: AccessLevel, accessibleProperty: string): any[] => {
    switch (accessLevel) {
    case AccessLevel.ACCESSIBLE:
      return studies.filter(r => r[accessibleProperty]);
    case AccessLevel.UNACCESSIBLE:
      return studies.filter(r => !r[accessibleProperty]);
    case AccessLevel.BOTH:
      return studies;
    default:
      throw new Error(`Unrecognized access level ${accessLevel}.`);
    }
  };

const filterByTags = (studies: any[], selectedTags: any): any[] => {
  // if no tags selected, show all studies
  if (Object.values(selectedTags).every(selected => !selected)) {
    return studies;
  }
  return studies.filter(study => study.tags.some(tag => selectedTags[tag.name]));
};

interface DiscoveryBetaProps {
  config: DiscoveryConfig
  studies: {__accessible: boolean, [any: string]: any}[]
  params?: {studyUID: string} // from React Router
}

const Discovery: React.FunctionComponent<DiscoveryBetaProps> = (props: DiscoveryBetaProps) => {
  const { config } = props;

  const [jsSearch, setJsSearch] = useState(null);
  const [searchFilteredResources, setSearchFilteredResources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [accessLevel, setAccessLevel] = useState(AccessLevel.BOTH);
  const [selectedTags, setSelectedTags] = useState({});

  useEffect(() => {
    // Load studies into JS Search.
    const search = new JsSearch.Search(config.minimalFieldMapping.uid);
    search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
    // Enable search only over text fields present in the table
    config.studyColumns.forEach((column) => {
      if (!column.contentType || column.contentType === 'string') {
        search.addIndex(column.field);
      }
    });
    // Also enable search over preview field if present
    if (config.studyPreviewField) {
      search.addIndex(config.studyPreviewField.field);
    }
    // Index the studies
    search.addDocuments(props.studies);
    // expose the search function
    setJsSearch(search);
    // -----------------------
    setSearchFilteredResources(props.studies);
  }, [props.studies]);

  useEffect(() => {
    // If opening to a study by default, open that study
    if (props.params.studyUID) {
      const studyID = props.params.studyUID;
      const defaultModalData = props.studies.find(
        r => r[config.minimalFieldMapping.uid] === studyID);
      if (defaultModalData) {
        setModalData(defaultModalData);
        setModalVisible(true);
      } else {
        // eslint-disable-next-line no-console
        console.error(`Could not find study with UID ${studyID}.`);
      }
    }
  }, [props.params.studyUID, props.studies]);

  // Set up table columns
  // -----
  const columns = config.studyColumns.map(column => ({
    title: column.name,
    render: (_, record) => {
      const value = record[column.field];
      if (value === undefined) {
        if (column.errorIfNotAvailable !== false) {
          throw new Error(`Configuration error: Could not find field ${column.field} in record ${JSON.stringify(record)}. Check the 'study_columns' section of the Discovery config.`);
        }
        if (column.valueIfNotAvailable) {
          return column.valueIfNotAvailable;
        }
        return 'Not available';
      }
      if (!column.contentType || column.contentType === 'string') {
        // Show search highlights if there's an active search term
        if (searchTerm) {
          return highlightSearchTerm(value, searchTerm).highlighted;
        }
      }
      return renderFieldContent(value, column.contentType);
    },
  }),
  );
  columns.push(
    {
      title: 'Tags',
      render: (_, record) => (
        <React.Fragment>
          {record.tags.map(({ name, category }) => {
            const isSelected = !!selectedTags[name];
            const color = getTagColor(category, config);
            return (
              <Tag
                key={record.name + name}
                role='button'
                tabIndex={0}
                aria-pressed={isSelected ? 'true' : 'false'}
                className={`discovery-header__tag-btn discovery-tag ${isSelected ? 'discovery-tag--selected' : ''}`}
                aria-label={name}
                style={{
                  backgroundColor: isSelected ? color : 'initial',
                  borderColor: color,
                }}
                onKeyPress={(ev) => {
                  ev.stopPropagation();
                  setSelectedTags({
                    ...selectedTags,
                    [name]: selectedTags[name] ? undefined : true,
                  });
                }}
                onClick={(ev) => {
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
  );
  if (config.features.authorization.enabled) {
    columns.push({
      title: 'Access',
      render: (_, record) => (
        record[accessibleFieldName]
          ? (
            <Popover
              overlayClassName='discovery-table__access-popover'
              placement='topRight'
              arrowPointAtCenter
              title={'You have access to this study.'}
              content={<div className='discovery-table__access-popover-text'>
                <>You have <code>{ARBORIST_READ_PRIV}</code> access to</>
                <><code>{record[config.minimalFieldMapping.authzField]}</code>.</>
              </div>}
            >
              <UnlockOutlined className='discovery-table__access-icon' />
            </Popover>
          )
          : (
            <Popover
              overlayClassName='discovery-table__access-popover'
              placement='topRight'
              arrowPointAtCenter
              title={'You do not have access to this study.'}
              content={
                <div className='discovery-table__access-popover-text'>
                  <>You don&apos;t have <code>{ARBORIST_READ_PRIV}</code> access to</>
                  <><code>{record[config.minimalFieldMapping.authzField]}</code>.</>
                </div>
              }
            >
              <LockFilled className='discovery-table__access-icon' />
            </Popover>
          )
      ),
    });
  }
  // -----

  const handleSearchChange = (ev) => {
    const value = ev.currentTarget.value;
    setSearchTerm(value);
    if (value === '') {
      setSearchFilteredResources(props.studies);
      return;
    }
    if (!jsSearch) {
      return;
    }
    const results = jsSearch.search(value);
    setSearchFilteredResources(results);
  };

  const handleAccessLevelChange = (ev) => {
    const value = ev.target.value as AccessLevel;
    setAccessLevel(value);
  };

  const visibleResources = filterByTags(
    filterByAccessLevel(searchFilteredResources, accessLevel, accessibleFieldName),
    selectedTags,
  );

  return (<div className='discovery-container'>
    { (config.features.pageTitle && config.features.pageTitle.enabled) &&
      <h1 className='discovery-page-title'>{config.features.pageTitle.text || 'Discovery'}</h1>
    }
    <div className='discovery-header'>
      <div className='discovery-header__stats-container'>
        {
          config.aggregations.map((aggregation, i) => (
            <React.Fragment key={aggregation.name} >
              { i !== 0 && <div className='discovery-header__stat-border' /> }
              <div className='discovery-header__stat' >
                <div className='discovery-header__stat-number'>
                  {renderAggregation(aggregation, visibleResources)}
                </div>
                <div className='discovery-header__stat-label'>
                  {aggregation.name}
                </div>
              </div>
            </React.Fragment>
          ))
        }
      </div>
      <div className='discovery-header__tags-container' >
        <h3 className='discovery-header__tags-header'>{config.tagSelector.title}</h3>
        <div className='discovery-header__tags'>
          {
            config.tagCategories.map((category) => {
              if (category.display === false) {
                return null;
              }
              const tags = getTagsInCategory(category.name, props.studies, config);
              return (<div className='discovery-header__tag-group' key={category.name}>
                <h5>{category.name}</h5>
                { tags.map(tag =>
                  (<Tag
                    key={category.name + tag}
                    role='button'
                    tabIndex={0}
                    aria-pressed={selectedTags[tag] ? 'true' : 'false'}
                    className={`discovery-header__tag-btn discovery-tag ${selectedTags[tag] && 'discovery-tag--selected'}`}
                    aria-label={tag}
                    style={{
                      backgroundColor: selectedTags[tag] ? category.color : 'initial',
                      borderColor: category.color,
                    }}
                    onKeyPress={() => {
                      setSelectedTags({
                        ...selectedTags,
                        [tag]: selectedTags[tag] ? undefined : true,
                      });
                    }}
                    onClick={() => {
                      setSelectedTags({
                        ...selectedTags,
                        [tag]: selectedTags[tag] ? undefined : true,
                      });
                    }}
                  >
                    {tag}
                  </Tag>),
                )}
              </div>);
            })
          }
        </div>
      </div>
    </div>
    <div className='discovery-table-container'>
      <div className='discovery-table__header'>
        { config.features.search.searchBar.enabled &&
            <Input
              className='discovery-search'
              prefix={<SearchOutlined />}
              placeholder={config.features.search.searchBar.placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              size='large'
              allowClear
            />
        }
        { config.features.authorization.enabled &&
            <div className='disvovery-table__controls'>
              <Radio.Group
                onChange={handleAccessLevelChange}
                value={accessLevel}
                className='discovery-access-selector'
                defaultValue='both'
                buttonStyle='solid'
              >
                <Radio.Button value={AccessLevel.BOTH}>All</Radio.Button>
                <Radio.Button value={AccessLevel.UNACCESSIBLE}><LockFilled /></Radio.Button>
                <Radio.Button value={AccessLevel.ACCESSIBLE}><UnlockOutlined /></Radio.Button>
              </Radio.Group>
            </div>
        }
      </div>
      <Table
        columns={columns}
        rowKey={config.minimalFieldMapping.uid}
        rowClassName='discovery-table__row'
        onRow={record => ({
          onClick: () => {
            setModalVisible(true);
            setModalData(record);
          },
          onKeyPress: () => {
            setModalVisible(true);
            setModalData(record);
          },
        })}
        dataSource={visibleResources}
        expandable={config.studyPreviewField && ({
          // expand all rows
          expandedRowKeys: visibleResources.map(r => r[config.minimalFieldMapping.uid]),
          expandedRowRender: (record) => {
            const studyPreviewText = record[config.studyPreviewField.field];
            const renderValue = (value: string | undefined): React.ReactNode => {
              if (!value) {
                if (config.studyPreviewField.includeIfNotAvailable) {
                  return config.studyPreviewField.valueIfNotAvailable;
                }
              }
              if (searchTerm) {
                // get index of searchTerm match
                const matchIndex = value.toLowerCase().indexOf(searchTerm.toLowerCase());
                if (matchIndex === -1) {
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
            };
            return (
              <div
                className='discovery-table__expanded-row-content'
                role='button'
                tabIndex={0}
                onClick={() => {
                  setModalData(record);
                  setModalVisible(true);
                }}
              >
                {renderValue(studyPreviewText)}
              </div>
            );
          },
          expandedRowClassName: () => 'discovery-table__expanded-row',
          expandIconColumnIndex: -1, // don't render expand icon
        })}
      />
    </div>
    <Modal
      className='discovery-modal'
      visible={modalVisible}
      onOk={() => setModalVisible(false)}
      onCancel={() => setModalVisible(false)}
      width='80vw'
      footer={false}
    >
      <Space style={{ width: '100%' }} direction='vertical' size='large'>
        { config.studyPageFields.header &&
          <Space align='baseline'>
            <h3 className='discovery-modal__header-text'>{modalData[config.studyPageFields.header.field]}</h3>
            <a href={`/discovery/${modalData[config.minimalFieldMapping.uid]}/`}><LinkOutlined /> Permalink</a>
          </Space>
        }
        { config.features.authorization.enabled &&
          (modalData[accessibleFieldName]
            ? (
              <Alert
                className='discovery-modal__access-alert'
                type='success'
                message={<><UnlockOutlined /> You have access to this study.</>}
              />
            )
            : (
              <Alert
                className='discovery-modal__access-alert'
                type='warning'
                message={<><LockFilled /> You do not have access to this study.</>}
              />
            )
          )
        }
        { config.studyPageFields.fieldsToShow.map((fieldGroup, i) => (
          <div key={i} className='discovery-modal__attribute-group'>
            { fieldGroup.includeName &&
                  <h3 className='discovery-modal__attribute-group-name'>{fieldGroup.groupName}</h3>
            }
            { fieldGroup.fields.map((field) => {
              // display nothing if selected study doesn't have this field
              // and this field isn't configured to show a default value
              if (!modalData[field.field] && !field.includeIfNotAvailable) {
                return null;
              }
              return (
                <div key={field.name} className='discovery-modal__attribute'>
                  { field.includeName !== false &&
                        <span className='discovery-modal__attribute-name'>{field.name}:</span>
                  }
                  <span className='discovery-modal__attribute-value'>
                    { modalData[field.field]
                      ? renderFieldContent(modalData[field.field], field.contentType)
                      : (field.valueIfNotAvailable || 'Not available')
                    }
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </Space>
    </Modal>
  </div>);
};

Discovery.defaultProps = {
  params: { studyUID: null },
};

export default Discovery;
