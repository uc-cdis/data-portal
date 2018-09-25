import { fetchWithCreds } from '../../actions';
import { constructGraphQLQuery, hasKeyChain, MSG_FAILED_DOWNLOAD } from '../utils.js';

export const getBDBagQuery = referenceIDList => `{
            participants: 
              case(first:0, submitter_id: ["${referenceIDList.join('","')}"])
              {
                 _participant_id:submitter_id
              }
              samples:sample(first:0, with_path_to_any:[
              ${referenceIDList.map(item => (`{type: "case", submitter_id: "${item}"}`))}
              ]) {
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

export const exportToCloud = async (
  apiFunc,
  projectId,
  selectedTableRows,
  arrangerConfig,
) => {
  if (!hasKeyChain(arrangerConfig, 'table.referenceId')) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const referenceID = arrangerConfig.table.referenceId;
  const getIDQueryString = constructGraphQLQuery(
    selectedTableRows,
    arrangerConfig.graphqlField,
    '_id', // Arranger always uses this for table index
    [referenceID],
    false,
    selectedTableRows.length,
  );
  const responseData = await apiFunc({
    endpoint: `/${projectId}/graphql`,
    body: getIDQueryString,
  });
  if (!responseData) {
    throw MSG_FAILED_DOWNLOAD;
  }
  if (!hasKeyChain(responseData, `data.${arrangerConfig.graphqlField}.hits.edges`)) {
    throw MSG_FAILED_DOWNLOAD;
  }
  const referenceIDList = responseData.data[arrangerConfig.graphqlField]
    .hits.edges.map(item => item.node[referenceID]);
  const body = {
    format: 'bdbag',
    path: 'manifest_bag',
    query: getBDBagQuery(referenceIDList),
  };
  fetchWithCreds({
    path: '/api/v0/submission/graphql/',
    method: 'POST',
    body: JSON.stringify(body),
  }).then((r) => {
    const url = encodeURIComponent(r.data);
    document.location.replace(`https://bvdp-saturn-prod.appspot.com/#import-data?url=${url}`);
  });
};
