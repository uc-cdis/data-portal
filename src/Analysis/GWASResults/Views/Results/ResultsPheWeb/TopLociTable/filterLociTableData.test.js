import filterLociTableData from './filterLociTableData';
import TopLociTableData from '../../../../TestData/ResultsViewData/TopLociTableData';

describe('filterLociTableData', () => {
  const tableData = TopLociTableData;

  const lociTableState = {
    variantSearchTerm: '',
    nearestGenesSearchTerm: 'GeneA',
    afSearchTerm: '',
    pvalSearchTerm: '',
  };

  test('filters table data based on variant search term', () => {
    const filteredData = filterLociTableData(tableData, lociTableState);

    expect(filteredData).toEqual([
      {
        chrom: '1',
        pos: 1000,
        ref: 'A',
        alt: 'T',
        rsids: 'rs123',
        nearest_genes: 'GeneA',
        af: 0.1,
        pval: 0.05,
      },
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
