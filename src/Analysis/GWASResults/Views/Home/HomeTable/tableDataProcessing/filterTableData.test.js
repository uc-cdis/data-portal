import filterTableData from './filterTableData';
import InitialHomeTableState from '../../HomeTableState/InitialHomeTableState';
import PHASES from '../../../../Utils/PhasesEnumeration';

describe('filterTableData', () => {
  const testData = [
    {
      name: 'name-test-1',
      wf_name: 'workflow-name-test-1',
      submittedAt: '2023-01-15T12:00:00Z',
      finishedAt: '2023-01-20T12:00:00Z',
      phase: PHASES.Succeeded,
    },
    {
      name: 'name-test-2',
      wf_name: 'workflow-name-test-2',
      submittedAt: '2023-02-15T12:00:00Z',
      finishedAt: '2023-02-20T12:00:00Z',
      phase: PHASES.Failed,
    },
  ];

  it('should filter data by name search term', () => {
    const filteredData = filterTableData(testData,
      { ...InitialHomeTableState, ...{ nameSearchTerm: 'name-test-1' } },
    );
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].name).toBe('name-test-1');
  });

  it('should filter data by workflow name search term', () => {
    const filteredData = filterTableData(testData,
      { ...InitialHomeTableState, ...{ wfNameSearchTerm: 'workflow-name-test-2' } },
    );
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].wf_name).toBe('workflow-name-test-2');
  });

  it('should filter data by submitted date range', () => {
    const filteredData = filterTableData(testData,
      { ...InitialHomeTableState, ...{ submittedAtSelections: [new Date('2023-01-01'), new Date('2023-03-01')] } },
    );
    expect(filteredData).toHaveLength(2);
    expect(filteredData[0].submittedAt).toBe(testData[0].submittedAt);
    expect(filteredData[1].submittedAt).toBe(testData[1].submittedAt);
  });

  it('should filter data by job statuses', () => {
    const filteredData = filterTableData(testData,
      { ...InitialHomeTableState, ...{ jobStatusSelections: [PHASES.Succeeded] } },
    );
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].phase).toBe(PHASES.Succeeded);
  });

  it('should filter data by finished date range', () => {
    const filteredData = filterTableData(testData,
      { ...InitialHomeTableState, ...{ finishedAtSelections: [new Date('2023-01-15'), new Date('2023-01-22')] } },
    );
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].finishedAt).toBe('2023-01-20T12:00:00Z');
  });
});
