


const filterBySearchTerm = (data, key, searchTerm) => data.filter((obj) => obj[key]
  .toString()
  .toLowerCase()
  .replace(/,/g, '')
  .includes(searchTerm.toLowerCase().replace(/,/g, '')),
);

const filterLociTableData = (tableData, lociTableState) => {
  let filteredDataResult = tableData;
  if (lociTableState.variantSearchTerm.length > 0) {
    filteredDataResult = filterBySearchTerm(
      filteredDataResult,
      'variant',
      lociTableState.variantSearchTerm,
    );
  }
  if (lociTableState.nearestGenesSearchTerm.length > 0) {
    filteredDataResult = filterBySearchTerm(
      filteredDataResult,
      'nearest_genes',
      lociTableState.nearestGenesSearchTerm,
    );
  }
  if (lociTableState.afSearchTerm.length > 0) {
    filteredDataResult = filterBySearchTerm(
      filteredDataResult,
      'af',
      lociTableState.afSearchTerm,
    );
  }
  if (lociTableState.pvalSearchTerm.length > 0) {
    filteredDataResult = filterBySearchTerm(
      filteredDataResult,
      'pval',
      lociTableState.pvalSearchTerm,
    );
  }
  return filteredDataResult;
};

export default filterLociTableData;
