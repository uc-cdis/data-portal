import { discoveryConfig, hostname } from '../localconf';

const aggMDSURL = `${hostname}mds/aggregate`;
const aggMDSDataURL = `${aggMDSURL}/metadata`;


const retrieveFieldMapping = async (commonsName) => {
  const url = `${aggMDSDataURL}/${commonsName}/field_to_columns`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for field mapping at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  const jsonResponse = await res.json();

  return jsonResponse;
};

const retrieveCommonsInfo = async (commonsName) => {
  const url = `${aggMDSDataURL}/${commonsName}/info`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for commons info at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  const jsonResponse = await res.json();

  return jsonResponse;
};

const loadStudiesFromAggMDSRequests = async (offset, limit) => {
  const url = `${aggMDSDataURL}?data=True&limit=${limit}&offset=${offset}`;

  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  const metadataResponse = await res.json();

  // According to the API: https://petstore.swagger.io/?url=https://gist.githubusercontent.com/craigrbarnes/3ac95d4d6b5dd08d280a28ec0ae2a12d/raw/58a562c9b3a343e535849ad4085a3b27942b2b57/openapi.yaml#/Query/metadata_metadata_get
  const commons = Object.keys(metadataResponse);

  let allStudies = [];
  for (let j = 0; j < commons.length; j += 1) {
    const commonsName = commons[j];
    // Now retrieve field mappings for each commons
    // eslint-disable-next-line no-await-in-loop
    const fieldMapping = await retrieveFieldMapping(commonsName);
    // eslint-disable-next-line no-await-in-loop
    const commonsInfo = await retrieveCommonsInfo(commonsName);

    const studies = metadataResponse[commonsName];

    const editedStudies = studies.map((entry, index) => {
      const keys = Object.keys(entry);
      const studyId = keys[0];

      const entryUnpacked = entry[studyId].gen3_discovery;
      const x = { ...entryUnpacked };
      x.study_id = studyId;
      x.commons = commonsName;
      x.frontend_uid = `${commonsName}_${index}`;

      // let shortNameKey = fieldMapping.short_name || 'short_name';
      x.name = x[fieldMapping.short_name];
      if (fieldMapping.short_name === 'authz' && Array.isArray(x.name)) {
        x.name = x.name[0].split('/').slice(-1)[0];
      }
      if (fieldMapping.short_name === 'auth_resource_path') {
        x.name = x.name.split('/').slice(-1)[0];
      }
      x.short_name = x.name;
      x.full_name = x[fieldMapping.full_name];
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
          const tagValue = x[tag.name];
          x.tags.push(Object({ category: tag.name, name: tagValue }));
        } else if (Object.prototype.hasOwnProperty.call(x, tag.name)
            && Array.isArray(x[tag.name])) {
          for (let z = 0; z < x[tag.name].length; z += 1) {
            x.tags.push({ category: tag.name, name: x[tag.name][z] });
          }
        }
      }
      // Remove duplicates from the object's tagset
      const tagNamesSoFar = [];
      const tags = x.tags;
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

const loadStudiesFromAggMDS = async () => {
  // Retrieve from aggregate MDS

  // TODO: connect the UI to these variables
  const offset = 0; // For pagination
  const limit = 1000; // Total number of rows requested

  const studies = await loadStudiesFromAggMDSRequests(offset, limit);

  return studies;
};

export default loadStudiesFromAggMDS;
