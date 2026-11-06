import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import _ from 'lodash';
import Discovery, { AccessLevel, AccessSortDirection, DiscoveryResource } from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import {
  hostnameWithSubdomain, discoveryConfig, studyRegistrationConfig, useArboristUI,
} from '../localconf';
import { ReduxDiscoveryDetails } from './reduxer';
import isEnabled from '../helpers/featureFlags';
import loadStudiesFromAggMDS, { loadStudyFromAggMDS } from './Utils/aggMDSUtils/aggMDSUtils';
import loadStudiesFromMDS, { loadStudyFromMDS } from './Utils/MDSUtils/MDSUtils';

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
    params: { studyUID?: string | null },
    history: any,
    systemPopupActivated: boolean,
}> = (props) => {
  const [studies, setStudies] = useState(null);

  if (!props.config) {
    throw new Error('Could not find configuration for Discovery page. Check the portal config.');
  }

  // All studies are loaded in a single batch; this flips to true once they are ready
  const [allBatchesAreReady, setAllBatchesAreReady] = useState(false);

  const processStudies = (rawStudies) => {
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
            if (supportedValues?.mixed?.enabled
              && dataAvailabilityField
              && study[dataAvailabilityField] === 'mixed_availability') {
              accessible = AccessLevel.MIXED;
            } else {
              accessible = AccessLevel.ACCESSIBLE;
            }
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
    return studiesToSet;
  };

  // When opening a study permalink (/discovery/<study id>), only that study is
  // loaded; the full list is loaded once the user dismisses the study details.
  const studyUID = props.params?.studyUID ? decodeURIComponent(props.params.studyUID) : null;
  const [singleStudy, setSingleStudy] = useState(null);
  const [singleStudyVisible, setSingleStudyVisible] = useState(false);

  useEffect(() => {
    if (!studyUID) {
      return;
    }
    let cancelled = false;
    // The details modal always loads its metadata from MDS. When the aggregate MDS is enabled,
    // it is also queried (in parallel) only for the commons info and tags, which MDS does not have.
    const loadStudy = async () => {
      const [mdsStudy, aggMDSStudy] = await Promise.all([
        loadStudyFromMDS(studyUID),
        isEnabled('discoveryUseAggMDS')
          ? loadStudyFromAggMDS(studyUID).catch((err) => {
            // eslint-disable-next-line no-console
            console.warn(`Could not load commons info for study ${studyUID} from aggregate MDS: `, err);
            return null;
          })
          : null,
      ]);
      if (!aggMDSStudy) {
        return mdsStudy;
      }
      return {
        ...mdsStudy,
        ..._.pick(aggMDSStudy, ['commons', 'commons_url']),
        tags: aggMDSStudy.tags ?? mdsStudy.tags,
      };
    };
    loadStudy().then((rawStudy) => {
      if (cancelled) return;
      setSingleStudy(processStudies([rawStudy])[0]);
      setSingleStudyVisible(true);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`Could not load study with UID ${studyUID}: `, err);
      if (!cancelled) props.history?.replace('/discovery');
    });
    props.onDiscoveryPageActive();
    return () => { cancelled = true; }; // eslint-disable-line consistent-return
  }, [studyUID]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (studyUID) {
      return; // full list is not needed to show a single study
    }
    let cancelled = false;
    const studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
    async function fetchRawStudies() {
      // load all metadata in one batch, from either the aggregate MDS or the MDS
      const rawStudies: any[] = isEnabled('discoveryUseAggMDS')
        ? await loadStudiesFromAggMDS()
        : await loadStudiesFromMDS(props.config?.features?.guidType);

      if (!isEnabled('studyRegistration') || !studyRegistrationValidationField) {
        return rawStudies;
      }

      // split studies into registered / unregistered based on the validation field
      const rawStudiesRegistered: any[] = [];
      const rawStudiesUnregistered: any[] = [];
      rawStudies.forEach((study) => {
        if (study[studyRegistrationValidationField]) {
          rawStudiesRegistered.push(study);
        } else {
          // normalize to a strict `false`, downstream components check `!== false`
          rawStudiesUnregistered.push({
            ...study,
            [studyRegistrationValidationField]: false,
          });
        }
      });
      return _.union(rawStudiesRegistered, rawStudiesUnregistered);
    }
    fetchRawStudies().then((rawStudies) => {
      if (cancelled) return;
      const studiesToSet = processStudies(rawStudies);
      setStudies(studiesToSet);
      setAllBatchesAreReady(true);
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
    return () => { cancelled = true; }; // eslint-disable-line consistent-return
    // only (re)load when switching between single-study and full-list views;
    // depending on `props` would refetch all metadata on every redux update
  }, [studyUID]); // eslint-disable-line react-hooks/exhaustive-deps

  let studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
  if (!isEnabled('studyRegistration')) {
    studyRegistrationValidationField = undefined;
  }

  if (studyUID) {
    return (
      <div className='discovery-container'>
        <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size='large' /></div>
        {singleStudy && (
          <ReduxDiscoveryDetails
            modalVisible={singleStudyVisible}
            setModalVisible={(visible) => {
              // the drawer is hidden behind the system use (DUA) popup; ignore close requests
              // until it is accepted so we don't navigate away from the study
              if (!visible && props.systemPopupActivated) {
                return;
              }
              setSingleStudyVisible(visible);
              if (!visible) {
                // route change remounts this component without a study id, loading the full Discovery page
                props.history?.replace('/discovery');
              }
            }}
            permalinkCopied={false}
            setPermalinkCopied={() => {}}
            config={props.config}
            modalData={singleStudy}
          />
        )}
      </div>
    );
  }

  return (
    <Discovery
      studies={studies === null ? [] : studies}
      studyRegistrationValidationField={studyRegistrationValidationField}
      allBatchesAreReady={allBatchesAreReady}
      {...props}
    />
  );
};

const mapStateToProps = (state) => ({
  userAuthMapping: state.userAuthMapping,
  userAggregateAuthMappings: state.userAggregateAuthMappings,
  systemPopupActivated: !!state.popups?.systemUseWarnPopup,
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
