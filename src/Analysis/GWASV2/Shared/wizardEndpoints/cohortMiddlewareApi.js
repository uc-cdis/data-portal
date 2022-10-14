/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { cohortMiddlewarePath, wtsPath } from '../../../../localconf';
import { fetchWithCreds } from '../../../../actions';
import { headers } from '../../../../configs';

const hareConceptId = 2000007027;

export const fetchConceptStatsByHare = async (
  cohortDefinitionId,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
) => {
  const variablesPayload = {
    variables: [
      ...selectedDichotomousCovariates.map(({ uuid, ...withNoId }) => withNoId),
      ...selectedCovariates.map((c) => ({
        variable_type: 'concept',
        concept_id: c.concept_id,
      })),
    ],
  };
  const conceptStatsEndPoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${cohortDefinitionId}/breakdown-by-concept-id/${hareConceptId}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const getConceptStats = await fetch(conceptStatsEndPoint, reqBody);
  return getConceptStats.json();
};

export const fetchOverlapInfo = async (
  sourceId,
  caseCohortDefinitionId,
  controlCohortDefinitionId,
  selectedHare,
  selectedCovariates,
  selectedDichotomousCovariates,
) => {
  const variablesPayload = {
    variables: [
      ...selectedDichotomousCovariates.map(({ uuid, ...withNoId }) => withNoId),
      ...selectedCovariates.map((c) => ({
        variable_type: 'concept',
        concept_id: c.concept_id,
      })),
    ],
  };
  const statsEndPoint = `${cohortMiddlewarePath}cohort-stats/check-overlap/by-source-id/${sourceId}/by-case-control-cohort-definition-ids/${caseCohortDefinitionId}/${controlCohortDefinitionId}/filter-by-concept-id-and-value/${hareConceptId}/${selectedHare.concept_value_as_concept_id}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const getOverlapStats = await fetch(statsEndPoint, reqBody);
  return getOverlapStats.json();
};

export const filterSubsetCovariates = (subsetCovariates) => {
  const filteredSubsets = [];
  subsetCovariates.forEach((covariate) => {
    if (covariate.variable_type === 'custom_dichotomous') {
      filteredSubsets.push({
        cohort_ids: covariate.cohort_ids,
        provided_name: covariate.provided_name,
        variable_type: covariate.variable_type,
      });
    } else {
      filteredSubsets.push({
        variable_type: 'concept',
        concept_id: covariate.concept_id,
      });
    }
  });
  return filteredSubsets;
};

export const fetchConceptStatsByHareSubset = async (
  cohortDefinitionId,
  subsetCovariates,
  sourceId,
) => {
  const variablesPayload = {
    variables: [...filterSubsetCovariates(subsetCovariates)],
  };
  const conceptStatsEndPoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${cohortDefinitionId}/breakdown-by-concept-id/${hareConceptId}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const getConceptStats = await fetch(conceptStatsEndPoint, reqBody);
  return getConceptStats.json();
};

export const addCDFilter = (cohortId, otherCohortId, covariateArr) => {
  // adding an extra filter on top of the given covariateArr
  // to ensure that any person that belongs to _both_ cohorts
  // [cohortId, otherCohortId] also gets filtered out:
  const covariateRequest = [...covariateArr];
  const cdFilter = {
    variable_type: 'custom_dichotomous',
    cohort_ids: [cohortId, otherCohortId],
    provided_name:
      'auto_generated_extra_item_to_filter_out_case_control_overlap',
  };
  covariateRequest.push(cdFilter);
  return covariateRequest;
};

export const fetchConceptStatsByHareSubsetCC = async (
  cohortDefinitionId,
  otherCohortDefinitionId,
  covariateSubset,
  sourceId,
) => fetchConceptStatsByHareSubset(
  cohortDefinitionId,
  addCDFilter(cohortDefinitionId, otherCohortDefinitionId, covariateSubset),
  sourceId,
);

export const fetchConceptStatsByHareForCaseControl = async (
  queriedCohortDefinitionId,
  otherCohortDefinitionId,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
) => fetchConceptStatsByHareSubset(
  queriedCohortDefinitionId,
  addCDFilter(queriedCohortDefinitionId, otherCohortDefinitionId, [
    ...selectedCovariates,
    ...selectedDichotomousCovariates,
  ]),
  sourceId,
);

export const fetchCovariateStats = async (
  cohortDefinitionId,
  selectedCovariateIds,
  sourceId,
) => {
  const covariateIds = { ConceptIds: selectedCovariateIds };
  const conceptStatsEndpoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${cohortDefinitionId}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(covariateIds),
  };
  const getConceptStats = await fetch(conceptStatsEndpoint, reqBody);
  return getConceptStats.json();
};

export const fetchCohortDefinitions = async (sourceId) => {
  const cohortEndPoint = `${cohortMiddlewarePath}cohortdefinition-stats/by-source-id/${sourceId}`;
  const getCohortDefinitions = await fetch(cohortEndPoint);
  return getCohortDefinitions.json();
};

export const fetchCovariates = async (sourceId) => {
  const allowedConceptTypes = {
    ConceptTypes: ['MVP Continuous'],
  };
  const conceptEndpoint = `${cohortMiddlewarePath}concept/by-source-id/${sourceId}/by-type`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(allowedConceptTypes),
  };
  const getConcepts = await fetch(conceptEndpoint, reqBody);
  return getConcepts.json();
};

export const fetchSources = async () => {
  const sourcesEndpoint = `${cohortMiddlewarePath}sources`;
  const getSources = await fetch(sourcesEndpoint);
  return getSources.json();
};

export const useSourceFetch = () => {
  const [loading, setLoading] = useState(true);
  const [sourceId, setSourceId] = useState(undefined);
  const getSources = () => {
    // do wts login and fetch sources on initialization
    fetchWithCreds({
      path: `${wtsPath}connected`,
      method: 'GET',
    }).then((res) => {
      if (res.status !== 200) {
        window.location.href = `${wtsPath}authorization_url?redirect=${window.location.pathname}`;
      } else {
        fetchSources().then((data) => {
          setSourceId(data.sources[0].source_id);
          setLoading(false);
        });
      }
    });
  };
  useEffect(() => {
    getSources();
  }, []);
  return { loading, sourceId };
};

export const queryConfig = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export const getAllHareItems = (
  concept_value,
  allCaseHares,
  allControlHares,
) => {
  const caseHareBreakdown = allCaseHares.find(
    (hare) => hare.concept_value === concept_value,
  );
  const controlHareBreakdown = allControlHares.find(
    (hare) => hare.concept_value === concept_value,
  );
  return [caseHareBreakdown, controlHareBreakdown];
};

export const atlasDomain = () => cohortMiddlewarePath.replace('cohort-middleware', 'analysis/OHDSI%20Atlas');
