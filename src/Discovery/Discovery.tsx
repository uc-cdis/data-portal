import React, { useState, useEffect } from 'react';
import * as JsSearch from 'js-search';
import {
  LockFilled, LinkOutlined, UnlockOutlined, DownloadOutlined,
} from '@ant-design/icons';
import {
  Tag,
  Space,
  Modal,
  Alert,
  Popover,
  Button,
  Collapse,
  List,
} from 'antd';
import Tooltip from 'rc-tooltip';

import { DiscoveryConfig } from './DiscoveryConfig';
import './Discovery.css';
import DiscoverySummary from './DiscoverySummary';
import DiscoveryTagViewer from './DiscoveryTagViewer';
import { DiscoveryListView } from './DiscoveryListView';
import { userAPIPath } from '../localconf';

const { Panel } = Collapse;

const accessibleFieldName = '__accessible';

const ARBORIST_READ_PRIV = 'read';

const getTagColor = (tagCategory: string, config: DiscoveryConfig): string => {
  const categoryConfig = config.tagCategories.find((category) => category.name === tagCategory);
  if (categoryConfig === undefined) {
    return 'gray';
  }
  return categoryConfig.color;
};

const viewPagination = () => {
  /*
    To ensure accessibility and 508 compliance, users should be able
    to bypass repetitive blocks of content to reach important areas of the
    page. This function brings focus to the Antd Discovery pagination.
    Our method here is verbose due to:
    https://github.com/ant-design/ant-design/issues/8305
  */
  const discoveryPagination = document.getElementsByClassName('ant-pagination-item ant-pagination-item-1 ant-pagination-item-active');
  if (discoveryPagination.length > 0) {
    discoveryPagination[0].id = 'discovery-pagination';
    const linkToPagination = document.getElementById('discovery-link-to-pagination');
    linkToPagination.click();
    // The scrollTo function requires a setTimeout in our app.
    // https://stackoverflow.com/questions/1174863/javascript-scrollto-method-does-nothing
    setTimeout(() => {
      window.scrollTo(0, discoveryPagination[0].offsetTop);
    }, 2);
  }
};

const accessibleDataFilterToggle = () => {
  /*
    To ensure accessibility and 508 compliance, users should be able
    to navigate popups, dropdowns, and click buttons using only
    keyboard controls. This function toggles the visibility of the
    Antd filter popup in the Discovery Table "Access" column and allows
    keyboard navigability of the displayed Antd checkboxes.
  */
  const filterPopup = document.querySelector('#discovery-table-of-records .ant-table-filter-column .ant-dropdown-trigger');
  if (filterPopup) {
    filterPopup.click();
    const antdCheckboxes = document.querySelectorAll('.ant-table-filter-dropdown .ant-checkbox-input');
    for (let i = 0; i < antdCheckboxes.length; i += 1) {
      antdCheckboxes[i].tabIndex = '0';
      antdCheckboxes[i].id = `accessibility-checkbox-${i}`;
      const clickThisElement = () => {
        this.click();
      };
      clickThisElement.bind(antdCheckboxes[i]);
      antdCheckboxes[i].onkeypress = clickThisElement;
    }
  }
};

interface ListItem {
  title: string,
  description: string,
  guid: string
}

const renderFieldContent = (content: any, contentType: 'string'|'paragraphs'|'number'|'link' = 'string'): React.ReactNode => {
  switch (contentType) {
  case 'string':
    return content;
  case 'number':
    return content.toLocaleString();
  case 'paragraphs':
    return content.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>);
  case 'link':
    return (
      <a
        onClick={(ev) => ev.stopPropagation()}
        onKeyPress={(ev) => ev.stopPropagation()}
        href={content}
      >
        {content}
      </a>
    );
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

const filterByTags = (studies: any[], selectedTags: any): any[] => {
  // if no tags selected, show all studies
  if (Object.values(selectedTags).every((selected) => !selected)) {
    return studies;
  }
  return studies.filter((study) => study.tags.some((tag) => selectedTags[tag.name]));
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
  const [exportingToWorkspace, setExportingToWorkspace] = useState(false);
  const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
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
        (r) => r[config.minimalFieldMapping.uid] === studyID);
      if (defaultModalData) {
        setModalData(defaultModalData);
        setModalVisible(true);
      } else {
        // eslint-disable-next-line no-console
        console.error(`Could not find study with UID ${studyID}.`);
      }
    }
  }, [props.params.studyUID, props.studies]);

  useEffect(() => {
    const filterPopup = document.querySelector('#discovery-table-of-records .ant-table-filter-column .ant-dropdown-trigger');
    if (filterPopup) {
      filterPopup.tabIndex = '0';
      filterPopup.onkeypress = accessibleDataFilterToggle;
    }
  });

  // Set up table columns
  // -----
  const columns = config.studyColumns.map((column) => ({
    title: column.name,
    ellipsis: !!column.ellipsis,
    textWrap: 'word-break',
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
      if (!column.contentType || column.contentType === 'string') {
        // Show search highlights if there's an active search term
        if (searchTerm) {
          return highlightSearchTerm(value, searchTerm).highlighted;
        }
      }
      if (column.hrefValueFromField) {
        return <a href={`//${record[column.hrefValueFromField]}`} target='_blank' rel='noreferrer'>{ renderFieldContent(value, column.contentType) }</a>;
      }

      return renderFieldContent(value, column.contentType);
    },
  }),
  );
  columns.push(
    {
      title: 'Tags',
      textWrap: 'word-break',
      ellipsis: false,
      width: config.tagColumnWidth || '200px',
      render: (_, record) => (
        <React.Fragment>
          {record.tags.map(({ name, category }) => {
            const isSelected = !!selectedTags[name];
            const color = getTagColor(category, config);
            if (typeof name !== 'string') {
              return null;
            }
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
      filters: [{
        text: <React.Fragment><UnlockOutlined />Accessible</React.Fragment>,
        value: true,
        id: 'accessible-data-filter',
      }, {
        text: <React.Fragment><LockFilled />Unaccessible</React.Fragment>,
        value: false,
        id: 'unaccessible-data-filter',
      }],
      onFilter: (value, record) => record[accessibleFieldName] === value,
      ellipsis: false,
      width: '106px',
      textWrap: 'word-break',
      render: (_, record) => (
        record[accessibleFieldName]
          ? (
            <Popover
              overlayClassName='discovery-popover'
              placement='topRight'
              arrowPointAtCenter
              title={'You have access to this study.'}
              content={(
                <div className='discovery-popover__text'>
                  <React.Fragment>You have <code>{ARBORIST_READ_PRIV}</code> access to</React.Fragment>
                  <React.Fragment><code>{record[config.minimalFieldMapping.authzField]}</code>.</React.Fragment>
                </div>
              )}
            >
              <UnlockOutlined className='discovery-table__access-icon' />
            </Popover>
          )
          : (
            <Popover
              overlayClassName='discovery-popover'
              placement='topRight'
              arrowPointAtCenter
              title={'You do not have access to this study.'}
              content={(
                <div className='discovery-popover__text'>
                  <React.Fragment>You don&apos;t have <code>{ARBORIST_READ_PRIV}</code> access to</React.Fragment>
                  <React.Fragment><code>{record[config.minimalFieldMapping.authzField]}</code>.</React.Fragment>
                </div>
              )}
            >
              <LockFilled className='discovery-table__access-icon' />
            </Popover>
          )
      ),
    });
  }

  const visibleResources = filterByTags(
    searchFilteredResources,
    selectedTags,
  );

  const tooltipText = 'These accessibility links assist with keyboard navigation of the site. Selecting a link will bring tab focus to the specified page content.';
  // Disabling noninteractive-tabindex rule because the span tooltip must be focusable as per https://www.w3.org/TR/2017/REC-wai-aria-1.1-20171214/#tooltip
  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    <div className='discovery-container'>
      { (config.features.pageTitle && config.features.pageTitle.enabled)
      && <h1 className='discovery-page-title'>{config.features.pageTitle.text || 'Discovery'}</h1>}
      <div className='g3-accessibility-links' id='discovery-page-accessibility-links'>
        <Tooltip
          placement='left'
          overlay={tooltipText}
          overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          width='300px'
          trigger={['hover', 'focus']}
        >
          <span className='g3-helper-tooltip g3-ring-on-focus' role='tooltip' tabIndex='0'>
            <i className='g3-icon g3-icon--sm g3-icon--question-mark-bootstrap help-tooltip-icon' />
          </span>
        </Tooltip>
        <a className='g3-accessibility-nav-link g3-ring-on-focus' href='#discovery-summary-statistics'><span>Summary Statistics</span></a> |
        <a className='g3-accessibility-nav-link g3-ring-on-focus' href='#discovery-tag-filters'><span>Tags</span></a> |
        <a className='g3-accessibility-nav-link g3-ring-on-focus' href='#discovery-table-of-records'><span>Table of Records</span></a> |
        <button className='g3-unstyle-btn g3-accessibility-nav-link g3-ring-on-focus' onClick={viewPagination} type='button'>Pagination </button>
        <a className='discovery-hidden-link' id='discovery-link-to-pagination' href='#discovery-pagination'><span>Pagination</span></a>
      </div>
      <div className='discovery-header'>
        <DiscoverySummary
          visibleResources={visibleResources}
          config={config}
        />
        <div className='discovery-header__stat-border' />
        <DiscoveryTagViewer
          config={config}
          studies={props.studies}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>
      <DiscoveryListView
        config={config}
        studies={props.studies}
        visibleResources={visibleResources}
        selectedResources={selectedResources}
        setSelectedResources={setSelectedResources}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSearchFilteredResources={setSearchFilteredResources}
        jsSearch={jsSearch}
        setModalData={setModalData}
        setModalVisible={setModalVisible}
        columns={columns}
        setExportingToWorkspace={setExportingToWorkspace}
        accessibleFieldName={accessibleFieldName}
        exportingToWorkspace={exportingToWorkspace}
        history={props.history}
      />
      <Modal
        className='discovery-modal'
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width='80vw'
        footer={false}
      >
        <Space style={{ width: '100%' }} direction='vertical' size='large'>
          { config.studyPageFields.header
          && (
            <Space align='baseline'>
              <h3 className='discovery-modal__header-text'>{modalData[config.studyPageFields.header.field]}</h3>
              <a href={`/discovery/${modalData[config.minimalFieldMapping.uid]}/`}><LinkOutlined /> Permalink</a>
            </Space>
          )}
          { config.features.authorization.enabled
          && (modalData[accessibleFieldName]
            ? (
              <Alert
                className='discovery-modal__access-alert'
                type='success'
                message={<React.Fragment><UnlockOutlined /> You have access to this study.</React.Fragment>}
              />
            )
            : (
              <Alert
                className='discovery-modal__access-alert'
                type='warning'
                message={<React.Fragment><LockFilled /> You do not have access to this study.</React.Fragment>}
              />
            )
          )}
          { config.studyPageFields.fieldsToShow.map((fieldGroup, i) => (
            <div key={i} className='discovery-modal__attribute-group'>
              { fieldGroup.includeName
                  && <h3 className='discovery-modal__attribute-group-name'>{fieldGroup.groupName}</h3>}
              { fieldGroup.fields.map((field) => {
              // display nothing if selected study doesn't have this field
              // and this field isn't configured to show a default value
                if (!modalData[field.field] && !field.includeIfNotAvailable) {
                  return null;
                }
                return (
                  <div key={field.name} className='discovery-modal__attribute'>
                    { field.includeName !== false
                        && <span className='discovery-modal__attribute-name'>{field.name}:</span>}
                    <span className='discovery-modal__attribute-value'>
                      { modalData[field.field]
                        ? renderFieldContent(modalData[field.field], field.contentType)
                        : (field.valueIfNotAvailable || 'Not available')}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          { (config.studyPageFields.downloadLinks && config.studyPageFields.downloadLinks.field
        && modalData[config.studyPageFields.downloadLinks.field])
            ? (
              <Collapse defaultActiveKey={['1']}>
                <Panel header={config.studyPageFields.downloadLinks.name || 'Data Download Links'} key='1'>
                  <List
                    itemLayout='horizontal'
                    dataSource={modalData[config.studyPageFields.downloadLinks.field]}
                    renderItem={(item:ListItem) => (
                      <List.Item
                        actions={[
                          <Button
                            href={`${userAPIPath}/data/download/${item.guid}?expires_in=900&redirect`}
                            target='_blank'
                            type='text'
                            // disable button if data has no GUID
                            disabled={!item.guid}
                            icon={<DownloadOutlined />}
                          >
                      Download File
                          </Button>]}
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
            )
            : null}
        </Space>
      </Modal>
    </div>
  );
};

Discovery.defaultProps = {
  history: [],
  params: { studyUID: null },
};

export default Discovery;
