import { discoveryConfig, aggMDSDataURL, studyRegistrationConfig } from '../../../localconf';

/**
 * getUniqueTags returns a reduced subset of unique tags for the given tags.
 *
 * @param {*} tags
 * @returns array with duplicates removed
 */
const getUniqueTags = ((tags) => tags.filter((v, i, a) => a.findIndex((t) => (
  t.name?.length > 0 && t.category === v.category && t.name === v.name)) === i));

const unpackAggMDSEntry = (entry, studyId, commonsName, index) => {
  const entryUnpacked = entry[studyId].gen3_discovery;
  entryUnpacked.study_id = studyId;
  entryUnpacked.commons = commonsName;
  entryUnpacked.frontend_uid = `${commonsName}_${index}`;
  entryUnpacked.tags = entryUnpacked.tags || [];
  entryUnpacked.tags.push(Object({ category: 'Commons', name: commonsName }));

  // If the discoveryConfig has a tag with the same name as one of the fields on an entry,
  // add the value of that field as a tag.

  discoveryConfig?.tagCategories.forEach((tag) => {
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
  if (studyRegistrationConfig?.variableMetadataField && entry[studyId][studyRegistrationConfig.variableMetadataField]) {
    entryUnpacked[studyRegistrationConfig.variableMetadataField] = entry[studyId][studyRegistrationConfig.variableMetadataField];
  }
  return entryUnpacked;
};

const AGG_MDS_PAGE_SIZE = 2000;

// Fetches one page of studies from the aggregate MDS.
// Returns the unpacked studies and the raw number of entries in the page.
const loadStudiesFromAggMDSRequests = async (offset, limit) => {
  const url = `${aggMDSDataURL}?data=True&limit=${limit}&offset=${offset}`;

  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
  }

  const metadataResponse = await res.json();

  // According to the API: https://petstore.swagger.io/?url=https://gist.githubusercontent.com/craigrbarnes/3ac95d4d6b5dd08d280a28ec0ae2a12d/raw/58a562c9b3a343e535849ad4085a3b27942b2b57/openapi.yaml#/Query/metadata_metadata_get
  const commons = Object.keys(metadataResponse);

  let studies = [];

  commons.forEach((commonsName) => {
    const editedStudies = metadataResponse[commonsName].map((entry, index) => {
      const studyId = Object.keys(entry)[0];
      // offset the index so frontend_uid stays unique across pages
      return unpackAggMDSEntry(entry, studyId, commonsName, offset + index);
    });

    studies = studies.concat(editedStudies);
  });
  return studies;
};

// Loads all studies from the aggregate MDS, requesting `pageSize` studies at a time
// until a page comes back with fewer than `pageSize` entries.
const loadStudiesFromAggMDS = async (pageSize = AGG_MDS_PAGE_SIZE) => {
  let allStudies = [];
  let offset = 0;
  let shouldContinue = true;
  while (shouldContinue) {
    // requests are intentionally sequential: we only need the next page if this one was full
    // eslint-disable-next-line no-await-in-loop
    const studies = await loadStudiesFromAggMDSRequests(offset, pageSize);
    allStudies = allStudies.concat(studies);
    // stop once a page comes back with fewer than pageSize studies
    shouldContinue = studies.length >= pageSize;
    offset += pageSize;
  }
  return allStudies;
};

// Loads a single study by GUID from the aggregate MDS.
export const loadStudyFromAggMDS = async (guid) => {
  const url = `${aggMDSDataURL}/guid/${encodeURIComponent(guid)}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed with status ${res.status}`);
  }
  const body = await res.json();
  if (!body?.gen3_discovery) {
    throw new Error(`Study ${guid} not found in aggregate MDS`);
  }
  return unpackAggMDSEntry({ [guid]: body }, guid, body.commons_name || 'unknown', 0);
};

export default loadStudiesFromAggMDS;
