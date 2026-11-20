import { mdsURL, studyRegistrationConfig } from '../../../localconf';

const STUDY_DATA_FIELD = 'gen3_discovery'; // field in the MDS response that contains the study data

// Loads all studies of the given guid type from MDS, requesting `fetchSize` studies at a time
// until a page comes back with fewer than `fetchSize` entries.
const loadStudiesFromMDS = async (guidType = 'discovery_metadata', fetchSize = 2000) => {
  try {
    let allStudies = [];
    let offset = 0;
    let shouldContinue = true;
    while (shouldContinue) {
      const url = `${mdsURL}?data=True&_guid_type=${guidType}&limit=${fetchSize}&offset=${offset}`;
      // requests are intentionally sequential: we only need the next page if this one was full
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url);
      if (res.status !== 200) {
        throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
      }
      // eslint-disable-next-line no-await-in-loop
      const jsonResponse = await res.json();
      const studies = Object.values(jsonResponse).map((entry) => {
        const study = { ...entry[STUDY_DATA_FIELD] };
        // copy VLMD info if exists
        if (studyRegistrationConfig?.variableMetadataField && entry[studyRegistrationConfig.variableMetadataField]) {
          study[studyRegistrationConfig.variableMetadataField] = entry[studyRegistrationConfig.variableMetadataField];
        }
        return study;
      });
      allStudies = allStudies.concat(studies);
      // stop once a page comes back with fewer than fetchSize studies
      shouldContinue = studies.length >= fetchSize;
      offset += fetchSize;
    }
    return allStudies;
  } catch (err) {
    throw new Error(`Request for study data failed: ${err}`);
  }
};

// Loads the metadata of a single study from MDS, rather than the full list.
export const loadStudyFromMDS = async (guid) => {
  const url = `${mdsURL}/${encodeURIComponent(guid)}`;
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`Request for study data at ${url} failed with status ${res.status}`);
  }
  const entry = await res.json();
  const study = { ...entry[STUDY_DATA_FIELD] };
  if (studyRegistrationConfig?.variableMetadataField && entry[studyRegistrationConfig.variableMetadataField]) {
    study[studyRegistrationConfig.variableMetadataField] = entry[studyRegistrationConfig.variableMetadataField];
  }
  return study;
};

// Combines a study record shown in the Discovery table (which may come from the aggregate MDS)
// with its full metadata from MDS. MDS values take precedence, but fields that only exist on the
// table record are kept (e.g. __accessible, commons, commons_url), and so are the record's tags
// (e.g. the "Commons" tag added by the aggregate MDS).
export const mergeStudyWithMDSMetadata = (record, mdsStudy) => ({
  ...record,
  ...mdsStudy,
  tags: record.tags ?? mdsStudy.tags,
});

// Fetches the full metadata from MDS (never the aggregate MDS) for each of the given study records,
// using `record[uidFieldName]` as the metadata GUID.
export const loadSelectedStudiesFromMDS = (selectedResources, uidFieldName) => Promise.all(
  selectedResources.map(async (record) => {
    const guid = record[uidFieldName];
    if (!guid) {
      throw new Error(`Selected study is missing its UID field "${uidFieldName}"`);
    }
    const mdsStudy = await loadStudyFromMDS(guid);
    return mergeStudyWithMDSMetadata(record, mdsStudy);
  }),
);

export default loadStudiesFromMDS;
