import filterTableData from './filterTableData';

describe('filterTableData', () => {
  const testData = [
    {
      name: 'name-test-1',
      wf_name: 'Workflow 1',
      submittedAt: '2023-01-15T12:00:00Z',
      finishedAt: '2023-01-20T12:00:00Z',
      phase: 'completed',
    },
    {
      name: 'name-test-2',
      wf_name: 'Workflow 2',
      submittedAt: '2023-02-15T12:00:00Z',
      finishedAt: '2023-02-20T12:00:00Z',
      phase: 'in_progress',
    },
  ];
  const homeTableStateDefault = {
    "nameSearchTerm": "",
    "wfNameSearchTerm": "",
    "submittedAtSelections": [],
    "finishedAtSelections": [],
    "jobStatusSelections": [],
};



  it('should filter data by name search term', () => {
    //const homeTableState = homeTableStateDefault;
    //homeTableState.nameSearchTerm = "name-test";
    const filteredData = filterTableData(testData, {...homeTableStateDefault,...{
      "nameSearchTerm": "name-test-1"}
  });
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].name).toBe('name-test-1');
  });
  /*

  it('should filter data by workflow name search term', () => {
    const homeTableState = homeTableStateDefault;
    homeTableState.wfNameSearchTerm = "workflow-name-test";
    const filteredData = filterTableData(testData, homeTableState);
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].wf_name).toBe('Workflow 2');
  });

  it('should filter data by submitted date range', () => {
    const homeTableState = homeTableStateDefault;
    homeTableState.submittedAtSelections = [new Date('2023-01-01'), new Date('2023-02-01')];
    const filteredData = filterTableData(testData, homeTableState);
    expect(filteredData).toHaveLength(2);
  });

  it('should filter data by job statuses', () => {
    const homeTableState = homeTableStateDefault;
    homeTableState.jobStatusSelections = ['in_progress'];
    const filteredData = filterTableData(testData, homeTableState);
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].phase).toBe('in_progress');
  });

  it('should filter data by finished date range', () => {
    const homeTableState = homeTableStateDefault;
    homeTableState.finishedAtSelections= [new Date('2023-01-15'), new Date('2023-01-22')];
    const filteredData = filterTableData(testData, homeTableState);
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].name).toBe('John');
  });*/
});
