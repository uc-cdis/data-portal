import { discoveryConfig, aggMDSDataURL } from '../localconf';

const retrieveFieldMapping = async (commonsName) => {
  const url = `${aggMDSDataURL}/${commonsName}/columns_to_fields`;
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

/**
 * getUniqueTags returns a reduced subset of unique tags for the given tags.
 *
 * @param {*} tags
 * @returns
 */
const getUniqueTags = tags =>
  tags.reduce((tagsSoFar, nextTag) => {
    if (tagsSoFar.has(nextTag.name)) {
      return tagsSoFar;
    }
    tagsSoFar.set(nextTag.name, {
      category: nextTag.category,
      name: nextTag.name,
    });
    return tagsSoFar;
  }, new Map());

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

  const commonsPromises = commons.map(commonsName => (
    Promise.all([
      retrieveFieldMapping(commonsName),
      retrieveCommonsInfo(commonsName),
    ])
  ));

  const responses = await Promise.all(commonsPromises);

  const allCommonsInfo = responses
    .reduce((commonsInfoByName, commonsInfo, index) => ({
      ...commonsInfoByName,
      [commons[index]]: commonsInfo,
    }), {});

  commons.forEach((commonsName) => {
    const [fieldMapping, commonsInfo] = allCommonsInfo[commonsName];

    const studies = metadataResponse[commonsName];

    const editedStudies = studies.map((entry, index) => {
      const keys = Object.keys(entry);
      const studyId = keys[0];

      const entryUnpacked = entry[studyId].gen3_discovery;
      const x = { ...entryUnpacked };
      x.study_id = studyId;
      x.commons = commonsName;
      x.frontend_uid = `${commonsName}_${index}`;

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
      discoveryConfig.tagCategories.forEach((tag) => {
        if (tag.name in x) {
          if (typeof x[tag.name] === 'string') {
            const tagValue = x[tag.name];
            x.tags.push(Object({ category: tag.name, name: tagValue }));
          } else if (Array.isArray(x[tag.name])) {
            x.tags = x.tags.concat(
              x[tag.name].map(name => ({ category: tag.name, name })),
            );
          }
        }
      });

      x.tag = getUniqueTags(x.tags);

      return x;
    });

    allStudies = allStudies.concat(editedStudies);
  });

  return allStudies;
};

const loadStudiesFromAggMDS = async () => {
  // Retrieve from aggregate MDS

  const offset = 0; // For pagination
  const limit = 1000; // Total number of rows requested

  const studies = await loadStudiesFromAggMDSRequests(offset, limit);

  return studies;
};

export default loadStudiesFromAggMDS;
