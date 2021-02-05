import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import DiscoveryBeta from './DiscoveryBeta';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { discoveryConfig, useArboristUI } from '../localconf';

// DEV ONLY
import mockResources from './mock_mds_studies.json';

if (!discoveryConfig) {
  throw new Error('Could not find configuration for Discovery page. Check the portal config.');
}

if (!useArboristUI) {
  throw new Error('Arborist UI must be enabled for the Discovery page to work. Set `useArboristUI: true` in the portal config.');
}

const loadStudiesFromMDS = () => {
  // DEV ONLY
  const jsonResponse = mockResources;
  const resources = Object.values(jsonResponse).map((entry: any) => entry.gen3_discovery);
  return Promise.resolve(resources);
  // DEV ONLY
};

const DiscoveryWithMDSBackend: React.FC<{
  userAuthMapping: any,
  config: DiscoveryConfig,
}> = (props) => {
  const [studies, setStudies] = useState(null);

  useEffect(() => {
    // attempt to load studies from MDS
    loadStudiesFromMDS().then((rawStudies) => {
      // mark studies as accessible or inaccessible to user
      const authzField = props.config.minimal_field_mapping.authz_field;
      const studiesWithAccessibleField = rawStudies.map(study => ({
        ...study,
        __accessible: userHasMethodForServiceOnResource('read', '*', study[authzField], props.userAuthMapping),
      }));
      setStudies(studiesWithAccessibleField);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error encountered while loading studies: ', err);
    });
  }, []);

  return (<DiscoveryBeta
    isLoading={studies === null}
    resources={studies === null ? [] : studies}
    {...props}
  />);
};

const mapStateToProps = state => ({
  userAuthMapping: state.userAuthMapping,
  config: discoveryConfig,
});

export default connect(mapStateToProps)(DiscoveryWithMDSBackend);
