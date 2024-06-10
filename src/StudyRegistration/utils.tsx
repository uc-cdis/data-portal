import {
  studyRegistrationConfig, discoveryConfig, mdsURL, cedarWrapperURL, userAPIPath, requestorPath,
} from '../localconf';
import { fetchWithCreds } from '../actions';
import { validFileNameChecks } from '../utils';

const LIMIT = 2000; // required or else mds defaults to returning 10 records
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
        study_metadata: {
          metadata_location: {
            nih_application_id: metadataToRegister[STUDY_DATA_FIELD].study_metadata.metadata_location.nih_application_id,
          },
          minimal_info: {
            study_name: metadataToRegister[STUDY_DATA_FIELD].study_metadata.minimal_info.study_name,
            study_description: metadataToRegister[STUDY_DATA_FIELD].study_metadata.minimal_info.study_description,
          },
        },
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

export const updateStudyInMDS = async (metadataID, metadataToUpdate = {}) => {
  const updateURL = `${mdsURL}/${metadataID}?overwrite=true`;
  await fetchWithCreds({
    path: updateURL,
    method: 'POST',
    customHeaders: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadataToUpdate),
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
  if (userInput.length > validFileNameChecks.maximumAllowedFileNameLength) {
    return Promise.reject(
      `Data Dictionary name length is greater than ${validFileNameChecks.maximumAllowedFileNameLength} characters`,
    );
  }
  if (validFileNameChecks.invalidWindowsFileNames.includes(userInput)) {
    return Promise.reject('Data Dictionary name is a reserved file name, please pick a different name.');
  }
  if (userInput.match(validFileNameChecks.fileNameCharactersCheckRegex)) {
    return Promise.reject('Data Dictionary name can only use alphabetic and numeric characters, and []() ._-');
  }
  return Promise.resolve(true);
};

export const loadCDEInfoFromMDS = async (guidType = 'cde_metadata') => {
  try {
    let allCDEInfo:any = [];
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
        throw new Error(`Request for CDE metadata at ${url} failed. Response: ${JSON.stringify(res, null, 2)}`);
      }
      // eslint-disable-next-line no-await-in-loop
      const jsonResponse = await res.json();
      const cdeInfoList = Object.entries(jsonResponse).map(([k, v]) => {
        const key:string = k;
        const value:any = v;
        const cdeInfo = {
          drupalID: value.drupal_id,
          fileName: value.file_name,
          guid: key,
          isCoreCDE: !!value.is_core_cde,
        };
        return cdeInfo;
      });
      allCDEInfo = allCDEInfo.concat(cdeInfoList);
      const noMoreCDEToLoad = cdeInfoList.length < LIMIT;
      if (noMoreCDEToLoad) {
        shouldContinue = false;
        return allCDEInfo;
      }
      offset += LIMIT;
    }
    return allCDEInfo;
  } catch (err) {
    throw new Error(`Request for CDE metadata failed: ${err}`);
  }
};

export const updateCDEMetadataInMDS = async (metadataID, updatedCDEInfo) => {
  try {
    const queryURL = `${mdsURL}/${metadataID}`;
    const queryRes = await fetch(queryURL);
    if (queryRes.status !== 200) {
      throw new Error(`Request for query study data at ${queryURL} failed with status ${queryRes.status}}`);
    }
    const studyMetadata = await queryRes.json();
    const variableMetadataField = studyRegistrationConfig?.variableMetadataField;
    const metadataToUpdate = { ...studyMetadata };
    if (!Object.prototype.hasOwnProperty.call(metadataToUpdate, variableMetadataField)) {
      // create VLMD metadata section in metadata if doesn't exist yet
      metadataToUpdate[variableMetadataField] = {};
    }
    if (!Object.prototype.hasOwnProperty.call(metadataToUpdate[variableMetadataField], 'common_data_elements')) {
      // create CDE metadata section inside VLMD metadata section if doesn't exist yet
      metadataToUpdate[variableMetadataField].common_data_elements = {};
    }
    const cdeMetadataToUpdate = updatedCDEInfo.reduce((acc, entry) => {
      const { option, guid } = entry;
      return { ...acc, [option]: guid };
    }, {});
    metadataToUpdate[variableMetadataField].common_data_elements = cdeMetadataToUpdate;
    // update tags
    const tagField = discoveryConfig?.minimalFieldMapping?.tagsListFieldName;
    if (tagField) {
      if (!metadataToUpdate[STUDY_DATA_FIELD][tagField]) {
        metadataToUpdate[STUDY_DATA_FIELD][tagField] = [];
      }
      // remove any existing CDE tags first
      const updatedTags = metadataToUpdate[STUDY_DATA_FIELD][tagField].filter((entry) => entry.category !== 'Common Data Elements');
      Object.keys(cdeMetadataToUpdate).forEach((cdeKey) => updatedTags.push({ name: cdeKey, category: 'Common Data Elements' }));
      metadataToUpdate[STUDY_DATA_FIELD][tagField] = updatedTags;
    }

    // update filters
    const filterField = discoveryConfig?.features?.advSearchFilters?.field;
    if (filterField) {
      if (!metadataToUpdate[STUDY_DATA_FIELD][filterField]) {
        metadataToUpdate[STUDY_DATA_FIELD][filterField] = [];
      }
      // remove any existing CDE filters first
      const updatedFilters = metadataToUpdate[STUDY_DATA_FIELD][filterField].filter((entry) => entry.key !== 'Common Data Elements');
      Object.keys(cdeMetadataToUpdate).forEach((cdeKey) => updatedFilters.push({ value: cdeKey, key: 'Common Data Elements' }));
      metadataToUpdate[STUDY_DATA_FIELD][filterField] = updatedFilters;
    }
    await updateStudyInMDS(metadataID, metadataToUpdate);
  } catch (err) {
    throw new Error(`Request for query MDS failed: ${err}`);
  }
};
