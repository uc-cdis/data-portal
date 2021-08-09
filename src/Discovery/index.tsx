import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Discovery, { AccessLevel } from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { hostname, discoveryConfig, useArboristUI } from '../localconf';
import isEnabled from '../helpers/featureFlags';
import loadStudiesFromAggMDS from './aggMDSUtils';

const loadStudiesFromMDS = async (): Promise<any[]> => {
  // Why `_guid_type='discovery_metadata'? We need to distinguish the discovery page studies in MDS
  // from other data in MDS. So all MDS records with `_guid_type='discovery_metadata'` should be
  // the full list of studies for this commons.
  const GUID_TYPE = 'discovery_metadata';
  const LIMIT = 1000; // required or else mds defaults to returning 10 records
  const MDS_URL = `${hostname}mds/metadata`;
  const STUDY_DATA_FIELD = 'gen3_discovery'; // field in the MDS response that contains the study data

  try {
    let allStudies = [];
    let offset = 0;
    // request up to LIMIT studies from MDS at a time.
    let shouldContinue = true;
    while (shouldContinue) {
      const url = `${MDS_URL}?data=True&_guid_type=${GUID_TYPE}&limit=${LIMIT}&offset=${offset}`;
      // It's OK to disable no-await-in-loop rule here -- it's telling us to refactor
      // using Promise.all() so that we can fire multiple requests at one.
      // But we WANT to delay sending the next request to MDS until we know we need it.
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url);
      if (res.status !== 200) {
        throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
      }
      // eslint-disable-next-line no-await-in-loop
      const jsonResponse = await res.json();
      const studies = Object.values(jsonResponse).map((entry) => entry[STUDY_DATA_FIELD]);
      allStudies = allStudies.concat(studies);
      const noMoreStudiesToLoad = studies.length < LIMIT;
      if (noMoreStudiesToLoad) {
        shouldContinue = false;
        return allStudies;
      }
      offset += LIMIT;
    }
    return allStudies;
  } catch (err) {
    throw new Error(`Request for study data failed: ${err}`);
  }
};

const DiscoveryWithMDSBackend: React.FC<{
    userAuthMapping: any,
    config: DiscoveryConfig,
}> = (props) => {
  const [studies, setStudies] = useState(null);

  if (!props.config) {
    throw new Error('Could not find configuration for Discovery page. Check the portal config.');
  }

  useEffect(() => {
    let loadStudiesFunction;
    if (isEnabled('discoveryUseAggMDS')) {
      loadStudiesFunction = loadStudiesFromAggMDS;
    } else {
      loadStudiesFunction = loadStudiesFromMDS;
    }
    loadStudiesFunction().then((rawStudies) => {
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
        setStudies(studiesWithAccessibleField);
      } else {
        setStudies(rawStudies);
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });
  }, []);

  return (
    <Discovery
      studies={studies === null ? [] : studies}
      {...props}
    />
  );
};

const mapStateToProps = (state) => ({
  userAuthMapping: state.userAuthMapping,
  config: discoveryConfig,
});

export default connect(mapStateToProps)(DiscoveryWithMDSBackend);
