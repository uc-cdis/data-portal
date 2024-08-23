import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Discovery, { AccessLevel, AccessSortDirection, DiscoveryResource } from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import {
  hostnameWithSubdomain, discoveryConfig, studyRegistrationConfig, useArboristUI,
} from '../localconf';
import isEnabled from '../helpers/featureFlags';
import loadStudiesFromAggMDS from './aggMDSUtils';
import { loadStudiesFromMDS, getSomeStudiesFromMDS } from './MDSUtils';

const populateStudiesWithConfigInfo = (studies, config) => {
  if (!config.studies) {
    return;
  }

  const studyMatchesStudyConfig = (study, studyConfig) => {
    const fieldToMatch = Object.keys(studyConfig.match)[0];
    if (study[fieldToMatch] !== undefined) {
      const valueToMatch = Object.values(studyConfig.match)[0];
      if (study[fieldToMatch] === valueToMatch) {
        return true;
      }
    }
    return false;
  };

  const populateStudy = (study, studyConfig) => {
    studyConfig.fieldsToValues.forEach((fieldToValue) => {
      const [field, value] = Object.entries(fieldToValue)[0];
      study[field] = value; // eslint-disable-line no-param-reassign
    });
  };

  let studyConfig;
  studies.forEach((study) => {
    for (let i = 0; i < config.studies.length; i += 1) {
      studyConfig = config.studies[i];
      if (studyMatchesStudyConfig(study, studyConfig) === true) {
        populateStudy(study, studyConfig);
        break;
      }
    }
  });
};

const DiscoveryWithMDSBackend: React.FC<{
    userAggregateAuthMappings: any,
    config: DiscoveryConfig,
    awaitingDownload: boolean,
    selectedResources,
    pagination,
    selectedTags,
    searchTerm,
    accessSortDirection,
    accessFilters,
    onAdvancedSearch: (advancedSearch: any[]) => any,
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

  // Downloads and processes studies in two seperate batches
  // to improve load time & usability
  // Initially uses a smaller batch to load interface quickly
  // Then a batch with all the studies
  const [studiesBatchCount, setStudiesBatchCount] = useState(0);
  const expectedNumberOfTotalBatches = 2;
  const numberOfStudiesForSmallerBatch = isEnabled('discoveryUseAggMDS')
    ? 5
    : 10;
  const numberOfStudiesForAllStudiesBatch = 2000;
  const isBatchLoadingEnabled = isEnabled('discoveryUseAggMDS') && isEnabled('studyRegistration');

  useEffect(() => {
    // If batch loading is Enabled, update the studiesBatchCount to enable calling of different batch sizes
    // with different parameters
    if (
      studiesBatchCount < expectedNumberOfTotalBatches
      && isBatchLoadingEnabled
    ) setStudiesBatchCount(studiesBatchCount + 1);

    const studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
    async function fetchRawStudies() {
      const startTime = performance.now();
      let loadStudiesFunction: Function;
      let loadStudiesParameters: any;
      if (isEnabled('discoveryUseAggMDS')) {
        loadStudiesFunction = loadStudiesFromAggMDS;
        loadStudiesParameters = studiesBatchCount === 1
          ? numberOfStudiesForSmallerBatch
          : numberOfStudiesForAllStudiesBatch;
      } else {
        loadStudiesFunction = getSomeStudiesFromMDS;
        loadStudiesParameters = props.config?.features?.guidType;
      }
      const rawStudiesRegistered = await loadStudiesFunction(
        loadStudiesParameters,
      );
      let rawStudiesUnregistered: any[] = [];
      if (isEnabled('studyRegistration')) {
        // Load fewer raw studies if on the first studies batch
        // Otherwise load them all
        rawStudiesUnregistered = studiesBatchCount === 1
          ? (rawStudiesUnregistered = await getSomeStudiesFromMDS(
            'unregistered_discovery_metadata',
            numberOfStudiesForSmallerBatch,
          ))
          : await loadStudiesFromMDS('unregistered_discovery_metadata');
        rawStudiesUnregistered = rawStudiesUnregistered.map(
          (unregisteredStudy) => ({
            ...unregisteredStudy,
            [studyRegistrationValidationField]: false,
          }),
        );
      }
      const endTime = performance.now();
      console.log(
        `Call to fetchRawStudies took ${endTime - startTime} milliseconds`,
      );
      return _.union(rawStudiesRegistered, rawStudiesUnregistered);
    }
    fetchRawStudies().then((rawStudies) => {
      let studiesToSet;
      if (props.config.features.authorization.enabled) {
        // mark studies as accessible or inaccessible to user
        const { authzField, dataAvailabilityField } = props.config.minimalFieldMapping;
        const { supportedValues } = props.config.features.authorization;
        // useArboristUI=true is required for userHasMethodForServiceOnResource
        if (!useArboristUI) {
          throw new Error('Arborist UI must be enabled for the Discovery page to work if authorization is enabled in the Discovery page. Set `useArboristUI: true` in the portal config.');
        }
        const studiesWithAccessibleField = rawStudies.map((study) => {
          let accessible: AccessLevel;
          if (supportedValues?.unaccessible?.enabled
            && dataAvailabilityField
            && study[dataAvailabilityField] === 'unaccessible') {
            accessible = AccessLevel.UNACCESSIBLE;
          } else if (supportedValues?.notAvailable?.enabled
            && dataAvailabilityField
            && study[dataAvailabilityField] === 'not_available') {
            accessible = AccessLevel.NOT_AVAILABLE;
          } else if (supportedValues?.waiting?.enabled && !study[authzField]) {
            accessible = AccessLevel.WAITING;
          } else {
            let authMapping;
            if (isEnabled('discoveryUseAggWTS')) {
              let commonsURL = study.commons_url;
              if (commonsURL && commonsURL.startsWith('http')) {
                commonsURL = new URL(commonsURL).hostname;
              }
              authMapping = props.userAggregateAuthMappings[(commonsURL || hostnameWithSubdomain)] || {};
            } else {
              authMapping = props.userAuthMapping;
            }
            const isAuthorized = userHasMethodForServiceOnResource('read', '*', study[authzField], authMapping)
              || userHasMethodForServiceOnResource('read', 'peregrine', study[authzField], authMapping)
              || userHasMethodForServiceOnResource('read', 'guppy', study[authzField], authMapping)
              || userHasMethodForServiceOnResource('read-storage', 'fence', study[authzField], authMapping);
            if (supportedValues?.accessible?.enabled && isAuthorized === true) {
              accessible = AccessLevel.ACCESSIBLE;
            } else if (supportedValues?.unaccessible?.enabled && isAuthorized === false) {
              accessible = AccessLevel.UNACCESSIBLE;
            } else {
              accessible = AccessLevel.OTHER;
            }
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

      populateStudiesWithConfigInfo(studiesToSet, props.config);
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
  }, [props, studiesBatchCount]);

  let studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
  if (!isEnabled('studyRegistration')) {
    studyRegistrationValidationField = undefined;
  }

  const batchLoadingInfo = {
    isBatchLoadingEnabled,
    allBatchesAreLoaded: studies === null
      ? false
      : studies?.length > numberOfStudiesForSmallerBatch * 2,
  };

  return (
    <Discovery
      studies={studies === null ? [] : studies}
      studyRegistrationValidationField={studyRegistrationValidationField}
      batchLoadingInfo={batchLoadingInfo}
      {...props}
    />
  );
};

const mapStateToProps = (state) => ({
  userAuthMapping: state.userAuthMapping,
  userAggregateAuthMappings: state.userAggregateAuthMappings,
  config: discoveryConfig,
  ...state.discovery,
});

const mapDispatchToProps = (dispatch) => ({
  onAdvancedSearch: (advancedSearch) => dispatch({ type: 'ADVANCED_SEARCH', advancedSearch }),
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
