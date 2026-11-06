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

export default loadStudiesFromMDS;
