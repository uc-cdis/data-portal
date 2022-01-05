import React, { useState, useEffect } from 'react';
import * as JsSearch from 'js-search';
import {
  Tag, Popover, Space, Collapse, Button, Dropdown, Menu, Pagination, Tooltip,
} from 'antd';
import {
  UnlockOutlined, ClockCircleOutlined, DashOutlined, UpOutlined, DownOutlined, UndoOutlined, FilterFilled, FilterOutlined, MinusOutlined,
} from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import MenuItem from 'antd/lib/menu/MenuItem';
import { DiscoveryConfig } from './DiscoveryConfig';
import './Discovery.css';
import DiscoverySummary from './DiscoverySummary';
import DiscoveryTagViewer from './DiscoveryTagViewer';
import DiscoveryDropdownTagViewer from './DiscoveryDropdownTagViewer';
import DiscoveryListView from './DiscoveryListView';
import DiscoveryDetails from './DiscoveryDetails';
import DiscoveryAdvancedSearchPanel from './DiscoveryAdvancedSearchPanel';
import ReduxDiscoveryActionBar from './reduxer';
import DiscoveryMDSSearch from './DiscoveryMDSSearch';
import DiscoveryAccessibilityLinks from './DiscoveryAccessibilityLinks';

export const accessibleFieldName = '__accessible';

export enum AccessLevel {
  ACCESSIBLE = 1,
  UNACCESSIBLE = 2,
  PENDING = 3,
  NOT_AVAILABLE = 4,
}

export enum AccessSortDirection {
  ASCENDING='sort ascending', DESCENDING='sort descending', NONE='cancel sorting'
}

const { Panel } = Collapse;

const ARBORIST_READ_PRIV = 'read';

const getTagColor = (tagCategory: string, config: DiscoveryConfig): string => {
  const categoryConfig = config.tagCategories.find((category) => category.name === tagCategory);
  if (categoryConfig === undefined) {
    return 'gray';
  }
  return categoryConfig.color;
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

export const renderFieldContent = (content: any, contentType: 'string'|'paragraphs'|'number'|'link'|'tags' = 'string', config: DiscoveryConfig): React.ReactNode => {
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
        target='_blank'
        rel='noreferrer'
      >
        {content}
      </a>
    );
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
          className='discovery-header__tag-btn discovery-tag discovery-tag--selected'
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
  if (Object.values(selectedTags).every((selected) => !selected)) {
    return studies;
  }
  const tagField = config.minimalFieldMapping.tagsListFieldName;
  return studies.filter((study) => study[tagField].some((tag) => selectedTags[tag.name]));
};

interface FilterState {
  [key: string]: { [value: string]: boolean }
}

const filterByAdvSearch = (studies: any[], advSearchFilterState: FilterState, config: DiscoveryConfig): any[] => {
  // if no filters active, show all studies
  const noFiltersActive = Object.values(advSearchFilterState).every((selectedValues) => {
    if (Object.values(selectedValues).length === 0) {
      return true;
    }
    if (Object.values(selectedValues).every((selected) => !selected)) {
      return true;
    }
    return false;
  });
  if (noFiltersActive) {
    return studies;
  }
  return studies.filter((study) => Object.keys(advSearchFilterState).every((filterName) => {
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
    return filterValues.every((value) => studyFilterValues.includes(value));
  }));
};

export interface DiscoveryResource {
  [accessibleFieldName]: AccessLevel,
  [any: string]: any
}

interface Props {
  config: DiscoveryConfig
  studies: DiscoveryResource[]
  params?: {studyUID: string} // from React Router
  selectedResources,
  pagination: { currentPage: number, resultsPerPage: number },
  selectedTags,
  searchTerm: string,
  accessFilters: {
    [accessLevel: number]: boolean
  },
  accessSortDirection: AccessSortDirection,
  onSearchChange: (arg0: string) => any,
  onTagsSelected: (arg0: any) => any,
  onAccessFilterSet: (arg0: object) => any,
  onAccessSortDirectionSet: (accessSortDirection: AccessSortDirection) => any,
  onResourcesSelected: (resources: DiscoveryResource[]) => any,
  onPaginationSet: (pagination: {currentPage: number, resultsPerPage: number}) => any,
}

const Discovery: React.FunctionComponent<Props> = (props: Props) => {
  const { config } = props;

  const [jsSearch, setJsSearch] = useState(null);
  const [accessibilityFilterVisible, setAccessibilityFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterState, setFilterState] = useState({} as FilterState);
  const [modalData, setModalData] = useState({});
  const [permalinkCopied, setPermalinkCopied] = useState(false);
  const [exportingToWorkspace, setExportingToWorkspace] = useState(false);
  const [advSearchFilterHeight, setAdvSearchFilterHeight] = useState('100vh');
  const [searchableTagCollapsed, setSearchableTagCollapsed] = useState(
    config.features.search.tagSearchDropdown
    && config.features.search.tagSearchDropdown.enabled
    && (config.features.search.tagSearchDropdown.collapseOnDefault
      || config.features.search.tagSearchDropdown.collapseOnDefault === undefined),
  );
  const [visibleResources, setVisibleResources] = useState([]);

  const handleSearchChange = (ev) => {
    const { value } = ev.currentTarget;
    props.onSearchChange(value);
  };

  const doSearchFilterSort = () => {
    let filteredResources = props.studies;
    if (jsSearch && props.searchTerm) {
      filteredResources = jsSearch.search(props.searchTerm);
    }
    filteredResources = filterByTags(
      filteredResources,
      props.selectedTags,
      config,
    );

    if (config.features.advSearchFilters && config.features.advSearchFilters.enabled) {
      filteredResources = filterByAdvSearch(
        filteredResources,
        filterState,
        config,
      );
    }

    if (props.config.features.authorization.enabled) {
      filteredResources = filteredResources.filter(
        (resource) => props.accessFilters[resource[accessibleFieldName]],
      );
    }

    filteredResources = filteredResources.sort(
      (a, b) => {
        if (props.accessSortDirection === AccessSortDirection.DESCENDING) {
          return a[accessibleFieldName] - b[accessibleFieldName];
        } if (props.accessSortDirection === AccessSortDirection.ASCENDING) {
          return b[accessibleFieldName] - a[accessibleFieldName];
        }
        return 0;
      },
    );
    setVisibleResources(filteredResources);
  };

  useEffect(doSearchFilterSort,
    [props.searchTerm, props.accessSortDirection, props.studies, props.pagination, props.accessFilters, props.selectedTags],
  );

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
  }, [props.studies]);

  useEffect(() => {
    // If opening to a study by default, open that study
    if (props.params.studyUID && props.studies.length > 0) {
      const studyID = decodeURIComponent(props.params.studyUID);
      const defaultModalData = props.studies.find(
        (r) => r[config.minimalFieldMapping.uid] === studyID);

      if (defaultModalData) {
        setPermalinkCopied(false);
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
  const columns: any = config.studyColumns.map((column) => ({
    title: <div className='discovery-table-header'>{column.name}</div>,
    ellipsis: !!column.ellipsis,
    textWrap: 'word-break',
    width: column.width,
    render: (_, record) => {
      let value = record[column.field];

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
        if (props.searchTerm) {
          if (Array.isArray(value)) {
            value = value.join(', ');
          }
          return highlightSearchTerm(value, props.searchTerm).highlighted;
        }
      }
      if (column.hrefValueFromField) {
        return <a href={`//${record[column.hrefValueFromField]}`} target='_blank' rel='noreferrer'>{ renderFieldContent(value, column.contentType, config) }</a>;
      }

      return renderFieldContent(value, column.contentType, config);
    },
  }),
  );
  columns.push(
    {
      textWrap: 'word-break',
      title: <div className='discovery-table-header'> { config.tagsDisplayName || 'Tags' }</div>,
      ellipsis: false,
      width: config.tagColumnWidth || '200px',
      render: (_, record) => (
        <React.Fragment>
          {record.tags.map(({ name, category }) => {
            const isSelected = !!props.selectedTags[name];
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
                className={`discovery-tag ${isSelected ? 'discovery-tag--selected' : ''}`}
                aria-label={name}
                style={{
                  backgroundColor: isSelected ? color : 'initial',
                  borderColor: color,
                }}
                onKeyPress={(ev) => {
                  ev.stopPropagation();
                  const selectedTags = {
                    ...props.selectedTags,
                    [name]: props.selectedTags[name] ? undefined : true,
                  };
                  props.onTagsSelected(selectedTags);
                }}
                onClick={(ev) => {
                  ev.stopPropagation();
                  const selectedTags = {
                    ...props.selectedTags,
                    [name]: props.selectedTags[name] ? undefined : true,
                  };
                  props.onTagsSelected(selectedTags);
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
      title: (
        <div className='discovery-table-header'>
          <Space size={'small'}>
            <div>Data Availability</div>
            <Tooltip title={'Filter by data access'}>
              <Dropdown
                visible={accessibilityFilterVisible}
                overlay={(
                  <Menu>
                    {
                      [
                        [AccessLevel.ACCESSIBLE, 'Available', <UnlockOutlined />],
                        [AccessLevel.NOT_AVAILABLE, 'Not Available', <DashOutlined />],
                        [AccessLevel.PENDING, 'Pending', <ClockCircleOutlined />],
                      ].map(
                        ([accessLevel, accessDescriptor, icon]: any[]) => (
                          <MenuItem key={accessLevel.toString()}>
                            <Checkbox
                              checked={props.accessFilters[accessLevel]}
                              onChange={
                                () => {
                                  props.onAccessFilterSet({
                                    ...props.accessFilters,
                                    [accessLevel]: !props.accessFilters[accessLevel],
                                  });
                                }
                              }
                            >
                              {icon}&nbsp;{accessDescriptor}
                            </Checkbox>
                          </MenuItem>
                        ),
                      )
                    }
                    <Menu.Divider />
                    <MenuItem key={'access-filter-buttons'}>
                      <Space size={'large'}>
                        <Button type={'default'} onClick={() => setAccessibilityFilterVisible(false)}>
                        OK
                        </Button>
                        <Button
                          type={'primary'}
                          onClick={() => props.onAccessFilterSet({
                            [AccessLevel.ACCESSIBLE]: true,
                            [AccessLevel.NOT_AVAILABLE]: true,
                            [AccessLevel.PENDING]: true,
                            [AccessLevel.UNACCESSIBLE]: true,
                          },
                          )}
                        > Reset
                        </Button>
                      </Space>
                    </MenuItem>
                  </Menu>
                )}
              >
                <Button
                  size={'large'}
                  type={'text'}
                  icon={
                    Object.values(props.accessFilters).every(Boolean)
                      ? <FilterOutlined />
                      : <FilterFilled color={'blue'} />
                  }
                  onClick={() => { setAccessibilityFilterVisible(!accessibilityFilterVisible); }}
                />
              </Dropdown>
            </Tooltip>
            {
              (() => {
                let nextSortDirection = AccessSortDirection.DESCENDING;
                if (props.accessSortDirection === AccessSortDirection.DESCENDING) {
                  nextSortDirection = AccessSortDirection.ASCENDING;
                } else if (props.accessSortDirection === AccessSortDirection.ASCENDING) {
                  nextSortDirection = AccessSortDirection.NONE;
                }
                return (
                  <Tooltip title={`Click to ${nextSortDirection}`}>
                    <Button
                      type={'text'}
                      onClick={() => props.onAccessSortDirectionSet(nextSortDirection)}
                      icon={
                        (() => {
                          if (props.accessSortDirection === AccessSortDirection.DESCENDING) {
                            return <DownOutlined />;
                          } if (props.accessSortDirection === AccessSortDirection.ASCENDING) {
                            return <UpOutlined />;
                          }
                          return <MinusOutlined />;
                        })()
                      }
                    />
                  </Tooltip>
                );
              })()
            }
          </Space>
        </div>),
      sortOrder: 'descend',
      ellipsis: false,
      width: '106px',
      textWrap: 'word-break',
      render: (_, record) => {
        if (record[accessibleFieldName] === AccessLevel.PENDING) {
          return (
            <Popover
              overlayClassName='discovery-popover'
              placement='topRight'
              arrowPointAtCenter
              content={(
                <div className='discovery-popover__text'>
                  This study will have data soon
                </div>
              )}
            >
              <ClockCircleOutlined className='discovery-table__access-icon' />
            </Popover>
          );
        }
        if (record[accessibleFieldName] === AccessLevel.NOT_AVAILABLE) {
          return (
            <Popover
              overlayClassName='discovery-popover'
              placement='topRight'
              arrowPointAtCenter
              content={(
                <div className='discovery-popover__text'>
                This study does not have any data yet.
                </div>
              )}
            >
              <DashOutlined className='discovery-table__access-icon' />
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
              content={(
                <div className='discovery-popover__text'>
                  <React.Fragment>You have <code>{ARBORIST_READ_PRIV}</code> access to</React.Fragment>
                  <React.Fragment><code>{record[config.minimalFieldMapping.authzField]}</code>.</React.Fragment>
                </div>
              )}
            >
              <UnlockOutlined className='discovery-table__access-icon' />
            </Popover>
          );
        }
        return <React.Fragment />;
        /* Hiding the closed lock for the HEAL project.
          This may be useful functionality for other commons.
          Keeping the logic for now.
           https://ctds-planx.atlassian.net/browse/HP-393
        */
        // return (
        //   <Popover
        //     overlayClassName='discovery-popover'
        //     placement='topRight'
        //     arrowPointAtCenter
        //     title={'You do not have access to this study.'}
        //     content={(
        //       <div className='discovery-popover__text'>
        //         <React.Fragment>You don&apos;t have <code>{ARBORIST_READ_PRIV}</code> access to</React.Fragment>
        //         <React.Fragment><code>{record[config.minimalFieldMapping.authzField]}</code>.</React.Fragment>
        //       </div>
        //     )}
        //   >
        //     {/* <EyeInvisibleOutlined className='discovery-table__access-icon' /> */}
        //     ---
        //   </Popover>
        // );
      },
    });
  }
  // -----

  const enableSearchBar = props.config.features.search
  && props.config.features.search.searchBar
  && props.config.features.search.searchBar.enabled;

  const enableSearchableTags = props.config.features.search
  && props.config.features.search.tagSearchDropdown
  && props.config.features.search.tagSearchDropdown.enabled;

  // Disabling noninteractive-tabindex rule because the span tooltip must be focusable as per https://www.w3.org/TR/2017/REC-wai-aria-1.1-20171214/#tooltip
  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    <div className='discovery-container'>
      { (config.features.pageTitle && config.features.pageTitle.enabled)
      && <h1 className='discovery-page-title'>{config.features.pageTitle.text || 'Discovery'}</h1>}

      <DiscoveryAccessibilityLinks />

      {/* Header with stats */}
      <div className='discovery-header'>
        <DiscoverySummary
          visibleResources={visibleResources}
          config={config}
        />
        {(enableSearchableTags) ? (
          <div className='discovery-header__dropdown-tags-container' id='discovery-tag-filters'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <div className='discovery-header__dropdown-tags-control-panel'>
                {(enableSearchBar)
                && (
                  <div className='discovery-search-container discovery-header__dropdown-tags-search'>
                    <DiscoveryMDSSearch
                      searchTerm={props.searchTerm}
                      handleSearchChange={handleSearchChange}
                      inputSubtitle={config.features.search.searchBar.inputSubtitle}
                    />
                  </div>
                )}
                <div className='discovery-header__dropdown-tags-buttons'>
                  <Button
                    type='default'
                    className={'discovery-header__dropdown-tags-control-button'}
                    disabled={Object.keys(props.selectedTags).length === 0}
                    onClick={() => { props.onTagsSelected({}); }}
                    icon={<UndoOutlined />}
                  >
                    {'Reset Selection'}
                  </Button>
                  <Button
                    type='default'
                    className={'discovery-header__dropdown-tags-control-button'}
                    onClick={() => { setSearchableTagCollapsed(!searchableTagCollapsed); }}
                    icon={(searchableTagCollapsed) ? <DownOutlined /> : <UpOutlined />}
                  >
                    {`${props.config.features.search.tagSearchDropdown.collapsibleButtonText || 'Tag Panel'}`}
                  </Button>
                </div>
              </div>
              <Collapse activeKey={(searchableTagCollapsed) ? '' : '1'} ghost>
                <Panel className='discovery-header__dropdown-tags-display-panel' header='' key='1'>
                  <div className='discovery-header__dropdown-tags'>
                    <DiscoveryDropdownTagViewer
                      config={config}
                      studies={props.studies}
                      selectedTags={props.selectedTags}
                      setSelectedTags={props.onTagsSelected}
                    />
                  </div>
                </Panel>
              </Collapse>
            </Space>
          </div>
        ) : (
          <DiscoveryTagViewer
            config={config}
            studies={props.studies}
            selectedTags={props.selectedTags}
            setSelectedTags={props.onTagsSelected}
          />
        )}
      </div>

      <div className='discovery-studies-container'>
        {/* Free-form text search box */}
        { (enableSearchBar && !enableSearchableTags
        )
            && (
              <div className='discovery-search-container discovery-search-container__standalone'>
                <DiscoveryMDSSearch
                  searchTerm={props.searchTerm}
                  handleSearchChange={handleSearchChange}
                  inputSubtitle={config.features.search.searchBar.inputSubtitle}
                />
              </div>
            )}

        {/* Bar with actions, stats, around advanced search and data actions */}
        <ReduxDiscoveryActionBar
          config={props.config}
          exportingToWorkspace={exportingToWorkspace}
          setExportingToWorkspace={setExportingToWorkspace}
          filtersVisible={filtersVisible}
          setFiltersVisible={setFiltersVisible}
        />

        {/* Advanced search panel */}
        { (
          props.config.features.advSearchFilters
          && props.config.features.advSearchFilters.enabled
          && filtersVisible
        )
        && (
          <div
            className='discovery-filters'
            style={{
              height: advSearchFilterHeight,
            }}
          >
            <DiscoveryAdvancedSearchPanel
              config={props.config}
              studies={props.studies}
              filterState={filterState}
              setFilterState={setFilterState}
            />
          </div>
        )}

        <div id='discovery-table-of-records' className={`discovery-table-container ${filtersVisible ? 'discovery-table-container--collapsed' : ''}`}>
          <Space direction={'vertical'} style={{ width: '100%' }}>
            <DiscoveryListView
              config={config}
              studies={props.studies}
              visibleResources={
                visibleResources.slice(
                  (props.pagination.currentPage - 1) * props.pagination.resultsPerPage,
                  props.pagination.currentPage * props.pagination.resultsPerPage,
                )
              }
              searchTerm={props.searchTerm}
              advSearchFilterHeight={advSearchFilterHeight}
              setAdvSearchFilterHeight={setAdvSearchFilterHeight}
              setPermalinkCopied={setPermalinkCopied}
              setModalData={setModalData}
              setModalVisible={setModalVisible}
              columns={columns}
              accessibleFieldName={accessibleFieldName}
              selectedResources={props.selectedResources}
              onResourcesSelected={props.onResourcesSelected}
            />
            <Pagination
              current={props.pagination.currentPage}
              pageSize={props.pagination.resultsPerPage}
              onChange={(currentPage, resultsPerPage) => props.onPaginationSet({ currentPage, resultsPerPage })}
              pageSizeOptions={['10', '20', '50', '100']}
              total={visibleResources.length}
              showSizeChanger
              style={{ float: 'right' }}
            />
          </Space>
        </div>

        <DiscoveryDetails
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          permalinkCopied={permalinkCopied}
          setPermalinkCopied={setPermalinkCopied}
          config={config}
          modalData={modalData}
        />
      </div>
    </div>
  );
};

Discovery.defaultProps = {
  params: { studyUID: null },
};

export default Discovery;
