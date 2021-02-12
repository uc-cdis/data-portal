import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Discovery from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { hostname, discoveryConfig, useArboristUI } from '../localconf';

const loadStudiesFromMDS = async (): Promise<any[]> => {
  // Why `_guid_type='discovery_metadata'? We need to distinguish the discovery page studies in MDS
  // from other data in MDS. So all MDS records with `_guid_type='discovery_metadata'` should be
  // the full list of studies for this commons.
  const GUID_TYPE = 'discovery_metadata';
  const LIMIT = 10000; // required or else mds defaults to returning 10 records
  const MDS_STUDY_DATA_URL = `mds/metadata?_guid_type=${GUID_TYPE}&data=True&limit=${LIMIT}`;
  const url = hostname + MDS_STUDY_DATA_URL;
  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
    }
    const jsonResponse = await res.json();
    const studies = Object.values(jsonResponse).map((entry: any) => entry.gen3_discovery);
    return studies;
  } catch (err) {
    throw new Error(`Request for study data at ${url} failed: ${err}`);
  }
};

const DiscoveryWithMDSBackend: React.FC<{
  userAuthMapping: any,
  config: DiscoveryConfig,
}> = (props) => {
  const [studies, setStudies] = useState(null);

  if (!discoveryConfig) {
    throw new Error('Could not find configuration for Discovery page. Check the portal config.');
  }

  useEffect(() => {
    // attempt to load studies from MDS
    loadStudiesFromMDS().then((rawStudies) => {
      if (props.config.features.authorization.enabled) {
        // mark studies as accessible or inaccessible to user
        const authzField = props.config.minimalFieldMapping.authzField;
        // useArboristUI=true is required for userHasMethodForServiceOnResource
        if (!useArboristUI) {
          throw new Error('Arborist UI must be enabled for the Discovery page to work if authorization is enabled in the Discovery page. Set `useArboristUI: true` in the portal config.');
        }
        const studiesWithAccessibleField = rawStudies.map(study => ({
          ...study,
          __accessible: userHasMethodForServiceOnResource('read', '*', study[authzField], props.userAuthMapping),
        }));
        setStudies(studiesWithAccessibleField);
      } else {
        setStudies(rawStudies);
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });
  }, []);

  return (<Discovery
    studies={studies === null ? [] : studies}
    {...props}
  />);
};

const mapStateToProps = state => ({
  userAuthMapping: state.userAuthMapping,
  config: discoveryConfig,
});

export default connect(mapStateToProps)(DiscoveryWithMDSBackend);
