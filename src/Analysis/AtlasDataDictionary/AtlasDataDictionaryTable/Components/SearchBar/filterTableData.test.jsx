import filterTableData from './filterTableData';

describe('filterTableData function', () => {
  const mockData = [
    {
      vocabularyID: 'row1',
      standardDeviation: 1,
      valueSummary: [
        {
          name: 'valueSummaryNameGSZiOl3yUW',
          valueAsString: '4WliGmUOGr',
          valueAsConceptID: 2,
          personCount: 3,
        },
      ],
    },
    {
      vocabularyID: 'row2',
      standardDeviation: 1,
      valueSummary: [
        { start: 4, end: 5, personCount: 6 },
        { start: 7, end: 8, personCount: 9 },
      ],
    },
  ];
  const mockSetDisplayedData = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('filters data based on search term', () => {
    const searchTerm = 'row2';
    const expectedFilteredData = [mockData[1]];
    filterTableData(mockData, searchTerm, mockSetDisplayedData);
    expect(mockSetDisplayedData).toHaveBeenCalledWith(expectedFilteredData);
  });

  it('filters data in case-insensitive manner', () => {
    // Search term casing differs from actual value
    const searchTerm = 'ROW1';
    const expectedFilteredData = [mockData[0]];
    filterTableData(mockData, searchTerm, mockSetDisplayedData);
    expect(mockSetDisplayedData).toHaveBeenCalledWith(expectedFilteredData);
  });

  it('filters data from nested arrays with one search result', () => {
    // searchTerm here is unique to first object
    const searchTerm = mockData[0].valueSummary[0].personCount;
    const expectedFilteredData = [mockData[0]];
    filterTableData(mockData, searchTerm, mockSetDisplayedData);
    expect(mockSetDisplayedData).toHaveBeenCalledWith(expectedFilteredData);
  });
  it('filters data from nested arrays with two search results', () => {
    // searchTerm here exists in both objects
    const searchTerm = mockData[0].standardDeviation;
    const expectedFilteredData = [mockData[0], mockData[1]];
    filterTableData(mockData, searchTerm, mockSetDisplayedData);
    expect(mockSetDisplayedData).toHaveBeenCalledWith(expectedFilteredData);
  });
  it('does not filter anything if search term is empty', () => {
    const searchTerm = '';
    const expectedFilteredData = mockData;
    filterTableData(mockData, searchTerm, mockSetDisplayedData);
    expect(mockSetDisplayedData).toHaveBeenCalledWith(expectedFilteredData);
  });
});
