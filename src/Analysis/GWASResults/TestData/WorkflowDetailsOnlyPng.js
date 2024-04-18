const WorkflowStatusResponse = {
  name: 'gwas-workflow-123',
  wf_name: 'test job',
  arguments: {
    parameters: [
      {
        name: 'n_pcs',
        value: '3',
      },
      {
        name: 'imputation_score_cutoff',
        value: '0.3',
      },
      {
        name: 'etc',
        value: '2',
      },
    ],
  },
  phase: 'Succeeded',
  progress: '9/9',
  submittedAt: '2023-03-29T13:01:09Z',
  startedAt: '2023-03-29T13:01:29Z',
  finishedAt: '2023-03-29T13:11:09Z',
  outputs: {
    parameters: [
      {
        name: 'gwas_archive_index',
        value: '{\n    "baseid": "aaa-bbb-ccc-ddd123-eee1234",\n    "did": "111-222-333-444-abcd123",\n    "rev": "r123456"\n}',
      },
      {
        name: 'manhattan_plot_index',
        value: '{\n    "baseid": "xxx-yyy-zzz-1234-dddddd5678",\n    "did": "999-8888-7777-aaaa123456-777777",\n    "rev": "r78910"\n}',
      },
    ],
  },
};

export default WorkflowStatusResponse;
