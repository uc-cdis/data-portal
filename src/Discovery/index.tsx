import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Discovery from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { discoveryConfig, useArboristUI } from '../localconf';
// TODO: delete this once the aggregate MDS is running.
import loadStudiesFromMDSDDeprecated from './deprecated';

import mockAggMDSData from './__mocks__/mock_agg_mds_studies.json';
import mockFieldMappingData from './__mocks__/mock_agg_mds_field_mapping.json';

// TODO: Replace this variable value with the correct agg MDS url.
const aggMDSURL = '/agg-mds';
const aggMDSDataURL = `${aggMDSURL}/metadata`;
const fieldMappingURL = `${aggMDSURL}/field_to_columns`;

// Keeping this because it has POPULATE_GUID and other options
const COMMONS = {
  GDC: {
    MDS_URL: 'https://gen3.datacommons.io/mds/metadata',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'GDC',
    POPULATE_GUID: false,
    OFFSET: 3,
  },
  BDC: {
    MDS_URL: 'https://staging.gen3.biodatacatalyst.nhlbi.nih.gov/mds/metadata',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'BDC',
    POPULATE_GUID: false,
    OFFSET: 0,
  },
  AnVil: {
    MDS_URL: 'https://internalstaging.theanvil.io/mds/metadata',
    GUID_TYPE: 'discovery_metadata',
    STUDY_DATA_FIELD: 'gen3_discovery',
    LIMIT: 1000,
    COMMONS: 'AnVIL',
    POPULATE_GUID: true,
    OFFSET: 0,
  },
};

const retrieveFieldMapping = async (commonsName: string) => { // : Promise<any[]> => {
  const url = `${fieldMappingURL}/${commonsName}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  // TODO: uncomment this
  // const jsonResponse = await res.json();

  // Temporarily some mock data.
  const jsonResponse = mockFieldMappingData;

  return jsonResponse;
};

const loadStudiesFromAggMDS = async (offset:number = 0, limit:number = 100) => {
  const url = `${aggMDSDataURL}?data=True&limit=${limit}&offset=${offset}`;

  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  // TODO: uncomment this
  // const jsonResponse = await res.json();

  // Temporarily: some mock data.
  const metadataResponse = mockAggMDSData;

  // According to the API: https://petstore.swagger.io/?url=https://gist.githubusercontent.com/craigrbarnes/3ac95d4d6b5dd08d280a28ec0ae2a12d/raw/58a562c9b3a343e535849ad4085a3b27942b2b57/openapi.yaml#/Query/metadata_metadata_get
  const commons = Object.keys(metadataResponse);

  let allStudies = [];
  for (let j = 0; j < commons.length; j += 1) {
    const commonsName = commons[j];
    // Now retrieve field mappings for the commons
    // eslint-disable-next-line no-await-in-loop
    const fieldMapping = await retrieveFieldMapping(commonsName);
    console.log('The fieldMapping for ', commonsName, ' is ', fieldMapping);

    const studies = metadataResponse[commonsName];

    const editedStudies = studies.map((entry, index) => {
      const x = { ...entry };
      x.commons = commonsName;
      x.frontend_uid = `${commonsName}_${index}`;

      if (COMMONS[commonsName].POPULATE_GUID) {
        // need to do this as in case MDS does not have _unique_id
        x._unique_id = x[fieldMapping.study_id];
      }
      if (commonsName === 'GDC') { // hacky hacky
        if (Object.keys(fieldMapping).includes('short_name')) {
          x.name = x[fieldMapping.short_name];
        } else {
          x.name = x.short_name;
        }
        x.study_id = x.dbgap_accession_number; // x[fieldMapping.dbgap_accession_number];
        x.study_id = x.dbgap_accession_number;
        // Different GDC studies have different patient descriptors
        if (x.subjects_count) {
          x._subjects_count = x.subjects_count;
        }
        if (x.cases_count) {
          x._subjects_count = x.cases_count;
        }
        x.study_description = x.description; // x[fieldMapping.description];
      }
      x._unique_id = `${commonsName}_${x._unique_id}_${index}`;
      x.tags = [];
      x.tags.push(Object({ category: 'Commons', name: commonsName }));

      for (let i = 0; i < discoveryConfig.tagCategories.length; i += 1) {
        const tag = discoveryConfig.tagCategories[i];

        let tagValue;
        if (Object.prototype.hasOwnProperty.call(x, tag.name)) {
          tagValue = x[tag.name];
        }
        if (tagValue) {
          x.tags.push(Object({ category: tag.name, name: tagValue }));
        }
      }
      return x;
    });
    allStudies = allStudies.concat(editedStudies);
  }
  return allStudies;
};

const loadStudiesFromMDS = async (): Promise<any[]> => {
  // try {
  // Retrieve from aggregate MDS

  // TODO: connect the UI to these variables
  const offset = 0; // For pagination
  const limit = 100; // Total number of rows requested

  const studies = await loadStudiesFromAggMDS(offset, limit);

  console.log('studies retrieved: ', studies);
  return studies;
  // } catch (err) {
  //   throw new Error(`Request for joined study data failed: ${err}`);
  // }
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
    // loadStudiesFromMDS().then((rawStudies) => {
    // Switching back to deprecated function to see the 500k studies dataset
    loadStudiesFromMDSDDeprecated().then((rawStudies) => {
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
