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
// const aggMDSURL = '/agg-mds';
const aggMDSURL = 'http://localhost:8000';
const aggMDSDataURL = `${aggMDSURL}/metadata`;

const retrieveFieldMapping = async (commonsName: string) => { // : Promise<any[]> => {
  const url = `${aggMDSDataURL}/${commonsName}/field_to_columns`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for field mapping at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  const jsonResponse = await res.json();
  console.log('29 response: ', jsonResponse);

  // Temporarily some mock data.
  // const jsonResponse = mockFieldMappingData;

  return jsonResponse;
};

const retrieveCommonsInfo = async (commonsName: string) => { // : Promise<any[]> => {
  const url = `${aggMDSDataURL}/${commonsName}/info`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for commons info at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  const jsonResponse = await res.json();

  return jsonResponse;
};

const loadStudiesFromAggMDS = async (offset:number = 0, limit:number = 100) => {
  const url = `${aggMDSDataURL}?data=True&limit=${limit}&offset=${offset}`;

  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  // TODO: uncomment this
  const metadataResponse = await res.json();
  console.log('46 response: ', metadataResponse);

  // Temporarily: some mock data.
  // const metadataResponse = mockAggMDSData;

  // According to the API: https://petstore.swagger.io/?url=https://gist.githubusercontent.com/craigrbarnes/3ac95d4d6b5dd08d280a28ec0ae2a12d/raw/58a562c9b3a343e535849ad4085a3b27942b2b57/openapi.yaml#/Query/metadata_metadata_get
  const commons = Object.keys(metadataResponse);

  let allStudies = [];
  for (let j = 0; j < commons.length; j += 1) {
    const commonsName = commons[j];
    // Now retrieve field mappings for each commons
    // eslint-disable-next-line no-await-in-loop
    const fieldMapping = await retrieveFieldMapping(commonsName);
    const commonsInfo = await retrieveCommonsInfo(commonsName);
    console.log('The fieldMapping for ', commonsName, ' is ', fieldMapping);

    const studies = metadataResponse[commonsName];

    const editedStudies = studies.map((entry, index) => {
      let keys = Object.keys(entry);
      let study_id = keys[0];

      let entryUnpacked = entry[study_id].gen3_discovery;
      const x = { ...entryUnpacked };
      x.study_id = study_id;
      x.commons = commonsName;
      x.frontend_uid = `${commonsName}_${index}`;

      // let shortNameKey = fieldMapping.short_name || 'short_name';
      x.name = x[fieldMapping.short_name];
      if(fieldMapping.short_name == 'authz' && Array.isArray(x.name)) {
          x.name = x.name[0].split('/').slice(-1)[0];
      }
      if(fieldMapping.short_name == 'auth_resource_path') {
          x.name = x.name.split('/').slice(-1)[0];
      }
      x.short_name = x.name;
      x.full_name = x[fieldMapping.full_name]
      x._subjects_count = x[fieldMapping._subjects_count];
      x.study_description = x[fieldMapping.study_description];
      x._unique_id = `${commonsName}_${x._unique_id}_${index}`;
      x.commons_url = commonsInfo.commons_url;
      x.tags.push(Object({ category: 'Commons', name: commonsName }));

      // If the discoveryConfig has a tag with the same name as one of the fields on an entry,
      // add the value of that field as a tag.
      for (let i = 0; i < discoveryConfig.tagCategories.length; i += 1) {
        const tag = discoveryConfig.tagCategories[i];
        if (Object.prototype.hasOwnProperty.call(x, tag.name) && typeof x[tag.name] === 'string') {
          let tagValue = x[tag.name];
          x.tags.push(Object({ category: tag.name, name: tagValue }));
        } else if (Object.prototype.hasOwnProperty.call(x, tag.name) && Array.isArray(x[tag.name])) {
          for (let z = 0; z < x[tag.name].length; z += 1) {
            x.tags.push({ category: tag.name, name: x[tag.name][z] });
          }
        }
      }
      // Remove duplicates from the object's tagset
      let tagNamesSoFar = [];
      let tags = x.tags;
      x.tags = [];
      for (let m = 0; m < tags.length; m += 1) {
        if (!tagNamesSoFar.includes(tags[m].name)) {
          x.tags.push({ category: tags[m].category, name: tags[m].name });
          tagNamesSoFar.push(tags[m].name);
        }
      }

      return x;
    });
    allStudies = allStudies.concat(editedStudies);
  }
  return allStudies;
};

const loadStudiesFromMDS = async (): Promise<any[]> => {
  // Retrieve from aggregate MDS

  // TODO: connect the UI to these variables
  const offset = 0; // For pagination
  const limit = 100; // Total number of rows requested

  const studies = await loadStudiesFromAggMDS(offset, limit);

  console.log('studies retrieved: ', studies);
  return studies;
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
    loadStudiesFromMDS().then((rawStudies) => {
    // Using the deprecated functions for now so as to see the big dataset
    // loadStudiesFromMDSDDeprecated().then((rawStudies) => {
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
