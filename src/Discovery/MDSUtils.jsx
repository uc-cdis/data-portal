import { mdsURL } from '../localconf';

const LIMIT = 1000; // required or else mds defaults to returning 10 records
const STUDY_DATA_FIELD = 'gen3_discovery'; // field in the MDS response that contains the study data

const loadStudiesFromMDS = async (guidType = 'discovery_metadata') => {
  try {
    let allStudies = [];
    let offset = 0;
    // request up to LIMIT studies from MDS at a time.
    let shouldContinue = true;
    while (shouldContinue) {
      const url = `${mdsURL}?data=True&_guid_type=${guidType}&limit=${LIMIT}&offset=${offset}`;
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

export default loadStudiesFromMDS;
