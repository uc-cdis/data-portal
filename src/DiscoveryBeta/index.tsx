import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as JsSearch from 'js-search';

import DiscoveryBeta, { DiscoveryTag, DiscoveryAccessPopover } from './DiscoveryBeta';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';

import {
  highlightSearchTerm,
  getTagsInCategory,
  filterByTags,
  filterByAccessLevel,
  renderAggregation,
  formatValue,
  getTagColor } from './utils';
import { AccessLevel, accessibleFieldName, ARBORIST_READ_PRIV } from './consts';

import { discoveryConfig, useArboristUI } from '../localconf';

// DEV ONLY
import mockData from './__mocks__/mock_mds_studies.json';

if (!discoveryConfig) {
  throw new Error('Could not find configuration for Discovery page. Check the portal config.');
}
if (!useArboristUI) {
  throw new Error('Arborist UI must be enabled for the Discovery page to work. Set `useArboristUI: true` in the portal config.');
}

const loadResources = async (): Promise<any> => {
  // DEV ONLY
  const jsonResponse = mockData;
  const resources = Object.values(jsonResponse).map((entry: any) => entry.gen3_discovery);
  return Promise.resolve(resources);
  // END DEV ONLY
};

interface DiscoveryContainerProps {
  userAuthMapping: {[resource: string]: [{service: string, method: string}]}
  config: DiscoveryConfig,
  loadResources: () => Promise<any[]>
  params?: {studyUID?: string} // from React Router
}
export const DiscoveryContainer: React.FunctionComponent<DiscoveryContainerProps> = (props) => {
  const { userAuthMapping, config, params } = props;

  const [jsSearch, setJsSearch] = useState(null);
  const [allResources, setAllResources] = useState(null);
  const [searchFilteredResources, setSearchFilteredResources] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accessLevel, setAccessLevel] = useState(AccessLevel.BOTH);
  const [selectedTags, setSelectedTags] = useState({});

  useEffect(() => {
    loadResources().then((rs) => {
      // Add a property to resources showing whether user has access to resources
      const resources = rs.map(resource => ({
        ...resource,
        [accessibleFieldName]: userHasMethodForServiceOnResource('read', '*', resource.authz, userAuthMapping),
      }));

      // Index the resources into the JsSearch library.
      // ------------------------
      const search = new JsSearch.Search(config.minimal_field_mapping.uid);
      search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
      // Enable search only over text fields present in the table
      config.study_columns.forEach((column) => {
        if (!column.content_type || column.content_type === 'string') {
          search.addIndex(column.field);
        }
      });
      // Also enable search over preview field if present
      if (config.study_preview_field) {
        search.addIndex(config.study_preview_field.field);
      }
      search.addDocuments(resources);
      setJsSearch(search);
      // -----------------------

      setAllResources(resources);
      setSearchFilteredResources(resources);

      // If the studyUID URL parameter is set, open the Discovery page modal to that study
      // on page startup.
      if (params && params.studyUID) {
        const defaultModalData = resources.find(
          r => r[config.minimal_field_mapping.uid] === params.studyUID);
        if (defaultModalData) {
          setModalData(defaultModalData);
          setModalVisible(true);
        } else {
          // eslint-disable-next-line no-console
          console.error(`Could not find study with UID ${params.studyUID}.`);
        }
      }
    }).catch((err) => {
      // FIXME handle retry logic
      throw new Error(err);
    });
  }, []);

  const handleSearchTermChange = (ev) => {
    const value = ev.currentTarget.value;
    setSearchTerm(value);
    if (value === '') {
      // reset search results
      setSearchFilteredResources(allResources);
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

  const handleTableRowSelect = (record) => {
    setModalVisible(true);
    setModalData(record);
  };

  // Set up table columns
  // -----
  const columns = config.study_columns.map(column => ({
    title: column.name,
    render: (_, record) => {
      const value = record[column.field];
      const contentType = column.content_type || 'string';
      if (value === undefined) {
        if (column.error_if_not_available !== false) {
          throw new Error(`Configuration error: Could not find field ${column.field} in record ${JSON.stringify(record)}. Check the 'study_columns' section of the Discovery config.`);
        }
        if (column.value_if_not_available) {
          return column.value_if_not_available;
        }
        return 'Not available';
      }
      if (contentType === 'string') {
        // Show search highlights if there's an active search term
        if (searchTerm) {
          return highlightSearchTerm(value, searchTerm).highlighted;
        }
      }
      return formatValue(value, contentType);
    },
  }),
  );
  columns.push(
    {
      title: 'Tags',
      render: (_, record) => (
        <React.Fragment>
          {record.tags.map(({ name, category }) => (
            <DiscoveryTag
              key={record.name + name}
              name={name}
              selected={selectedTags[name]}
              color={getTagColor(category, config)}
              onSelect={(ev) => {
                ev.stopPropagation();
                setSelectedTags({
                  ...selectedTags,
                  [name]: selectedTags[name] ? undefined : true,
                });
              }}
            />
          ))}
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
            <DiscoveryAccessPopover
              accessible
              title={'You have access to this study.'}
              content={<>You have <code>{ARBORIST_READ_PRIV}</code> access to
                <code>{record[config.minimal_field_mapping.authz_field]}</code>.
              </>}
            />
          )
          : (
            <DiscoveryAccessPopover
              accessible={false}
              title={'You do not have access to this study.'}
              content={<>You don&apos;t have <code>{ARBORIST_READ_PRIV}</code> access to
                <code>{record[config.minimal_field_mapping.authz_field]}</code>.
              </>}
            />
          )
      ),
    });
  }
  // -----


  const visibleResources = searchFilteredResources !== null
    ? filterByTags(
      filterByAccessLevel(searchFilteredResources, accessLevel, accessibleFieldName),
      selectedTags,
    )
    : null;

  const handleTagSelect = (tag: string) => {
    setSelectedTags({
      ...selectedTags,
      [tag]: selectedTags[tag] ? undefined : true,
    });
  };

  const headerTagsByCategory = config.tag_categories.map((category) => {
    if (category.display === false) {
      return null;
    }
    const tagNames = getTagsInCategory(category.name, allResources, config);
    return {
      categoryName: category.name,
      tags: tagNames.map(tagName => ({
        name: tagName,
        color: category.color,
        selected: selectedTags[tagName],
      })),
    };
  });

  const modalFields = config.study_page_fields.fields_to_show.map((group) => {
    const fields = [];
    group.fields.forEach((field) => {
      let value;
      if (modalData && modalData[field.field]) {
        value = modalData[field.field];
      } else if (field.include_if_not_available) {
        // if include_if_not_available is true, show a default value for missing fields.
        value = field.value_if_not_available || 'Not available';
      } else {
        // otherwise, don't render missing fields
        return;
      }
      fields.push({
        includeName: field.include_name,
        name: field.name,
        value,
      });
    });

    return {
      includeName: group.include_name,
      groupName: group.group_name,
      fields,
    };
  });

  const resourcesLoading = visibleResources === null;
  if (resourcesLoading) {
    return <div>Loading</div>; // FIXME do something fancier?
  }
  return (<DiscoveryBeta
    pageTitle={config.pageTitle || 'Discovery'}
    // header
    headerAggregations={config.aggregations.map(aggregation => ({
      label: aggregation.name,
      value: renderAggregation(aggregation, visibleResources),
    }))}
    headerTagSelectorTitle={config.tag_selector.title}
    headerTagsByCategory={headerTagsByCategory}

    // tag filter
    onTagSelect={handleTagSelect}

    // search
    showSearchBar={config.features.search.search_bar.enabled}
    searchTerm={searchTerm}
    onSearchTermChange={handleSearchTermChange}

    // access filter
    showAccessLevelSelector={config.features.authorization.enabled}
    defaultAccessLevel={AccessLevel.BOTH}
    accessLevel={accessLevel}
    onAccessLevelChange={handleAccessLevelChange}

    // table
    tableColumns={columns} // derived from config; move back internally
    tableData={visibleResources}
    tableRowKey={config.minimal_field_mapping.uid}
    tableShowExpandedRow={!!config.study_preview_field}
    onTableSelect={handleTableRowSelect}
    tableExpandedRowRender={(record) => {
      const previewField = record[config.study_preview_field.field];
      if (!previewField) {
        if (config.study_preview_field.include_if_not_available) {
          return config.study_preview_field.value_if_not_available;
        }
      }
      if (searchTerm) {
        // get index of searchTerm match
        const matchIndex = previewField.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (matchIndex === -1) {
          // if searchterm doesn't match this record, don't highlight anything
          return previewField;
        }
        // Scroll the text to the search term and highlight the search term.
        let start = matchIndex - 100;
        if (start < 0) {
          start = 0;
        }
        return (<React.Fragment>
          { start > 0 && '...' }
          {previewField.slice(start, matchIndex)}
          <span className='matched'>{previewField.slice(matchIndex, matchIndex + searchTerm.length)}</span>
          {previewField.slice(matchIndex + searchTerm.length)}
        </React.Fragment>
        );
      }
      return previewField;
    }}

    // modal
    modalVisible={modalVisible}
    modalTitle={modalData && modalData[config.study_page_fields.header.field]}
    modalFields={modalFields}
    modalPermalink={`/discovery/${modalData && modalData[config.minimal_field_mapping.uid]}/`}
    modalShowAccess={config.features.authorization.enabled}
    modalUserHasAccess={modalData && modalData[accessibleFieldName]}
    onModalClose={() => setModalVisible(false)}
  />);
};

const mapStateToProps = state => ({
  userAuthMapping: state.userAuthMapping,
  config: discoveryConfig,
  loadResources,
});

export default connect(mapStateToProps)(DiscoveryContainer);
