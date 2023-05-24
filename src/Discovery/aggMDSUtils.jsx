import { discoveryConfig, aggMDSDataURL, studyRegistrationConfig } from '../localconf';

/**
 * getUniqueTags returns a reduced subset of unique tags for the given tags.
 *
 * @param {*} tags
 * @returns array with duplicates removed
 */
const getUniqueTags = ((tags) => tags.filter((v, i, a) => a.findIndex((t) => (
  t.name?.length > 0 && t.category === v.category && t.name === v.name)) === i));

// eslint-disable-next-line no-unused-vars
const loadStudiesFromAggMDSRequests = async (offset, limit) => {
  const url = 'https://localhost:9443/original_data.json';
  /// const url = `${aggMDSDataURL}?data=True&limit=${limit}&offset=${offset}`;

  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  const metadataResponse = await res.json();

  // According to the API: https://petstore.swagger.io/?url=https://gist.githubusercontent.com/craigrbarnes/3ac95d4d6b5dd08d280a28ec0ae2a12d/raw/58a562c9b3a343e535849ad4085a3b27942b2b57/openapi.yaml#/Query/metadata_metadata_get
  const commons = Object.keys(metadataResponse);

  let allStudies = [];

  commons.forEach((commonsName) => {
    const studies = metadataResponse[commonsName];

    const editedStudies = studies.map((entry, index) => {
      const keys = Object.keys(entry);
      const studyId = keys[0];

      const entryUnpacked = entry[studyId].gen3_discovery;
      entryUnpacked.study_id = studyId;
      entryUnpacked.commons = commonsName;
      entryUnpacked.frontend_uid = `${commonsName}_${index}`;
      entryUnpacked.tags = entryUnpacked.tags || [];
      entryUnpacked.tags.push(Object({ category: 'Commons', name: commonsName }));

      // If the discoveryConfig has a tag with the same name as one of the fields on an entry,
      // add the value of that field as a tag.

      discoveryConfig.tagCategories.forEach((tag) => {
        if (tag.name in entryUnpacked) {
          if (typeof entryUnpacked[tag.name] === 'string') {
            const tagValue = entryUnpacked[tag.name];
            entryUnpacked.tags.push(Object({ category: tag.name, name: tagValue }));
          } else if (Array.isArray(entryUnpacked[tag.name])) {
            entryUnpacked.tags = entryUnpacked.tags.concat(
              entryUnpacked[tag.name].map((name) => ({ category: tag.name, name })),
            );
          }
        }
      });
      entryUnpacked.tags = [...getUniqueTags(entryUnpacked.tags).entries()].map((e) => (e[1]));

      // copy VLMD info if exists
      if (studyRegistrationConfig?.dataDictionaryField && entry[studyId][studyRegistrationConfig.dataDictionaryField]) {
        entryUnpacked[studyRegistrationConfig.dataDictionaryField] = entry[studyId][studyRegistrationConfig.dataDictionaryField];
      }
      return entryUnpacked;
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
