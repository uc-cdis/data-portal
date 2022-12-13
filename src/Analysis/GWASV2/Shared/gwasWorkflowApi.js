import { gwasTemplate, gwasWorkflowPath } from '../../../localconf';
import { headers } from '../../../configs';

export const jobSubmission = async (
  sourceId,
  numOfPCs,
  selectedCovariates,
  outcome,
  selectedHare,
  mafThreshold,
  imputationScore,
  selectedCohort,
  jobName,
) => {
  const submitEndpoint = `${gwasWorkflowPath}submit`;
  const requestBody = {
    n_pcs: numOfPCs,
    variables: [...selectedCovariates, outcome],
    out_prefix: Date.now().toString(),
    outcome: outcome,
    hare_population: selectedHare.concept_value_name,
    hare_concept_id: 2000007027,
    maf_threshold: Number(mafThreshold),
    imputation_score_cutoff: Number(imputationScore),
    template_version: gwasTemplate,
    source_id: sourceId,
    study_population_cohort: selectedCohort,
    workflow_name: jobName,
  };
  const res = await fetch(submitEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(requestBody),
  });
  return res;
};
