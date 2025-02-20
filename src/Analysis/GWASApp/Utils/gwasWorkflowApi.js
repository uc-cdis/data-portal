import { gwasTemplate, gwasWorkflowPath } from '../../../localconf';
import { headers } from '../../../configs';
/* eslint-disable import/prefer-default-export */
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
  selectedTeamProject,
) => {
  const submitEndpoint = `${gwasWorkflowPath}submit`;
  const requestBody = {
    n_pcs: numOfPCs,
    variables: [outcome, ...selectedCovariates], // <- note: this order is important (outcome first, then covariates)
    out_prefix: Date.now().toString(),
    outcome,
    hare_population: selectedHare.concept_value_name,
    hare_population_concept_id: selectedHare.concept_value_as_concept_id,
    hare_concept_id: 2000007027,
    maf_threshold: Number(mafThreshold),
    imputation_score_cutoff: Number(imputationScore),
    template_version: gwasTemplate,
    source_id: sourceId,
    source_population_cohort: selectedCohort.cohort_definition_id,
    workflow_name: jobName,
    team_project: selectedTeamProject,
  };
  const res = await fetch(submitEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(requestBody),
  });
  return res;
};
