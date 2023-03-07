export const GetTableDataFromApi = () => {
  // this is a placeholder for the API call in ticket VADC 465
  return [
    {
      RunId: Math.random() * 1000,
      WorkflowName: 'some workflow name',
      DateTimeStarted: 'DateTimeStarted',
      JobStatus: 'some job status',
      DateTimeSubmitted: 'some date time submitted',
      ExecutionData: 'some ExecutionData for item 1',
      ResultsData: 'some resultsData for item 1',
    },
    {
      RunId: Math.random() * 1000,
      WorkflowName: 'some workflow name',
      DateTimeStarted: 'DateTimeStarted',
      JobStatus: 'some job status',
      DateTimeSubmitted: 'some date time submitted',
      ExecutionData: 'some ExecutionData for item 2',
      ResultsData: 'some resultsData for item 2',
    },
  ];
};
