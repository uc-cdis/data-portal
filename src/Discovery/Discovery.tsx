import React, { useState, useEffect } from 'react';
import * as JsSearch from 'js-search';
import { Tag, Popover } from 'antd';
import { LockFilled, UnlockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { DiscoveryConfig } from './DiscoveryConfig';
import './Discovery.css';
import DiscoverySummary from './DiscoverySummary';
import DiscoveryTagViewer from './DiscoveryTagViewer';
import DiscoveryListView from './DiscoveryListView';
import DiscoveryDetails from './DiscoveryDetails';
import DiscoveryAdvancedSearchPanel from './DiscoveryAdvancedSearchPanel';
import ReduxDiscoveryActionBar from './reduxer';
import DiscoveryMDSSearch from './DiscoveryMDSSearch';
import DiscoveryAccessibilityLinks from './DiscoveryAccessibilityLinks';

export const accessibleFieldName = '__accessible';

export enum AccessLevel {
  ACCESSIBLE,
  UNACCESSIBLE,
  NOT_AVAILABLE,
  PENDING
}

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

interface Props {
  config: DiscoveryConfig
  studies: {__accessible: boolean, [any: string]: any}[]
  params?: {studyUID: string} // from React Router
}

const Discovery: React.FunctionComponent<Props> = (props: Props) => {
  const { config } = props;

  const [jsSearch, setJsSearch] = useState(null);
  const [searchFilteredResources, setSearchFilteredResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterState, setFilterState] = useState({} as FilterState);
  const [modalData, setModalData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState({});
  const [permalinkCopied, setPermalinkCopied] = useState(false);
  const [exportingToWorkspace, setExportingToWorkspace] = useState(false);
  const [advSearchFilterHeight, setAdvSearchFilterHeight] = useState('100vh');

  const handleSearchChange = (ev) => {
    const { value } = ev.currentTarget;
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
        if (searchTerm) {
          if (Array.isArray(value)) {
            value = value.join(', ');
          }
          return highlightSearchTerm(value, searchTerm).highlighted;
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
      title: <div className='discovery-table-header'>Tags</div>,
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
                className={`discovery-tag ${isSelected ? 'discovery-tag--selected' : ''}`}
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
      filters: [{
        text: <React.Fragment><UnlockOutlined />&nbsp;Accessible</React.Fragment>,
        value: AccessLevel.ACCESSIBLE,
        id: 'accessible-data-filter',
      }, {
        text: <React.Fragment><LockFilled />&nbsp;Unaccessible</React.Fragment>,
        value: AccessLevel.UNACCESSIBLE,
        id: 'unaccessible-data-filter',
      }, {
        text: <React.Fragment><span style={{ color: 'gray' }}>n/a</span>&nbsp;No Data</React.Fragment>,
        value: AccessLevel.NOT_AVAILABLE,
        id: 'not-available-data-filter',
      }, {
        text: <React.Fragment><ClockCircleOutlined />&nbsp;Pending</React.Fragment>,
        value: AccessLevel.PENDING,
        id: 'pending-data-filter',
      }],
      onFilter: (value, record) => record[accessibleFieldName] === value,
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
        return (
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
        );
      },
    });
  }
  // -----

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
        <DiscoveryTagViewer
          config={config}
          studies={props.studies}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>

      <div className='discovery-studies-container'>
        {/* Free-form text search box */}
        { (props.config.features.search
        && props.config.features.search.searchBar
        && props.config.features.search.searchBar.enabled)
            && (
              <div className='discovery-search-container'>
                <DiscoveryMDSSearch
                  searchTerm={searchTerm}
                  handleSearchChange={handleSearchChange}
                />
              </div>
            )}

        {/* Bar with actions, stats, around advanced search and data actions */}
        <ReduxDiscoveryActionBar
          config={props.config}
          selectedResources={selectedResources}
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
          <DiscoveryListView
            config={config}
            studies={props.studies}
            visibleResources={visibleResources}
            searchTerm={searchTerm}
            advSearchFilterHeight={advSearchFilterHeight}
            setAdvSearchFilterHeight={setAdvSearchFilterHeight}
            setPermalinkCopied={setPermalinkCopied}
            setModalData={setModalData}
            setModalVisible={setModalVisible}
            columns={columns}
            accessibleFieldName={accessibleFieldName}
            selectedResources={selectedResources}
            setSelectedResources={setSelectedResources}
          />
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
