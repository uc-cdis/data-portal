/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { cohortMiddlewarePath } from '../../../localconf';
import { headers } from '../../../configs';

const hareConceptId = 2000007027;

export const fetchSimpleOverlapInfo = async (
  sourceId,
  cohortAId,
  cohortBId,
  selectedCovariates,
  outcome,
) => {
  const variablesPayload = {
    variables: [outcome, ...selectedCovariates, // <- note: this order is important (outcome first, then covariates)
      // add extra filter to make sure we only count persons that have a HARE group as well:
      {
        variable_type: 'concept',
        concept_id: hareConceptId,
      }].filter(Boolean), // filter out any undefined or null items (e.g. in some
    // scenarios "outcome" and "selectedCovariates" are still null and/or empty)
  };
  const statsEndPoint = `${cohortMiddlewarePath}cohort-stats/check-overlap/by-source-id/${sourceId}/by-cohort-definition-ids/${cohortAId}/${cohortBId}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const response = await fetch(statsEndPoint, reqBody);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const fetchHistogramInfo = async (
  sourceId,
  cohortId,
  selectedCovariates,
  outcome,
  selectedConceptId,
  transformationType,
) => {
  const variablesPayload = {
    variables: [outcome, ...selectedCovariates, // <- note: this order is important (outcome first, then covariates)
      // add extra filter to make sure we only count persons that have a HARE group as well:
      {
        variable_type: 'concept',
        concept_id: hareConceptId,
      },
      {
        variable_type: 'concept',
        concept_id: selectedConceptId,
        transformation: transformationType,
      },
    ].filter(Boolean), // filter out any undefined or null items (e.g. in some
    // scenarios "outcome" and "selectedCovariates" are still null and/or empty)
  };
  const endPoint = `${cohortMiddlewarePath}histogram/by-source-id/${sourceId}/by-cohort-definition-id/${cohortId}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const response = await fetch(endPoint, reqBody);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const fetchConceptStatsByHareSubset = async (
  cohortDefinitionId,
  subsetCovariates,
  outcome,
  sourceId,
) => {
  const variablesPayload = {
    variables: [...(outcome !== null ? [outcome] : []), ...subsetCovariates],
  };
  const conceptStatsEndPoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${cohortDefinitionId}/breakdown-by-concept-id/${hareConceptId}`;
  const reqBody = {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(variablesPayload),
  };
  const response = await fetch(conceptStatsEndPoint, reqBody);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
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

export const fetchCohortDefinitions = async (sourceId, selectedTeamProject) => {
  const cohortEndPoint = `${cohortMiddlewarePath}cohortdefinition-stats/by-source-id/${sourceId}/by-team-project?team-project=${selectedTeamProject}`;
  const response = await fetch(cohortEndPoint);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
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
  const response = await fetch(conceptEndpoint, reqBody);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const fetchSources = async () => {
  const sourcesEndpoint = `${cohortMiddlewarePath}sources`;
  const response = await fetch(sourcesEndpoint);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const useSourceFetch = () => {
  const [loading, setLoading] = useState(true);
  const [sourceId, setSourceId] = useState(undefined);
  const getSources = () => { // fetch sources on initialization
    fetchSources().then((data) => {
      if (Array.isArray(data?.sources) && data.sources.length === 1) {
        setSourceId(data.sources[0].source_id);
        setLoading(false);
      } else {
        const message = `Data source recieved in an invalid format:
        ${JSON.stringify(data?.sources)}`;
        throw new Error(message);
      }
    });
  };
  useEffect(() => {
    getSources();
  }, []);
  return { loading, sourceId };
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
