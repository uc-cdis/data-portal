import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import GWASWorkflowList from './GWASWorkflowList';
import { gwasStatus } from '../GWASWizard/shared/constants';

export default {
  title: 'Tests2/GWASUI/WorkflowList',
  component: GWASWorkflowList,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const MockTemplate = () => {

  return (
    <QueryClientProvider client={mockedQueryClient}>
      <GWASWorkflowList refetchInterval={1000} />
    </QueryClientProvider>
  );
};

let requestCount = 0;
let rowCount = 1;
const getMockPhase = (requestCount) => {
  if (requestCount % 2 == 0) {
    return gwasStatus.running;
  } else if (requestCount % 5 == 0) {
    return gwasStatus.failed;
  } else {
    return gwasStatus.succeeded;
  }
}

let workflowList = [];

const getMockWorkflowList = () => {
  requestCount++;
  // simulate a new workflow only at each 3rd request:
  if (requestCount % 3 == 0) {
    workflowList.splice(0, 0, {"name" : "argo-wrapper-workflow-" + requestCount, "phase": getMockPhase(requestCount)});
    rowCount++;
  }
  // simulate status change of some recent items at each 10th request:
  if (rowCount % 5 == 0) {
    // just some status that is not used in getMockPhase:
    workflowList[2].phase = gwasStatus.pending;
    workflowList[3].phase = gwasStatus.pending;
  }
  return workflowList;
}

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.parameters = {
  msw: {
    handlers: [
      rest.get('http://:argowrapperpath/ga4gh/wes/v2/workflows', (req, res, ctx) => {
        const { argowrapperpath } = req.params;
        console.log(argowrapperpath);
        return res(
          ctx.delay(200),
          ctx.json(getMockWorkflowList()),
        );
      }),
      rest.get('http://:argowrapperpath/ga4gh/wes/v2/status/:workflowid', (req, res, ctx) => {
        const { argowrapperpath } = req.params;
        const { workflowid } = req.params;
        console.log(argowrapperpath);
        console.log(workflowid);

        return res(
          ctx.delay(500),
          ctx.json({"name": workflowid,
                    "wf_name": workflowid + " name",
                    "arguments":{"parameters":[
                      {"name":"source_id","value":"2"},
                      {"name":"case_cohort_definition_id","value":"300"},
                      {"name":"control_cohort_definition_id","default":"-1","value":"-1"},
                      {"name":"n_pcs","value":"3"},
                      {"name":"covariates","value":"ID_2000006885 ID_2000000708"},
                      {"name":"outcome","value":"ID_2000006886"},
                      {"name":"out_prefix","default":"genesis_vadc","value":"123456789"},
                      {"name":"maf_threshold","value":"0.01"},{"name":"imputation_score_cutoff","value":"0.3"},
                      {"name":"hare_population","value":"Hispanic"},
                      {"name":"prefixed_hare_concept_id","default":"ID_2000007027","value":"ID_2000007027"},
                      {"name":"internal_api_env","default":"default","value":"qa-mickey"},
                      {"name":"genome_build","default":"hg19","value":"hg19","enum":["hg38","hg19"]},
                      {"name":"pca_file","value":"/commons-data/pcs.RData"},
                      {"name":"relatedness_matrix_file","value":"/commons-data/abc.RData"},
                      {"name":"n_segments","value":"0"},
                      {"name":"segment_length","default":"2000","value":"2000"},
                      {"name":"variant_block_size","default":"1024","value":"100"},
                      {"name":"mac_threshold","value":"0"},
                      {"name":"gds_files","value":"[\"/commons-data/gds/chr1.merged.vcf.gz.gds\", \"/commons-data/gds/chr2.merged.vcf.gz.gds\"]"}]},
                      "phase": getMockPhase(requestCount),
                      "progress":"6/6",
                      "startedAt":"2022-07-01T17:29:29Z",
                      "finishedAt":"2022-07-01T17:33:13Z",
                      "outputs":{"parameters":[{"name":"gwas_archive_index",
                                    "value":
                                    "{\n    \"baseid\": \"123456-789-1023-1234-d123545e\",\n    \"did\": \"123456-654-123-123-f654987123\",\n    \"rev\": \"123456c789\"\n}"}
                                   ]
                      }
                }),
        );
      }),
    ],
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.parameters = {
  msw: {
    handlers: [
      rest.post('', (req, res, ctx) => res(
        ctx.delay(800),
        ctx.status(403),
      )),
    ],
  },
};
