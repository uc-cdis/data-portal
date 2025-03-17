import ProcessData from './ProcessData';

describe('ProcessData function', () => {
  it('filters and processes data correctly', () => {
    const sourceFieldData = [
      [
        { title: 'Title1', description: 'Description1' },
        { file_name: 'File1', description: 'Description2' },
        { other: 'Other1' },
        { title: 'Title2', description: 'Description3' },
      ],
    ];

    const result = ProcessData(sourceFieldData);

    expect(result.processedDataForDataDownloadList).toEqual([
      { title: 'Title1', description: 'Description1' },
      { title: 'File1', description: 'Description2' },
      { title: 'Title2', description: 'Description3' },
    ]);
    expect(result.dataForDataDownloadListHasBeenTruncated).toEqual(false);
  });

  it('logs items without title or file_name to console', () => {
    // Mock console.log to capture logs
    const consoleLogSpy = jest.spyOn(console, 'debug').mockImplementation();

    const sourceFieldData = [
      [
        { title: 'Title1', description: 'Description1' },
        { other: 'Other1' },
        { description: 'Description2' },
      ],
    ];

    ProcessData(sourceFieldData);

    // Check if console.log was called with the correct messages
    expect(consoleLogSpy).toHaveBeenCalledWith('Item without title or file_name:', { other: 'Other1' });
    expect(consoleLogSpy).toHaveBeenCalledWith('Item without title or file_name:', { description: 'Description2' });
  });

  it('filters and processes large data (more than 200 entries)', () => {
    const sourceFieldData = [Array.from({ length: 210 }, (_, i) => ({ title: `Title${i}`, description: `Description${i}` }))];

    const result = ProcessData(sourceFieldData);

    expect(result.processedDataForDataDownloadList.length).toEqual(200);
    expect(result.dataForDataDownloadListHasBeenTruncated).toEqual(true);
  });
});
