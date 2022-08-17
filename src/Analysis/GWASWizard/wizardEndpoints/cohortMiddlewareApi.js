import { useState, useEffect } from 'react';
import { cohortMiddlewarePath, wtsPath } from '../../../localconf';
import { fetchWithCreds } from '../../../actions';
import { headers } from '../../../configs';
import { hareConceptId } from '../shared/constants';

export const fetchConceptStatsByHare = async (cohortDefinitionId, selectedCovariates, selectedDichotomousCovariates, sourceId) => {
  const variablesPayload = {
    variables:
      [
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

export const fetchCovariateStats = async (cohortDefinitionId, selectedCovariateIds, sourceId) => {
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
  const getSources = () => { // do wts login and fetch sources on initialization
    fetchWithCreds({
      path: `${wtsPath}connected`,
      method: 'GET',
    })
      .then(
        (res) => {
          if (res.status !== 200) {
            window.location.href = `${wtsPath}authorization_url?redirect=${window.location.pathname}`;
          } else {
            fetchSources().then((data) => {
              setSourceId(data.sources[0].source_id);
              setLoading(false);
            });
          }
        },
      );
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

export const atlasDomain = () => cohortMiddlewarePath.replace('cohort-middleware', 'analysis/OHDSI%20Atlas');
