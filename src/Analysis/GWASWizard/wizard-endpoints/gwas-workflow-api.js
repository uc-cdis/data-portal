import { gwasTemplate, gwasWorkflowPath } from '../../../localconf';
import { headers } from '../../../configs';

// export const hareConceptId = 2000007027;

export const useGwasSubmitCC = async (
  sourceId,
  numOfPC,
  selectedCovariates,
  selectedDichotomousCovariates,
  selectedHare,
  mafThreshold,
  imputationScore,
  selectedCaseCohort,
  selectedControlCohort,
  gwasName,
) => {
  const submitEndpoint = `${gwasWorkflowPath}submit`;
  const requestBody = {
    n_pcs: numOfPC,
    covariates: [...selectedCovariates, ...selectedDichotomousCovariates],
    out_prefix: Date.now().toString(),
    outcome: '-1',
    hare_population: selectedHare,
    hare_concept_id: 2000007027,
    maf_threshold: Number(mafThreshold),
    imputation_score_cutoff: Number(imputationScore),
    template_version: gwasTemplate,
    source_id: sourceId,
    case_cohort_definition_id: selectedCaseCohort.cohort_definition_id,
    control_cohort_definition_id: selectedControlCohort.cohort_definition_id,
    workflow_name: gwasName,
  };
  const res = await fetch(submitEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(requestBody),
  });
  return res;
};

// export const useGwasSubmitQ = async (
//   sourceId,
//   numOfPC,
//   covariates,
//   selectedOutcome,
//   selectedHare,
//   mafThreshold,
//   imputationScore,
//   cohortDefinitionId,
//   gwasJobName,
// ) => {
//   // () => useGwasSubmit(
//   //   sourceId,
//   //   numOfPC,
//   //   selectedCovariates,
//   //   // selectedOutcome, -1 for CC
//   //   selectedHare,
//   //   mafThreshold,
//   //   imputationScore,
//   //   caseCohortDefinitionId,
//   //   // controlCohortDefinitionId, -1 for Q
//   //   )

//   const submitEndpoint = `${gwasWorkflowPath}submit`;
//   const requestBody = {
//     n_pcs: numOfPC,
//     covariates,
//     out_prefix: Date.now().toString(),
//     outcome: selectedOutcome,
//     hare_population: selectedHare,
//     hare_concept_id: 2000007027,
//     maf_threshold: Number(mafThreshold),
//     imputation_score_cutoff: Number(imputationScore),
//     template_version: 'gwas-template-latest',
//     source_id: sourceId,
//     case_cohort_definition_id: cohortDefinitionId,
//     control_cohort_definition_id: '-1',
//     workflow_name: gwasJobName,
//   };
//   const res = await fetch(submitEndpoint, {
//     method: 'POST',
//     credentials: 'include',
//     headers,
//     body: JSON.stringify(requestBody),
//   });
//   return res;
// };
