/**
* This demo feature is depending on Peregrine's bdbag branch.
* We do following steps:
* 1. Hit Peregrine's bdbag endpoint using a set of submitter IDs
* 2. Get reponse url (which relates to an s3 bucket resource) from Peregrine
* 3. HIt Saturn's "import data" endpoint using this url as argument

* After we decide plan for this feature, we will implement the backend to support generating data.
* This bgbag.js will be gone anyway.
*/

import { fetchWithCreds } from '../../actions';
import { queryDataBySQON, queryDataByIds } from '../arrangerQueryHelper';

export const getBDBagQuery = referenceIDList => `{
  participants: 
    case(first:0${referenceIDList !== undefined ? `,submitter_id: ["${referenceIDList.join('","')}"]` : ''})
    {
       _participant_id:submitter_id
    }
    samples:sample(first:0
    ${referenceIDList !== undefined ? `, with_path_to_any:[
    ${referenceIDList.map(item => (`{type: "case", submitter_id: "${item}"}`))}
    ]` : ''}
    ) {
      composition
      submitter_specimen_type:biospecimen_anatomic_site
      cases {
          participant:submitter_id
          donor_uuid:id
          project:project_id
      }
      
      aliquots(first:0){
          submitter_sample_id:submitter_id
          _sample_id:id
          read_groups(first:0){
              center_name:sequencing_center
              submitter_experimental_design:library_strategy
              platform
              submitted_unaligned_reads_files{
                 file_type0:data_format
                 file_dos_uri0:object_id
                 upload_file_id0:object_id
                 file_path0:file_name
              }      
              submitted_aligned_reads_files{
                 file_type2:data_format
                 upload_file_id2:object_id
                 file_dos_uri2:object_id
                 file_path2:file_name
                 aligned_reads_indexes{
                     file_type1:data_format
                     upload_file_id1:object_id
                     file_dos_uri1:object_id
                     file_path1:file_name            
                 }
              }                                                      
          }
      }
  }
  }`;

/**
*   referenceIdList - a list of IDs for filtering
*/
const exportToSaturnByIDList = async (
  referenceIDList,
) => {
  const BDBAG_ENDPOINT = '/api/v0/submission/graphql/';
  const SATURN_ENDPOINT = 'https://bvdp-saturn-prod.appspot.com/#import-data';
  const MSG_EXPORT_SATURN_FAIL = 'Error while export data to Saturn';
  const bdbagParams = {
    format: 'bdbag',
    path: 'manifest_bag',
  };
  const body = {
    query: getBDBagQuery(referenceIDList),
    ...bdbagParams,
  };
  fetchWithCreds({
    path: BDBAG_ENDPOINT,
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then((r) => {
      if (!r || r.status !== 200) {
        throw MSG_EXPORT_SATURN_FAIL;
      }
      const url = encodeURIComponent(r.data);
      window.location = `${SATURN_ENDPOINT}?url=${url}`;
    });
};

export const exportAllDataInTableToCloud = async (
  apiFunc,
  projectId,
  arrangerConfig,
  filteredSqon,
) => {
  if (filteredSqon == null) {
    exportToSaturnByIDList();
  } else {
    const referenceID = 'submitter_id';
    const responseData = await queryDataBySQON(
      apiFunc,
      projectId,
      filteredSqon,
      arrangerConfig.graphqlField,
      [referenceID],
    );
    const idList = responseData.map(item => item[referenceID]);
    exportToSaturnByIDList(idList);
  }
};

export const exportAllSelectedDataToCloud = async (
  apiFunc,
  projectId,
  arrangerConfig,
  selectedTableRows,
) => {
  const referenceID = 'submitter_id';
  const responseData = (await queryDataByIds(
    apiFunc,
    projectId,
    selectedTableRows,
    arrangerConfig.graphqlField,
    [referenceID],
  ));
  const idList = responseData.map(item => item[referenceID]);
  exportToSaturnByIDList(idList);
};
