import { gwasWorkflowPath } from '../../../localconf';
import { headers } from '../../../configs';

export const useGwasSubmit = async (
  sourceId,
  numOfPC,
  covariates,
  selectedOutcome,
  selectedHare,
  hareConceptId,
  mafThreshold,
  imputationScore,
  cohortDefinitionId,
  gwasJobName,
) => {
  const submitEndpoint = `${gwasWorkflowPath}submit`;
  const requestBody = {
    n_pcs: numOfPC,
    covariates,
    out_prefix: Date.now().toString(),
    outcome: selectedOutcome,
    hare_population: selectedHare,
    hare_concept_id: hareConceptId,
    maf_threshold: Number(mafThreshold),
    imputation_score_cutoff: Number(imputationScore),
    template_version: 'gwas-template-latest',
    source_id: sourceId,
    case_cohort_definition_id: cohortDefinitionId,
    control_cohort_definition_id: '-1',
    workflow_name: gwasJobName,
  };
  const res = await fetch(submitEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(requestBody),
  });
  return res;
};
