/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { cohortMiddlewarePath, wtsPath } from '../../../localconf';
import { fetchWithCreds } from '../../../actions';
import { headers } from '../../../configs';

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

// Basically a copy of fetchOverlapInfo above, but without the HARE arguments:
export const fetchSimpleOverlapInfo = async (
  sourceId,
  cohortAId,
  cohortBId,
  selectedCovariates,
  outcome,
) => {
  const variablesPayload = {
    variables: [...selectedCovariates, outcome],
  };
  const statsEndPoint = `${cohortMiddlewarePath}cohort-stats/check-overlap/by-source-id/${sourceId}/by-cohort-definition-ids/${cohortAId}/${cohortBId}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const getOverlapStats = await fetch(statsEndPoint, reqBody);
  return getOverlapStats.json();
};

export const fetchHistogramInfo = async (
  sourceId,
  cohortId,
  selectedCovariates,
  outcome,
  currentSelection
) => {
  const variablesPayload = {
    variables: [...selectedCovariates, outcome],
  };
  // TODO - validate that currentSelection has concept_id
  const endPoint = `${cohortMiddlewarePath}histogram/by-source-id/${sourceId}/by-cohort-definition-id/${cohortId}/by-histogram-concept-id/${currentSelection.concept_id}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const requestResponse = await fetch(endPoint, reqBody);
  return requestResponse.json();
};

export const fetchConceptStatsByHareSubset = async (
  cohortDefinitionId,
  subsetCovariates,
  outcome,
  sourceId,
) => {
  const variablesPayload = {
    variables: [outcome, ...subsetCovariates],
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
