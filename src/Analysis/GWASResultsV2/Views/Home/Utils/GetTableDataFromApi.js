const sixDigitRandomNumber = () => Math.floor(100000 + Math.random() * 900000);

// this is a placeholder for the API call in ticket VADC 465
const GetTableDataFromApi = () => {
  return [
    {
      RunId: sixDigitRandomNumber(),
      WorkflowName: 'some workflow name',
      DateTimeStarted: 'DateTimeStarted',
      JobStatus: 'some job status',
      DateTimeSubmitted: 'some date time submitted',
      ExecutionData: 'some ExecutionData for item 1',
      ResultsData: 'some resultsData for item 1',
    },
    {
      RunId: sixDigitRandomNumber(),
      WorkflowName: 'some workflow name',
      DateTimeStarted: 'DateTimeStarted',
      JobStatus: 'some job status',
      DateTimeSubmitted: 'some date time submitted',
      ExecutionData: 'some ExecutionData for item 2',
      ResultsData: 'some resultsData for item 2',
    },
  ];
};

export default GetTableDataFromApi;
