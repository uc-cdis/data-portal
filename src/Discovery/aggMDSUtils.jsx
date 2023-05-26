import { discoveryConfig, aggMDSDataURL, studyRegistrationConfig } from '../localconf';

/**
 * getUniqueTags returns a reduced subset of unique tags for the given tags.
 *
 * @param {*} tags
 * @returns array with duplicates removed
 */
const getUniqueTags = ((tags) => tags.filter((v, i, a) => a.findIndex((t) => (
  t.name?.length > 0 && t.category === v.category && t.name === v.name)) === i));

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

  const commonsPromises = commons.map((commonsName) => (
    Promise.all([
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
    const [commonsInfo] = allCommonsInfo[commonsName];

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

const loadStudiesFromAggMDS = async (config) => {
  // Retrieve from aggregate MDS

  const offset = 0; // For pagination
  const limit = 1000; // Total number of rows requested
  const manifestFieldName = config.features?.exportToWorkspace?.manifestFieldName ?
    config.features.exportToWorkspace.manifestFieldName : '__manifest';

  const studies = await loadStudiesFromAggMDSRequests(offset, limit, manifestFieldName);

  return studies;
};

/**
 * Will try to get the study manifest data from the aggregateMDS and returns
 * the study with the newly populated manifest field
 * @param study - study to get a manifest for
 * @param manifestFieldName - name of the manifest member (default __manifest)
 * @returns {Promise<*>} - the updated study data
 */
const loadStudyFromMDS = async (study, manifestFieldName) => {
  if (study[manifestFieldName] === 0) return { study, [manifestFieldName]: [] };

  const url = `${aggMDSDataURL}/guid/${study.guid}`;
  const resp = await fetch(url);
  if (resp.status !== 200) {
    throw new Error(`Request for study info at ${url} failed. Response: ${JSON.stringify(resp, null, 2)}`);
  }
  const studyWithManifest = await resp.json();
  return { ...study, [manifestFieldName]: studyWithManifest[manifestFieldName] };
};

// eslint-disable-next-line max-len
export const loadManifestFromResources = async (selectedResources, manifestFieldName) => Promise.all(selectedResources.map((x) => loadStudyFromMDS(x, manifestFieldName)));

export default loadStudiesFromAggMDS;
