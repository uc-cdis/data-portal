import {
  studyRegistrationConfig, discoveryConfig, mdsURL, cedarWrapperURL, userAPIPath, requestorPath,
} from '../localconf';
import { fetchWithCreds } from '../actions';
import { validFileNameChecks } from '../utils';

const STUDY_DATA_FIELD = 'gen3_discovery'; // field in the MDS response that contains the study data

export const preprocessStudyRegistrationMetadata = async (username, metadataID, updatedValues, GUIDType = 'discovery_metadata') => {
  try {
    const queryURL = `${mdsURL}/${metadataID}`;
    const queryRes = await fetch(queryURL);
    if (queryRes.status !== 200) {
      throw new Error(`Request for query study data at ${queryURL} failed with status ${queryRes.status}}`);
    }
    const studyMetadata = await queryRes.json();
    const studyRegistrationValidationField = studyRegistrationConfig?.studyRegistrationValidationField;
    const studyRegistrationTrackingField = studyRegistrationConfig?.studyRegistrationTrackingField;
    const tagField = discoveryConfig?.minimalFieldMapping?.tagsListFieldName;
    const metadataToUpdate = { ...studyMetadata };
    metadataToUpdate._guid_type = GUIDType;
    if (!Object.prototype.hasOwnProperty.call(metadataToUpdate, STUDY_DATA_FIELD)) {
      // it should already be there, but avoid errors if for some reason it's not
      metadataToUpdate.STUDY_DATA_FIELD = {};
    }
    if (tagField && updatedValues.repository) {
      if (!metadataToUpdate[STUDY_DATA_FIELD][tagField]) {
        metadataToUpdate[STUDY_DATA_FIELD][tagField] = [];
      }
      metadataToUpdate[STUDY_DATA_FIELD][tagField].push({
        name: updatedValues.repository,
        category: 'Data Repository',
      });
    }
    metadataToUpdate[STUDY_DATA_FIELD][studyRegistrationValidationField] = true;
    metadataToUpdate[STUDY_DATA_FIELD][studyRegistrationTrackingField] = username;

    // add all repository_study_ids as separate objects
    let tempStudyIDObj:any = [];
    if (updatedValues.repository_study_ids?.length > 0) {
      tempStudyIDObj = updatedValues.repository_study_ids.map((studyId) => ({
        repository_name: updatedValues.repository,
        repository_study_ID: studyId,
      }));
    } else if (updatedValues.repository) {
      tempStudyIDObj = [{
        repository_name: updatedValues.repository,
        repository_study_ID: '',
        repository_study_link: '',
        repository_persistent_ID: '',
      }];
    }
    metadataToUpdate[STUDY_DATA_FIELD].study_metadata.metadata_location.data_repositories = tempStudyIDObj;

    metadataToUpdate[STUDY_DATA_FIELD].study_metadata.metadata_location.clinical_trials_study_ID = updatedValues.clinical_trials_id;
    if (updatedValues.clinical_trials_id) {
      metadataToUpdate.clinicaltrials_gov = updatedValues.clinicaltrials_gov;
    }

    return metadataToUpdate;
  } catch (err) {
    throw new Error(`Request for query MDS failed: ${err}`);
  }
};

export const createCEDARInstance = async (cedarUserUUID, metadataToRegister = { clinicaltrials_gov: {} }):Promise<any> => {
  const cedarCreationURL = `${cedarWrapperURL}/create`;
  let updatedMetadataToRegister = { ...metadataToRegister };
  updatedMetadataToRegister = await fetchWithCreds({
    path: cedarCreationURL,
    method: 'POST',
    customHeaders: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cedar_user_uuid: cedarUserUUID,
      metadata: {
        appl_id: metadataToRegister[STUDY_DATA_FIELD].study_metadata.metadata_location.nih_application_id,
        project_title: metadataToRegister[STUDY_DATA_FIELD].study_metadata.minimal_info.study_name,
        study_description_summary: metadataToRegister[STUDY_DATA_FIELD].study_metadata.minimal_info.study_description,
        clinicaltrials_gov: metadataToRegister.clinicaltrials_gov,
      },
    }),
  }).then(({ status, data }) => {
    if (status !== 201) {
      throw new Error(`Request for create CEDAR instance failed with status ${status}`);
    }
    updatedMetadataToRegister[STUDY_DATA_FIELD].study_metadata.metadata_location.cedar_study_level_metadata_template_instance_ID = data?.cedar_instance_id || '';
    return Promise.resolve(updatedMetadataToRegister);
  })
    .catch((err) => { throw new Error(`Request for create CEDAR instance failed: ${err}`); });
  return updatedMetadataToRegister;
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
      throw new Error(`Request for update study data at ${updateURL} failed with status ${response.status}`);
    }
    return response;
  })
    .catch((err) => { throw new Error(`Request for update study data failed: ${err}`); });
};

export const generatePresignedURL = async (fileName: string, authz: string, bucketName: string|undefined = undefined):Promise<any> => {
  type ReqBody = {
    // eslint-disable-next-line camelcase
    file_name: string;
    authz: Array<string>;
    bucket?: string,
  };
  const body:ReqBody = {
    file_name: fileName,
    authz: [authz],
  };
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

export const doesUserHaveRequestPending = async (
  resourceID: string|Number|null|undefined = undefined,
  policyID: string|Number|null|undefined = undefined) => {
  const regexp = /^[a-zA-Z0-9\-_]{1,50}$/gm;
  if (resourceID && !new RegExp(regexp).test(resourceID.toString())) {
    throw new Error(`Invalid resource ID found: ${resourceID}`);
  }
  if (policyID && !new RegExp(regexp).test(policyID.toString())) {
    throw new Error(`Invalid policy ID found: ${policyID}`);
  }
  const res = await fetchWithCreds({
    path: `${requestorPath}request/user?${(resourceID === 0 || resourceID) ? `&resource_id=${resourceID}` : ''}${(policyID === 0 || policyID) ? `&policy_id=${policyID}` : ''}&status=DRAFT`,
    method: 'GET',
  });
  if (res.status !== 200) {
    throw new Error(`Encountered error while checking for existing request: ${JSON.stringify(res)}`);
  }
  return !!res.data?.length;
};



export const handleDataDictionaryNameValidation = (_:object, userInput:string): Promise<boolean|void> => {
  // console.log('here:', userInput);
  const {
    fileNameCharactersCheckRegex,
    invalidWindowsFileNames,
    maximumAllowedFileNameLength,
  } = validFileNameChecks;
  if (userInput.length > maximumAllowedFileNameLength) {
    return Promise.reject(`File name length is greater than ${maximumAllowedFileNameLength} characters`);
  }
  if (invalidWindowsFileNames.includes(userInput)) {
    return Promise.reject('Data Dictionary name is a reserved file name, please pick a different name.');
  }
  if (userInput.includes('@')) {
    return Promise.reject('Data Dictionary name can only use alphabetic and numeric characters, and []() ._-');
  }
  return Promise.resolve(true);
};
