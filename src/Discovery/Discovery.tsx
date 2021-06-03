import React, { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import uniq from 'lodash/uniq';
import sum from 'lodash/sum';
import memoize from 'lodash/memoize';

import * as JsSearch from 'js-search';
import {
  Input,
  Table,
  Tag,
  Space,
  Drawer,
  Alert,
  Popover,
  Button,
  Checkbox,
  Collapse,
} from 'antd';
import {
  LockFilled,
  LinkOutlined,
  UnlockOutlined,
  SearchOutlined,
  ExportOutlined,
  DownloadOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons';

import { fetchWithCreds } from '../actions';
import { manifestServiceApiPath } from '../localconf';
import { DiscoveryConfig } from './DiscoveryConfig';
import './Discovery.css';

const accessibleFieldName = '__accessible';
export enum AccessLevel {
  ACCESSIBLE,
  UNACCESSIBLE,
  NOTAVAILABLE
}

const ARBORIST_READ_PRIV = 'read';

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

const getFilterValuesByKey = memoize(
  (key: string, studies: any[] | null, config: DiscoveryConfig) => {
    if (!studies) {
      return [];
    }
    const filterValuesMap = {};
    studies.forEach((study) => {
      const filtersField = config.features.advSearchFilters.field;
      if (!filtersField) {
        throw new Error('Misconfiguration error: missing required configuration property `discoveryConfig.features.advSearchFilters.field`');
      }
      if (!study[filtersField]) {
        // eslint-disable-next-line no-console
        console.warn(`Warning: expected to find property '${config.features.advSearchFilters.field}' in study metadata for study ${study[config.minimalFieldMapping.uid]}, but could not find it! This study will not be filterable by the advanced search filters.`);
        return;
      }
      try {
        study[filtersField].forEach((filterValue) => {
          if (filterValue.key === key) {
            filterValuesMap[filterValue.value] = true;
          }
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        // eslint-disable-next-line no-console
        console.error(`The above error appeared in study ${study[config.minimalFieldMapping.uid]}`);
      }
    });
    return Object.keys(filterValuesMap);
  },
);

const renderFieldContent = (content: any, contentType: 'string'|'paragraphs'|'number'|'link'|'tags' = 'string', config: DiscoveryConfig): React.ReactNode => {
  switch (contentType) {
  case 'string':
    return content;
  case 'number':
    return content.toLocaleString();
  case 'paragraphs':
    return content.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>);
  case 'link':
    return (<a
      onClick={ev => ev.stopPropagation()}
      onKeyPress={ev => ev.stopPropagation()}
      href={content}
    >
      {content}
    </a>);
  case 'tags':
    if (!content || !content.map) {
      return null;
    }
    return content.map(({ name, category }) => {
      const color = getTagColor(category, config);
      return (
        <Tag
          key={name}
          role='button'
          tabIndex={0}
          className='discovery-header__tag-btn discovery-tag '
          aria-label={name}
          style={{
            backgroundColor: color,
            borderColor: color,
          }}
        >
          {name}
        </Tag>
      );
    });
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

const filterByTags = (studies: any[], selectedTags: any, config: DiscoveryConfig): any[] => {
  // if no tags selected, show all studies
  if (Object.values(selectedTags).every(selected => !selected)) {
    return studies;
  }
  const tagField = config.minimalFieldMapping.tagsListFieldName;
  return studies.filter(study => study[tagField].some(tag => selectedTags[tag.name]));
};

interface FilterState {
  [key: string]: { [value: string]: boolean }
}

const filterByAdvSearch =
  (studies: any[], advSearchFilterState: FilterState, config: DiscoveryConfig): any[] => {
    // if no filters active, show all studies
    const noFiltersActive = Object.values(advSearchFilterState).every((selectedValues) => {
      if (Object.values(selectedValues).length === 0) {
        return true;
      }
      if (Object.values(selectedValues).every(selected => !selected)) {
        return true;
      }
      return false;
    });
    if (noFiltersActive) {
      return studies;
    }
    return studies.filter(study => Object.keys(advSearchFilterState).every((filterName) => {
      const filterValues = Object.keys(advSearchFilterState[filterName]);
      // Handle the edge case where no values in this filter are selected
      if (filterValues.length === 0) {
        return true;
      }
      const studyFilters = study[config.features.advSearchFilters.field];
      if (!studyFilters) {
        return false;
      }
      // combine within filters as OR
      // return studyFilters.some(({ key, value }) =>
      //   key === filterName && filterValues.includes(value));

      // combine within filters as AND
      const studyFilterValues = studyFilters.filter(({ key }) => key === filterName)
        .map(({ value }) => value);
      return filterValues.every(value => studyFilterValues.includes(value));
    }));
  };

interface DiscoveryBetaProps {
  config: DiscoveryConfig
  studies: {__accessible: boolean, [any: string]: any}[]
  history?: any // from React Router
  params?: {studyUID: string} // from React Router
}


const Discovery: React.FunctionComponent<DiscoveryBetaProps> = (props: DiscoveryBetaProps) => {
  const { config } = props;

  const [jsSearch, setJsSearch] = useState(null);
  const [searchFilteredResources, setSearchFilteredResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterState, setFilterState] = useState({} as FilterState);
  const [exportingToWorkspace, setExportingToWorkspace] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState({});

  useEffect(() => {
    // Load studies into JS Search.
    const search = new JsSearch.Search(config.minimalFieldMapping.uid);
    search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

    // Choose which fields in the data to make searchable.
    // If `searchableFields` are configured, enable search over only those fields.
    // Otherwise, default behavior: enable search over all non-numeric fields
    // in the table and the study description.
    // ---
    const searchableFields = config.features.search.searchBar.searchableTextFields;
    if (searchableFields) {
      searchableFields.forEach((field) => {
        search.addIndex(field);
      });
    } else {
      config.studyColumns.forEach((column) => {
        if (!column.contentType || column.contentType === 'string') {
          search.addIndex(column.field);
        }
      });
      // Also enable search over preview field if present
      if (config.studyPreviewField) {
        search.addIndex(config.studyPreviewField.field);
      }
    }
    // ---

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
    title: <div className='discovery-table-header'>{column.name}</div>,
    ellipsis: !!column.ellipsis,
    width: column.width,
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
      const columnIsSearchable = config.features.search.searchBar.searchableTextFields
        ? config.features.search.searchBar.searchableTextFields.indexOf(column.field) !== -1
        : !column.contentType || column.contentType === 'string';
      if (columnIsSearchable) {
        // Show search highlights if there's an active search term
        if (searchTerm) {
          return highlightSearchTerm(value, searchTerm).highlighted;
        }
      }
      return renderFieldContent(value, column.contentType, config);
    },
  }),
  );
  columns.push(
    {
      title: <div className='discovery-table-header'>Tags</div>,
      ellipsis: false,
      width: undefined,
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
      title: <div className='discovery-table-header'>Data Access</div>,
      filters: [
        {
          text: <><UnlockOutlined />Accessible</>,
          value: AccessLevel.ACCESSIBLE,
        },
        {
          text: <><LockFilled />Unaccessible</>,
          value: AccessLevel.UNACCESSIBLE,
        },
        {
          text: <><span style={{ color: 'gray' }}>n/a</span>&nbsp;No Data</>,
          value: AccessLevel.NOTAVAILABLE,
        },
      ],
      onFilter: (value, record) => record[accessibleFieldName] === value,
      ellipsis: false,
      width: undefined,
      render: (_, record) => {
        if (record[accessibleFieldName] === AccessLevel.NOTAVAILABLE) {
          return (
            <Popover
              overlayClassName='discovery-popover'
              placement='topRight'
              arrowPointAtCenter
              content={<div className='discovery-popover__text'>
                This study does not have any data yet.
              </div>}
            >
              <span style={{ color: 'gray' }}>n/a</span>
            </Popover>
          );
        }
        if (record[accessibleFieldName] === AccessLevel.ACCESSIBLE) {
          return (
            <Popover
              overlayClassName='discovery-popover'
              placement='topRight'
              arrowPointAtCenter
              title={'You have access to this study.'}
              content={<div className='discovery-popover__text'>
                <>You have <code>{ARBORIST_READ_PRIV}</code> access to</>
                <><code>{record[config.minimalFieldMapping.authzField]}</code>.</>
              </div>}
            >
              <UnlockOutlined className='discovery-table__access-icon' />
            </Popover>
          );
        }
        return (
          <Popover
            overlayClassName='discovery-popover'
            placement='topRight'
            arrowPointAtCenter
            title={'You do not have access to this study.'}
            content={
              <div className='discovery-popover__text'>
                <>You don&apos;t have <code>{ARBORIST_READ_PRIV}</code> access to</>
                <><code>{record[config.minimalFieldMapping.authzField]}</code>.</>
              </div>
            }
          >
            <LockFilled className='discovery-table__access-icon' />
          </Popover>
        );
      },
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

  const handleExportToWorkspaceClick = async () => {
    setExportingToWorkspace(true);
    const manifestFieldName = config.features.exportToWorkspaceBETA.manifestFieldName;
    if (!manifestFieldName) {
      throw new Error('Missing required configuration field `config.features.exportToWorkspaceBETA.manifestFieldName`');
    }
    // combine manifests from all selected studies
    const manifest = [];
    selectedResources.forEach((study) => {
      if (study[manifestFieldName]) {
        manifest.push(...study[manifestFieldName]);
      }
    });
    // post selected resources to manifestservice
    const res = await fetchWithCreds({
      path: `${manifestServiceApiPath}`,
      body: JSON.stringify(manifest),
      method: 'POST',
    });
    if (res.status !== 200) {
      throw new Error(`Encountered error while exporting to Workspace: ${JSON.stringify(res)}`);
    }
    setExportingToWorkspace(false);
    // redirect to Workspaces page
    props.history.push('/workspace');
  };

  const handleDownloadManifestClick = () => {
    const manifestFieldName = config.features.exportToWorkspaceBETA.manifestFieldName;
    if (!manifestFieldName) {
      throw new Error('Missing required configuration field `config.features.exportToWorkspaceBETA.manifestFieldName`');
    }
    // combine manifests from all selected studies
    const manifest = [];
    selectedResources.forEach((study) => {
      if (study[manifestFieldName]) {
        manifest.push(...study[manifestFieldName]);
      }
    });
    // download the manifest
    const MANIFEST_FILENAME = 'manifest.json';
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'text/json' });
    FileSaver.saveAs(blob, MANIFEST_FILENAME);
  };

  let visibleResources = filterByTags(
    searchFilteredResources,
    selectedTags,
    config,
  );
  visibleResources = filterByAdvSearch(
    visibleResources,
    filterState,
    config,
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
        { config.tagSelector.title &&
          <h3 className='discovery-header__tags-header'>{config.tagSelector.title}</h3>
        }
        <div className='discovery-header__tags'>
          {
            config.tagCategories.map((category) => {
              if (category.display === false) {
                return null;
              }
              const tags = getTagsInCategory(category.name, props.studies, config);
              return (<div className='discovery-header__tag-group' key={category.name}>
                { config.tagSelector.showTagCategoryNames &&
                  <h5>{category.name}</h5>
                }
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

    <div className='discovery-studies-container'>
      { (
        config.features.search && config.features.search.searchBar
          && config.features.search.searchBar.enabled
      ) &&
          <div className='discovery-search-container'>
            <Input
              className='discovery-search'
              suffix={<SearchOutlined style={{ color: 'rgb(139, 51, 105)' }} />}
              placeholder={config.features.search.searchBar.placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              allowClear
            />
          </div>
      }
      <div className='discovery-studies__header'>
        { (config.features.advSearchFilters && config.features.advSearchFilters.enabled) &&
          <Button
            style={{ color: 'rgb(139, 51, 105)', fontWeight: '700' }}
            onClick={() => setFiltersVisible(!filtersVisible)}
            type='text'
          >
            ADVANCED SEARCH
            { filtersVisible
              ? <LeftOutlined />
              : <RightOutlined />
            }
          </Button>
        }
        { (
          config.features.exportToWorkspaceBETA && config.features.exportToWorkspaceBETA.enabled
        ) &&
          <Space>
            <span className='discovery-export__selected-ct'>{selectedResources.length} selected</span>
            { config.features.exportToWorkspaceBETA.enableDownloadManifest &&
              <Popover
                className='discovery-popover'
                arrowPointAtCenter
                title={<>
                  Download a Manifest File for use with the&nbsp;
                  <a target='_blank' rel='noreferrer' href='https://gen3.org/resources/user/gen3-client/' >
                    {'Gen3 Client'}
                  </a>.
                </>}
                content={(<span className='discovery-popover__text'>With the Manifest File, you can use the Gen3 Client
                to download the data from the selected studies to your local computer.</span>)}
              >
                <Button
                  onClick={handleDownloadManifestClick}
                  type='text'
                  disabled={selectedResources.length === 0}
                  icon={<DownloadOutlined />}
                >
                  Download Manifest
                </Button>
              </Popover>
            }
            <Popover
              className='discovery-popover'
              arrowPointAtCenter
              content={<>
                Open selected studies in the&nbsp;
                <a target='blank' rel='noreferrer' href='https://gen3.org/resources/user/analyze-data/'>
                  {'Gen3 Workspace'}
                </a>.
              </>}
            >
              <Button
                type='default'
                style={{
                  color: selectedResources.length === 0 ? null : 'rgb(139, 51, 105)',
                  borderColor: selectedResources.length === 0 ? null : 'rgb(139, 51, 105)',
                }}
                disabled={selectedResources.length === 0}
                loading={exportingToWorkspace}
                icon={<ExportOutlined />}
                onClick={handleExportToWorkspaceClick}
              >
                Open In Workspace
              </Button>
            </Popover>
          </Space>
        }
      </div>
      { (
        config.features.advSearchFilters
          && config.features.advSearchFilters.enabled
          && filtersVisible
      )
        &&
          <div className='discovery-filters'>
            <Collapse
              bordered={false}
              defaultActiveKey={config.features.advSearchFilters.filters.map(f => f.key)}
            >
              { config.features.advSearchFilters.filters.map((filter) => {
                const { key, keyDisplayName } = filter;
                const values = getFilterValuesByKey(key, props.studies, config);
                return (
                  <Collapse.Panel header={keyDisplayName || key} key={key}>
                    <Space direction='vertical'>
                      { values.map((value) => {
                        const valueDisplayName =
                          (filter.valueDisplayNames && filter.valueDisplayNames[value])
                            ? filter.valueDisplayNames[value]
                            : value;
                        return (
                          <Checkbox
                            key={`${key}-${value}`}
                            checked={filterState[key] && filterState[key][value]}
                            onChange={(ev) => {
                              const newFilterState = Object.assign({}, filterState);
                              if (!newFilterState[key]) {
                                newFilterState[key] = {};
                              }
                              if (ev.target.checked) {
                                newFilterState[key][value] = true;
                              } else {
                                delete newFilterState[key][value];
                              }
                              setFilterState(newFilterState);
                            }
                            }
                          >
                            {valueDisplayName}
                          </Checkbox>
                        );
                      })}
                    </Space>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </div>
      }
      <div className={`discovery-table-container ${filtersVisible ? 'discovery-table-container--collapsed' : ''}`}>
        <Table
          width={'500px'}
          columns={columns}
          rowKey={config.minimalFieldMapping.uid}
          rowSelection={(
            config.features.exportToWorkspaceBETA && config.features.exportToWorkspaceBETA.enabled
          )
            && {
              selectedRowKeys: selectedResources.map(r => r[config.minimalFieldMapping.uid]),
              preserveSelectedRowKeys: true,
              onChange: (_, selectedRows) => setSelectedResources(selectedRows),
              getCheckboxProps: (record) => {
                let disabled;
                // if auth is enabled, disable checkbox if user doesn't have access
                if (config.features.authorization.enabled) {
                  disabled = record[accessibleFieldName] !== AccessLevel.ACCESSIBLE;
                }
                // disable checkbox if there's no manifest found for this study
                const manifestFieldName = config.features.exportToWorkspaceBETA.manifestFieldName;
                if (!record[manifestFieldName] || record[manifestFieldName].length === 0) {
                  disabled = true;
                }
                return { disabled };
              },
            }}
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
    </div>
    <Drawer
      className='discovery-modal'
      visible={modalVisible}
      width={'50vw'}
      closable
      onClose={() => setModalVisible(false)}
    >
      <div className='discovery-modal-content'>
        { config.studyPageFields.header &&
          <Space align='baseline'>
            <h3 className='discovery-modal__header-text'>{modalData[config.studyPageFields.header.field]}</h3>
            <a href={`/discovery/${modalData[config.minimalFieldMapping.uid]}/`}><LinkOutlined /> Permalink</a>
          </Space>
        }
        { (
          config.features.authorization.enabled
            && modalData[accessibleFieldName] !== AccessLevel.NOTAVAILABLE
        ) &&
          (modalData[accessibleFieldName] === AccessLevel.ACCESSIBLE
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
        <div className='discovery-modal-attributes-container'>
          { config.studyPageFields.fieldsToShow.map((fieldGroup, i) => {
            let groupWidth;
            switch (fieldGroup.groupWidth) {
            case 'full':
              groupWidth = 'fullwidth';
              break;
            case 'half':
            default:
              groupWidth = 'halfwidth';
              break;
            }
            return (<div key={i} className={`discovery-modal__attribute-group discovery-modal__attribute-group--${groupWidth}`}>
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
                        <span className='discovery-modal__attribute-name'>{field.name}</span>
                    }
                    <span className={`discovery-modal__attribute-value ${field.multiline ? 'discovery-modal__attribute-value--multiline' : ''}`}>
                      { modalData[field.field]
                        ? renderFieldContent(modalData[field.field], field.contentType, config)
                        : (field.valueIfNotAvailable || 'Not available')
                      }
                    </span>
                  </div>
                );
              })}
            </div>);
          })}
        </div>
      </div>
    </Drawer>
  </div>);
};

Discovery.defaultProps = {
  history: [],
  params: { studyUID: null },
};

export default Discovery;
