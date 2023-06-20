import filterLociTableData from './filterLociTableData';

describe('filterLociTableData', () => {
  const tableData = [
    { variant: 'A', nearest_genes: 'GeneA', af: 0.1, pval: 0.05 },
    { variant: 'B', nearest_genes: 'GeneB', af: 0.2, pval: 0.01 },
    { variant: 'C', nearest_genes: 'GeneC', af: 0.3, pval: 0.02 },
  ];

  const lociTableState = {
    variantSearchTerm: 'A',
    nearestGenesSearchTerm: '',
    afSearchTerm: '',
    pvalSearchTerm: '',
  };

  test('filters table data based on variant search term', () => {
    const filteredData = filterLociTableData(tableData, lociTableState);

    expect(filteredData).toEqual([
      { variant: 'A', nearest_genes: 'GeneA', af: 0.1, pval: 0.05 },
    ]);
  });

  test('returns original table data when no search terms provided', () => {
    const emptySearchTerms = {
      variantSearchTerm: '',
      nearestGenesSearchTerm: '',
      afSearchTerm: '',
      pvalSearchTerm: '',
    };

    const filteredData = filterLociTableData(tableData, emptySearchTerms);

    expect(filteredData).toEqual(tableData);
  });
});
