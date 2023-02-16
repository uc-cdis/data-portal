/** @param {import('./types').ConsortiumCountsData[]} data */
export function parseCounts(data) {
  /** @type {import('./types').IndexState['overviewCounts']} */
  const overviewCounts = { names: [], data: {} };
  /** @type {import('./types').IndexState['projectList']} */
  const projectList = [];

  for (const {
    consortium,
    molecular_analysis: molecularAnalysis,
    study,
    subject,
  } of data) {
    if (subject > 0) {
      overviewCounts.data[consortium] = {
        molecular_analysis: molecularAnalysis,
        study,
        subject,
      };
      if (consortium !== 'total') {
        overviewCounts.names.push(consortium);

        projectList.push({
          code: consortium,
          counts: [subject, molecularAnalysis],
        });
      }
    }
  }

  return {
    countNames: ['Subjects', 'Subjects with molecular analyses'],
    overviewCounts,
    projectList,
  };
}
