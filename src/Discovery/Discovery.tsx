import React, {
  useState, useEffect, ReactNode, useMemo,
  useRef,
} from 'react';
import * as JsSearch from 'js-search';
import jsonpath from 'jsonpath';
import {
  Tag, Space, Collapse, Button, Dropdown, Pagination, Tooltip, Spin,
} from 'antd';
import {
  LockOutlined,
  UnlockOutlined,
  ClockCircleOutlined,
  DashOutlined,
  UpOutlined,
  DownOutlined,
  UndoOutlined,
  FilterFilled,
  FilterOutlined,
  MinusOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { debounce } from 'lodash';
import doDebounceSearch from './Utils/Search/doDebounceSearch';
import { DiscoveryConfig } from './DiscoveryConfig';
import DiscoverySummary from './DiscoverySummary';
import DiscoveryTagViewer from './DiscoveryTagViewer';
import DiscoveryDropdownTagViewer from './DiscoveryDropdownTagViewer';
import DiscoveryListView from './DiscoveryListView';
import DiscoveryAdvancedSearchPanel from './DiscoveryAdvancedSearchPanel';
import { ReduxDiscoveryActionBar, ReduxDiscoveryDetails } from './reduxer';
import DiscoveryMDSSearch from './DiscoveryMDSSearch';
import DiscoveryAccessibilityLinks from './DiscoveryAccessibilityLinks';
import doSearchFilterSort from './Utils/Search/doSearchFilterSort';
import './Discovery.css';
import DiscoveryDataAvailabilityTooltips from './DiscoveryDataAvailabilityTooltips';
import isColumnSearchable from './Utils/Search/isColumnSearchable';

export const accessibleFieldName = '__accessible';

export enum AccessLevel {
  ACCESSIBLE = 1,
  UNACCESSIBLE = 2,
  WAITING = 3,
  NOT_AVAILABLE = 4,
  OTHER = 5,
  MIXED = 6,
}

export enum AccessSortDirection {
  ASCENDING = 'sort ascending', DESCENDING = 'sort descending', NONE = 'cancel sorting'
}

const { Panel } = Collapse;

const setUpMenuItemInfo = (menuItemInfo, supportedValues) => {
  if (supportedValues?.waiting?.enabled === true) {
    menuItemInfo.push(
      [AccessLevel.WAITING, supportedValues.waiting.menuText, <ClockCircleOutlined />],
    );
  }
  if (supportedValues?.accessible?.enabled === true) {
    menuItemInfo.push(
      [AccessLevel.ACCESSIBLE, supportedValues.accessible.menuText, <UnlockOutlined />],
    );
  }
  if (supportedValues?.unaccessible?.enabled === true) {
    menuItemInfo.push(
      [AccessLevel.UNACCESSIBLE, supportedValues.unaccessible.menuText, <LockOutlined />],
    );
  }
  if (supportedValues?.notAvailable?.enabled === true) {
    menuItemInfo.push(
      [AccessLevel.NOT_AVAILABLE, supportedValues.notAvailable.menuText, <DashOutlined />],
    );
  }
};

export const getTagColor = (tagCategory: string, config: DiscoveryConfig): string => {
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

export const renderFieldContent = (content: any, contentType: 'string' | 'paragraphs' | 'number' | 'link' | 'tags' = 'string', config: DiscoveryConfig): React.ReactNode => {
  switch (contentType) {
  case 'string':
    if (Array.isArray(content)) {
      return content.join(', ');
    }
    return content;
  case 'number':
    if (Array.isArray(content)) {
      return content.map((v) => v.toLocaleString()).join('; ');
    }
    return content.toLocaleString();
  case 'paragraphs':
    if (Array.isArray(content)) {
      return content.join('\n').split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>);
    }
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

const highlightSearchTerm = (value: string, searchTerm: string, highlighClassName = 'matched'): { highlighted: React.ReactNode, matchIndex: number } => {
  const matchIndex = value ? value.toLowerCase().indexOf(searchTerm.toLowerCase()) : -1;
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

export interface FilterState {
  [key: string]: { [value: string]: boolean }
}

export interface DiscoveryResource {
  [accessibleFieldName]: AccessLevel,
  [any: string]: any,
  tags?: { name: string, category: string }[]
}

export interface Props {
  config: DiscoveryConfig,
  studies: DiscoveryResource[],
  studyRegistrationValidationField: string,
  params?: { studyUID: string | null }, // from React Router
  selectedResources: DiscoveryResource,
  pagination: { currentPage: number, resultsPerPage: number },
  selectedTags,
  searchTerm: string,
  accessFilters: {
    [accessLevel: number]: boolean
  },
  accessSortDirection: AccessSortDirection,
  onAdvancedSearch: (advancedSearch: any[]) => any,
  onSearchChange: (arg0: string) => any,
  onTagsSelected: (arg0: any) => any,
  onAccessFilterSet: (arg0: object) => any,
  onAccessSortDirectionSet: (accessSortDirection: AccessSortDirection) => any,
  onResourcesSelected: (resources: DiscoveryResource[]) => any,
  onPaginationSet: (pagination: { currentPage: number, resultsPerPage: number }) => any,
  allBatchesAreReady: boolean,
}

const Discovery: React.FunctionComponent<Props> = (props: Props) => {
  const { config } = props;
  const [jsSearch, setJsSearch] = useState(null);
  const [executedSearchesCount, setExecutedSearchesCount] = useState(0);
  const [accessibilityFilterVisible, setAccessibilityFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterState, setFilterState] = useState({} as FilterState);
  const [filterMultiSelectionLogic, setFilterMultiSelectionLogic] = useState('AND');
  const [modalData, setModalData] = useState({} as DiscoveryResource);
  const [permalinkCopied, setPermalinkCopied] = useState(false);
  const [exportingToWorkspace, setExportingToWorkspace] = useState(false);
  const [searchableTagCollapsed, setSearchableTagCollapsed] = useState(
    config.features.search.tagSearchDropdown
    && config.features.search.tagSearchDropdown.enabled
    && (config.features.search.tagSearchDropdown.collapseOnDefault
      || config.features.search.tagSearchDropdown.collapseOnDefault === undefined),
  );
  const [visibleResources, setVisibleResources] = useState([]);
  const [discoveryTopPadding, setDiscoveryTopPadding] = useState(30);
  const discoveryAccessibilityLinksRef = useRef(null);

  const batchesAreLoading = props.allBatchesAreReady === false;
  const BatchLoadingSpinner = () => (
    <div style={{ textAlign: 'center' }}>
      <Spin />
    </div>
  );

  const handleSearchChange = (ev) => {
    const { value } = ev.currentTarget;
    props.onSearchChange(value);
  };

  const debouncingDelayInMilliseconds = 500;
  const memoizedDebouncedSearch = useMemo(
    () => debounce(doSearchFilterSort, debouncingDelayInMilliseconds),
    [],
  );
  const parametersForDoSearchFilterSort = {
    props,
    jsSearch,
    config,
    setVisibleResources,
    filterState,
    filterMultiSelectionLogic,
    accessibleFieldName,
    AccessSortDirection,
  };

  useEffect(
    () => doDebounceSearch(parametersForDoSearchFilterSort, memoizedDebouncedSearch, executedSearchesCount, setExecutedSearchesCount), [
      props.searchTerm,
      props.accessSortDirection,
      props.studies,
      props.pagination,
      props.accessFilters,
      props.selectedTags,
      filterMultiSelectionLogic,
      filterState],
  );

  useEffect(() => {
    if (props.allBatchesAreReady && props.searchTerm) {
      // If the user entered a search term during loading
      // this resets onSearchChange to reinitialize search
      props.onSearchChange(props.searchTerm);
    }
  }, [props.allBatchesAreReady]);

  const formatSearchIndex = (index: String) => {
    // Removes [*] wild cards used by JSON Path and converts to array
    const wildCardStringRegex = new RegExp(/\[\*\]/, 'g');
    const indexWithoutWildcards = index.replace(wildCardStringRegex, '');
    const indexArr = indexWithoutWildcards.split('.');
    return indexArr;
  };

  const [selectedSearchableTextFields, setSelectedSearchableTextFields] = useState([] as string[]);

  // Load studies into JS Search.
  useEffect(() => {
    const search = new JsSearch.Search(config.minimalFieldMapping.uid);
    search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
    // Choose which fields in the data to make searchable.
    // If `searchableFields` are configured, enable search over only those fields.
    // If `searchableAndSelectableTextFields` is configured and fields are selected,
    //  enable search over only those fields.
    // Otherwise, default behavior: enable search over all non-numeric fields
    // in the table and the study description.
    // ---
    const searchableFields = selectedSearchableTextFields.length > 0
      ? selectedSearchableTextFields
      : config.features.search.searchBar.searchableTextFields;
    if (searchableFields) {
      searchableFields.forEach((field) => {
        const formattedFields = formatSearchIndex(field);
        search.addIndex(formattedFields);
      });
    } else {
      config.studyColumns.forEach((column) => {
        if (!column.contentType || column.contentType === 'string') {
          const studyColumnFieldsArr = formatSearchIndex(column.field);
          search.addIndex(studyColumnFieldsArr);
        }
      });
      // Also enable search over preview field if present
      if (config.studyPreviewField) {
        const studyPreviewFieldArr = formatSearchIndex(config.studyPreviewField.field);
        search.addIndex(studyPreviewFieldArr);
      }
    }
    // ---

    search.addDocuments(props.studies);
    // expose the search function
    setJsSearch(search);
    // Reinitialize search
    props.onSearchChange(props.searchTerm);
  }, [props.studies, selectedSearchableTextFields.length]);

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
        console.error(`Could not find data with UID ${studyID}.`);
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

  // to dynamically set the top padding for discovery panel to compensate for the height of the accessibility links
  useEffect(() => {
    if (discoveryAccessibilityLinksRef.current) {
      setDiscoveryTopPadding(30 - discoveryAccessibilityLinksRef.current.clientHeight);
    }
  }, [setDiscoveryTopPadding]);

  // Set up table columns
  // -----
  const columns = config.studyColumns.map((column) => ({
    title: <div className='discovery-table-header'>{column.name}</div>,
    ellipsis: !!column.ellipsis,
    textWrap: 'word-break',
    width: column.width,
    render: (_, record) => {
      let value = jsonpath.query(record, `$.${column.field}`);
      let renderedCell: undefined | string | ReactNode;

      if (!value || value.length === 0 || value.every((val) => val === '')) {
        if (column.errorIfNotAvailable !== false) {
          throw new Error(`Configuration error: Could not find field ${column.field} in record ${JSON.stringify(record)}. Check the 'study_columns' section of the Discovery config.`);
        }
        if (column.valueIfNotAvailable) {
          renderedCell = column.valueIfNotAvailable;
        } else {
          renderedCell = 'Not available';
        }
      } else {
        const columnIsSearchable = isColumnSearchable(column, config, selectedSearchableTextFields);
        if (columnIsSearchable && props.searchTerm) {
          value = value.join(', '); // "value" will always be an array from jsonpath.query()
          renderedCell = highlightSearchTerm(value, props.searchTerm).highlighted;
        } else if (column.hrefValueFromField) {
          renderedCell = <a href={`//${record[column.hrefValueFromField]}`} target='_blank' rel='noreferrer'>{renderFieldContent(value, column.contentType, config)}</a>;
        } else {
          renderedCell = renderFieldContent(value, column.contentType, config);
        }
      }
      return <Tooltip title='Click to view details'>{renderedCell}</Tooltip>;
    },
  }),
  );
  if (!config.features.tagsColumn || config.features.tagsColumn.enabled) {
    columns.push(
      {
        textWrap: 'word-break',
        title: <div className='discovery-table-header'> {config.tagsDisplayName || 'Tags'}</div>,
        ellipsis: false,
        width: config.tagColumnWidth || '200px',
        render: (_, record) => (
          <React.Fragment>
            {(record[config.minimalFieldMapping.tagsListFieldName] || []).map(({ name, category }) => {
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
  }
  if (props.studyRegistrationValidationField) {
    columns.push(
      {
        textWrap: 'word-break',
        title: <div className='discovery-table-header'> {'Registration Status'}</div>,
        ellipsis: false,
        width: '200px',
        render: (_, record) => ((record[props.studyRegistrationValidationField] !== false) ? (
          <React.Fragment>
            <Tag icon={<CheckCircleOutlined />} color='success'>
              Linked
            </Tag>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Tag icon={<MinusCircleOutlined />} color='default'>
              Not Linked
            </Tag>
          </React.Fragment>
        )
        ),
      },
    );
  }
  if (config.features.authorization.enabled) {
    const menuItemInfo = [];
    setUpMenuItemInfo(menuItemInfo, config.features?.authorization?.supportedValues);
    const menuItems:{key: string, label?:JSX.Element, type?:string}[] = menuItemInfo.map(([accessLevel, accessDescriptor, icon]: any[]) => (
      {
        key: accessLevel.toString(),
        label: (
          <Checkbox
            checked={props.accessFilters[accessLevel]}
            onChange={
              () => {
                const updatedAccessFilter = {
                  ...props.accessFilters,
                  [accessLevel]: !props.accessFilters[accessLevel],
                };
                // If "mixed availability" is enabled, set its value so it would show when either "accessible" or "unaccessible" is set
                const isMixedAvailabilityEnabled = config.features?.authorization?.supportedValues?.mixed?.enabled === true;
                const setMixedAvailabilityToShowWhenAccessibleOrUnaccessibleIsSet = () => {
                  updatedAccessFilter[AccessLevel.MIXED] = Boolean(updatedAccessFilter[AccessLevel.ACCESSIBLE])
                  || Boolean(updatedAccessFilter[AccessLevel.UNACCESSIBLE]);
                };
                if (isMixedAvailabilityEnabled) {
                  setMixedAvailabilityToShowWhenAccessibleOrUnaccessibleIsSet();
                }
                props.onAccessFilterSet(updatedAccessFilter);
              }
            }
          >
            {icon}&nbsp;{accessDescriptor}
          </Checkbox>
        ),
      }
    ));
    menuItems.push({
      key: 'access-filter-divider',
      type: 'divider',
    });
    menuItems.push({
      key: 'access-filter-buttons',
      label: (
        <Space size={'large'}>
          <Button type={'default'} onClick={() => setAccessibilityFilterVisible(false)}>
            OK
          </Button>
          <Button
            type={'primary'}
            onClick={() => props.onAccessFilterSet({
              [AccessLevel.ACCESSIBLE]: true,
              [AccessLevel.NOT_AVAILABLE]: true,
              [AccessLevel.WAITING]: true,
              [AccessLevel.UNACCESSIBLE]: true,
              [AccessLevel.MIXED]: true,
            },
            )}
          > Reset
          </Button>
        </Space>
      ),
    });
    columns.push({
      title: (
        <div className='discovery-table-header'>
          <Space size={'small'}>
            <div>Data Availability</div>
            <Tooltip title={config.features.authorization.columnTooltip}>
              <Dropdown
                open={accessibilityFilterVisible}
                menu={{
                  items: menuItems,
                }}
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
      width: '200px',
      textWrap: 'word-break',
      render: (_, record) => (
        <DiscoveryDataAvailabilityTooltips
          dataAvailabilityLevel={record[accessibleFieldName]}
          authzFieldName={record[config.minimalFieldMapping.authzField]}
        />
      ),
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
    <div className='discovery-container' style={{ paddingTop: discoveryTopPadding }}>
      {(config.features.pageTitle && config.features.pageTitle.enabled)
        && <h1 className='discovery-page-title'>{config.features.pageTitle.text || 'Discovery'}</h1>}

      <DiscoveryAccessibilityLinks ref={discoveryAccessibilityLinksRef} />

      {/* Header with stats */}
      <div className='discovery-header'>
        <DiscoverySummary
          allBatchesAreReady={props.allBatchesAreReady}
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
                        searchableAndSelectableTextFields={config.features.search.searchBar.searchableAndSelectableTextFields}
                        selectedSearchableTextFields={selectedSearchableTextFields}
                        setSelectedSearchableTextFields={setSelectedSearchableTextFields}
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
                    {`${props.config.features.search.tagSearchDropdown?.collapsibleButtonText || 'Tag Panel'}`}
                  </Button>
                </div>
              </div>
              <Collapse activeKey={(searchableTagCollapsed) ? '' : '1'} ghost>
                <Panel className='discovery-header__dropdown-tags-display-panel' header='' key='1'>
                  <div className='discovery-header__dropdown-tags'>
                    { batchesAreLoading
                      ? (
                        <BatchLoadingSpinner />
                      )
                      : (
                        <DiscoveryDropdownTagViewer
                          config={config}
                          studies={props.studies}
                          selectedTags={props.selectedTags}
                          setSelectedTags={props.onTagsSelected}
                        />
                      )}
                  </div>
                </Panel>
              </Collapse>
            </Space>
          </div>
        ) : (config.tagCategories && config.tagCategories.length > 0) && (
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
        {(enableSearchBar && !enableSearchableTags
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
          disableFilterButton={!props.studies.length}
        />
        <div className='discovery-studies__content'>
          {/* Advanced search panel */}
          {(
            props.config.features.advSearchFilters
            && props.config.features.advSearchFilters.enabled
            && filtersVisible
          )
            ? (
              <div
                className='discovery-filters--visible'
              >
                <DiscoveryAdvancedSearchPanel
                  config={props.config}
                  studies={props.studies}
                  filterState={filterState}
                  setFilterState={(event) => {
                    props.onAdvancedSearch(event);
                    setFilterState(event);
                  }}
                  filterMultiSelectionLogic={filterMultiSelectionLogic}
                  setFilterMultiSelectionLogic={setFilterMultiSelectionLogic}
                />
              </div>
            ) : (<div className='discovery-filters--hide' />)}

          <div id='discovery-table-of-records' className={`discovery-table-container ${filtersVisible ? 'discovery-table-container--collapsed' : 'discovery-table-container--expanded '}`}>
            <Space direction={'vertical'} style={{ width: '100%' }}>
              <DiscoveryListView
                selectedSearchableTextFields={selectedSearchableTextFields}
                config={config}
                studies={props.studies}
                visibleResources={
                  visibleResources.slice(
                    (props.pagination.currentPage - 1) * props.pagination.resultsPerPage,
                    props.pagination.currentPage * props.pagination.resultsPerPage,
                  )
                }
                searchTerm={props.searchTerm}
                setPermalinkCopied={setPermalinkCopied}
                setModalData={setModalData}
                setModalVisible={setModalVisible}
                columns={columns}
                selectedTags={props.selectedTags}
                onTagsSelected={props.onTagsSelected}
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
        </div>
        <ReduxDiscoveryDetails
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
