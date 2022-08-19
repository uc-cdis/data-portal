import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Discovery, { AccessLevel, AccessSortDirection, DiscoveryResource } from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { discoveryConfig, studyRegistrationConfig, useArboristUI } from '../localconf';
import isEnabled from '../helpers/featureFlags';
import loadStudiesFromAggMDS from './aggMDSUtils';
import loadStudiesFromMDS from './MDSUtils';

const DiscoveryWithMDSBackend: React.FC<{
    userAuthMapping: any,
    config: DiscoveryConfig,
    awaitingDownload: boolean,
    selectedResources,
    pagination,
    selectedTags,
    searchTerm,
    accessSortDirection,
    accessFilters,
    onSearchChange: (searchTerm: string) => any,
    onTagsSelected: (selectedTags: any[]) => any,
    onAccessFilterSet: (accessFilters: { [key in AccessLevel]: boolean }) => any,
    onAccessSortDirectionSet: (accessSortDirection: AccessSortDirection) => any,
    onPaginationSet: (pagination: {currentPage: number, resultsPerPage: number}) => any,
    onResourcesSelected: (selectedResources: DiscoveryResource[]) => any,
    onDiscoveryPageActive: () => any,
    onRedirectForAction: (redirectState: object) => any,
}> = (props) => {
  const [studies, setStudies] = useState(null);

  if (!props.config) {
    throw new Error('Could not find configuration for Discovery page. Check the portal config.');
  }

  useEffect(() => {
    const studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
    async function fetchRawStudies() {
      let loadStudiesFunction;
      if (isEnabled('discoveryUseAggMDS')) {
        loadStudiesFunction = loadStudiesFromAggMDS;
      } else {
        loadStudiesFunction = loadStudiesFromMDS;
      }
      const rawStudiesRegistered = await loadStudiesFunction();
      let rawStudiesUnregistered = [];
      if (isEnabled('studyRegistration')) {
        rawStudiesUnregistered = await loadStudiesFromMDS('unregistered_discovery_metadata');
        rawStudiesUnregistered = rawStudiesUnregistered
          .map((unregisteredStudy) => ({ ...unregisteredStudy, [studyRegistrationValidationField]: false }));
      }
      return _.union(rawStudiesRegistered, rawStudiesUnregistered);
    }
    fetchRawStudies().then((rawStudies) => {
      let studiesToSet;
      if (props.config.features.authorization.enabled) {
        // mark studies as accessible or inaccessible to user
        const { authzField, dataAvailabilityField } = props.config.minimalFieldMapping;
        // useArboristUI=true is required for userHasMethodForServiceOnResource
        if (!useArboristUI) {
          throw new Error('Arborist UI must be enabled for the Discovery page to work if authorization is enabled in the Discovery page. Set `useArboristUI: true` in the portal config.');
        }
        const studiesWithAccessibleField = rawStudies.map((study) => {
          let accessible: AccessLevel;
          if (dataAvailabilityField && study[dataAvailabilityField] === 'pending') {
            accessible = AccessLevel.PENDING;
          } else if (study[authzField] === undefined || study[authzField] === '') {
            accessible = AccessLevel.NOT_AVAILABLE;
          } else {
            accessible = userHasMethodForServiceOnResource('read', '*', study[authzField], props.userAuthMapping)
              ? AccessLevel.ACCESSIBLE
              : AccessLevel.UNACCESSIBLE;
          }
          return {
            ...study,
            __accessible: accessible,
          };
        });
        studiesToSet = studiesWithAccessibleField;
      } else {
        studiesToSet = rawStudies;
      }
      setStudies(studiesToSet);

      // resume action in progress if redirected from login
      const urlParams = decodeURIComponent(window.location.search);
      if (urlParams.startsWith('?state=')) {
        const redirectState = JSON.parse(urlParams.split('?state=')[1]);
        redirectState.selectedResources = studiesToSet.filter(
          (resource) => redirectState.selectedResourceIDs.includes(resource[props.config.minimalFieldMapping.uid]),
        );
        delete redirectState.selectedResourceIDs;
        props.onRedirectForAction(redirectState);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });

    // indicate discovery tag is active even if we didn't click a button to get here
    props.onDiscoveryPageActive();
  }, [props]);

  let studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
  if (!isEnabled('studyRegistration')) {
    studyRegistrationValidationField = undefined;
  }
  return (
    <Discovery
      studies={studies === null ? [] : studies}
      studyRegistrationValidationField={studyRegistrationValidationField}
      {...props}
    />
  );
};

const mapStateToProps = (state) => ({
  userAuthMapping: state.userAuthMapping,
  config: discoveryConfig,
  ...state.discovery,
});

const mapDispatchToProps = (dispatch) => ({
  onSearchChange: (searchTerm) => dispatch({ type: 'SEARCH_TERM_SET', searchTerm }),
  onTagsSelected: (selectedTags) => dispatch({ type: 'TAGS_SELECTED', selectedTags }),
  onAccessFilterSet: (accessFilters) => dispatch({ type: 'ACCESS_FILTER_SET', accessFilters }),
  onAccessSortDirectionSet: (accessSortDirection) => dispatch({ type: 'ACCESS_SORT_DIRECTION_SET', accessSortDirection }),
  onPaginationSet: (pagination) => dispatch({ type: 'PAGINATION_SET', pagination }),
  onResourcesSelected: (selectedResources) => dispatch({ type: 'RESOURCES_SELECTED', selectedResources }),
  onDiscoveryPageActive: () => dispatch({ type: 'ACTIVE_CHANGED', data: '/discovery' }),
  onRedirectForAction: (redirectState) => dispatch({ type: 'REDIRECTED_FOR_ACTION', redirectState }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscoveryWithMDSBackend);
