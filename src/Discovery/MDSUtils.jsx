import { hostname } from '../localconf';
import { fetchWithCreds } from '../actions';

const LIMIT = 1000; // required or else mds defaults to returning 10 records
const MDS_URL = `${hostname}mds/metadata`;
const STUDY_DATA_FIELD = 'gen3_discovery'; // field in the MDS response that contains the study data

export const loadStudiesFromMDS = async (guidType = 'discovery_metadata') => {
  try {
    let allStudies = [];
    let offset = 0;
    // request up to LIMIT studies from MDS at a time.
    let shouldContinue = true;
    while (shouldContinue) {
      const url = `${MDS_URL}?data=True&_guid_type=${guidType}&limit=${LIMIT}&offset=${offset}`;
      // It's OK to disable no-await-in-loop rule here -- it's telling us to refactor
      // using Promise.all() so that we can fire multiple requests at one.
      // But we WANT to delay sending the next request to MDS until we know we need it.
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url);
      if (res.status !== 200) {
        throw new Error(`Request for study data at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
      }
      // eslint-disable-next-line no-await-in-loop
      const jsonResponse = await res.json();
      const studies = Object.values(jsonResponse).map((entry) => entry[STUDY_DATA_FIELD]);
      allStudies = allStudies.concat(studies);
      const noMoreStudiesToLoad = studies.length < LIMIT;
      if (noMoreStudiesToLoad) {
        shouldContinue = false;
        return allStudies;
      }
      offset += LIMIT;
    }
    return allStudies;
  } catch (err) {
    throw new Error(`Request for study data failed: ${err}`);
  }
};

export const registerStudyInMDS = async (username, metadataID, updatedValues = {}, GUIDType = 'discovery_metadata') => {
  try {
    const queryURL = `${MDS_URL}/${metadataID}`;
    const queryRes = await fetch(queryURL);
    if (queryRes.status !== 200) {
      throw new Error(`Request for query study data at ${queryURL} failed. Response: ${JSON.stringify(queryRes, null, 2)}`);
    }
    const studyMetadata = await queryRes.json();
    const metadataToUpdate = { ...studyMetadata };
    metadataToUpdate._guid_type = GUIDType;
    metadataToUpdate[STUDY_DATA_FIELD].registrant_username = username;
    metadataToUpdate[STUDY_DATA_FIELD] = { ...metadataToUpdate[STUDY_DATA_FIELD], ...updatedValues };
    const updateURL = `${MDS_URL}/${metadataID}?overwrite=true`;
    fetchWithCreds({
      path: updateURL,
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadataToUpdate),
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error(`Request for update study data at ${updateURL} failed. Response: ${JSON.stringify(response, null, 2)}`);
      }
      return null;
    });
  } catch (err) {
    throw new Error(`Request for update study data failed: ${err}`);
  }
};
