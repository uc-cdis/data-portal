/** @typedef {import('./types').SubmissionState} SubmissionState */

export function parseCounts(counts) {
  const countsSearch = /** @type {SubmissionState['counts_search']} */ ({});
  const linksSearch = /** @type {SubmissionState['links_search']} */ ({});

  for (const [k, v] of Object.entries(counts)) {
    if (k.endsWith('_count')) countsSearch[k] = v;
    linksSearch[k] = v.length;
  }

  return { countsSearch, linksSearch };
}

/**
 * @param {SubmissionState} state
 * @param {{ data: any; status: number }} response
 */
export function parseSubmitResponse(state, response) {
  const entityCounts = state.submit_entity_counts ?? {};
  if (response.data.entities?.length > 0)
    for (const { type } of response.data.entities) {
      const key = type ?? 'unknown';
      if (!(key in entityCounts)) entityCounts[key] = 0;
      entityCounts[key] += 1;
    }

  const result = state.submit_result
    ? state.submit_result.concat(response.data.entities || [])
    : response.data.entities;

  const status = state.submit_status
    ? Math.max(state.submit_status, response.status)
    : response.status;

  return {
    entityCounts,
    result,
    resultString: `${JSON.stringify(response.data, null, 4)}\n\n`,
    status,
  };
}
