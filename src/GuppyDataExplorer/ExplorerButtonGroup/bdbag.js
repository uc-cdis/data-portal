/**
* This demo feature is depending on Peregrine's bdbag branch.
* We do following steps:
* 1. Hit Peregrine's bdbag endpoint using a set of submitter IDs
* 2. Get reponse url (which relates to an s3 bucket resource) from Peregrine
* 3. HIt Saturn's "import data" endpoint using this url as argument
*/

import { fetchWithCreds } from '../../actions';

export const getBDBagQuery = referenceIDList => `{
  participants:
    case(first:0${referenceIDList !== undefined ? `,submitter_id: ["${referenceIDList.join('","')}"]` : ''})
    {
       _participant_id:id
    }
    samples:sample(first:0
    ${referenceIDList !== undefined ? `, with_path_to_any:[
    ${referenceIDList.map(item => (`{type: "case", submitter_id: "${item}"}`))}
    ]` : ''}
    ) {
      composition
      submitter_specimen_type:biospecimen_anatomic_site
      cases {
          participant:id
          donor_id:id
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
                 simple_germline_variations{
                     file_type3:data_format
                     upload_file_id3:object_id
                     file_dos_uri3:object_id
                     file_path3:file_name
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

export const exportAllSelectedDataToCloud = async (
  downloadFieldsFunc,
) => {
  const referenceID = 'submitter_id';
  const idList = await downloadFieldsFunc({ fields: [referenceID] })
    .then(res => res.map(i => i[referenceID]));
  exportToSaturnByIDList(idList);
};
