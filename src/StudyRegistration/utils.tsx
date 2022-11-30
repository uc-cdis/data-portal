import {
  studyRegistrationConfig, mdsURL, cedarWrapperURL, userAPIPath,
} from '../localconf';
import { fetchWithCreds } from '../actions';

const STUDY_DATA_FIELD = 'gen3_discovery'; // field in the MDS response that contains the study data

export const preprocessStudyRegistrationMetadata = async (username, metadataID, updatedValues = {}, GUIDType = 'discovery_metadata') => {
  try {
    const queryURL = `${mdsURL}/${metadataID}`;
    const queryRes = await fetch(queryURL);
    if (queryRes.status !== 200) {
      return Promise.reject(`Request for query study data at ${queryURL} failed with status ${queryRes.status}}`);
    }
    const studyMetadata = await queryRes.json();
    const studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
    const studyRegistrationTrackingField = studyRegistrationConfig?.studyRegistrationTrackingField;
    const metadataToUpdate = { ...studyMetadata };
    metadataToUpdate._guid_type = GUIDType;
    if (!Object.prototype.hasOwnProperty.call(metadataToUpdate, STUDY_DATA_FIELD)) {
      // it should already be there, but avoid errors if for some reason it's not
      metadataToUpdate.STUDY_DATA_FIELD = {};
    }
    metadataToUpdate[STUDY_DATA_FIELD][studyRegistrationValidationField] = true;
    metadataToUpdate[STUDY_DATA_FIELD][studyRegistrationTrackingField] = username;
    metadataToUpdate[STUDY_DATA_FIELD] = { ...metadataToUpdate[STUDY_DATA_FIELD], ...updatedValues };
    return metadataToUpdate;
  } catch (err) {
    return Promise.reject(`Request for query MDS failed: ${err}`);
  }
};

export const createCEDARInstance = async (cedarUserUUID, metadataToRegister = {}):Promise<any> => {
  const cedarCreationURL = `${cedarWrapperURL}/create`;
  const updatedMetadataToRegister = { ...metadataToRegister };
  await fetchWithCreds({
    path: cedarCreationURL,
    method: 'POST',
    customHeaders: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cedar_user_uuid: cedarUserUUID, metadata: metadataToRegister[STUDY_DATA_FIELD] }),
  }).then(({ status, data }) => {
    if (status !== 201) {
      return Promise.reject(`Request for create CEDAR instance failed with status ${status}`);
    }
    updatedMetadataToRegister[STUDY_DATA_FIELD].cedar_instance_id = data?.cedar_instance_id || '';
    return updatedMetadataToRegister;
  })
    .catch((err) => Promise.reject(`Request for create CEDAR instance failed: ${err}`));
};

export const registerStudyInMDS = async (metadataID, metadataToRegister = {}) => {
  const updateURL = `${mdsURL}/${metadataID}?overwrite=true`;
  await fetchWithCreds({
    path: updateURL,
    method: 'POST',
    customHeaders: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadataToRegister),
  }).then((response) => {
    if (response.status !== 200) {
      return Promise.reject(`Request for update study data at ${updateURL} failed with status ${response.status}`);
    }
    return response;
  })
    .catch((err) => Promise.reject(`Request for update study data failed: ${err}`));
};

export const generatePresignedURL = async (fileName: string, bucketName: string|undefined = undefined):Promise<any> => {
  type ReqBody = {
    // eslint-disable-next-line camelcase
    file_name: string;
    bucket?: string,
  };
  const body:ReqBody = { file_name: fileName };
  if (bucketName) {
    body.bucket = bucketName;
  }
  const JSONbody = JSON.stringify(body);
  const dataUploadURL = `${userAPIPath}data/upload`;
  const responseData = await fetchWithCreds({
    path: dataUploadURL,
    method: 'POST',
    customHeaders: { 'Content-Type': 'application/json' },
    body: JSONbody,
  }).then(({ status, data }) => {
    if (status !== 201) {
      return Promise.reject(`status ${status}`);
    }
    if (!data?.url) {
      return Promise.reject('no presignedURL returned');
    }
    return Promise.resolve(data);
  })
    .catch((err) => Promise.reject(`Request for prepare for upload failed: ${err}`));
  return responseData;
};

export const cleanUpFileRecord = async (guid:string) => {
  const dataDeletionURL = `${userAPIPath}data/${guid}`;
  await fetchWithCreds({
    path: dataDeletionURL,
    method: 'DELETE',
  }).then(({ status }) => {
    if (status !== 204) {
      return Promise.reject(`status ${status}`);
    }
    return Promise.resolve();
  })
    .catch((err) => Promise.reject(`Request for clean up GUID ${guid} failed: ${err}`));
};
