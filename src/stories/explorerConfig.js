const config = {
  nodeCountTitle: 'Subjects', // label name for total counts
  charts: {
    project: {
      chartType: 'count',
      title: 'Projects',
    },
    study: {
      chartType: 'count',
      title: 'Studies',
    },
    file_type: {
      chartType: 'count',
      title: 'File Types',
    },
    ethnicity: {
      chartType: 'stackedBar',
      title: 'Ethnicity',
    },
    gender: {
      chartType: 'pie',
      title: 'Gender',
    },
    race: {
      chartType: 'pie',
      title: 'Race',
    },
    vital_status: {
      chartType: 'bar',
      title: 'Vital Status',
    },
  },
  table: {
    enabled: true,
    fields: [
      'project',
      'study',
      'race',
      'ethnicity',
      'gender',
      'vital_status',
      'whatever_lab_result_value',
      'file_count',
      'file_type',
      'file_format',
    ],
  },
  filters: {
    tabs: [{
      title: 'Project',
      fields: [
        'project',
        'study',
      ],
    },
    {
      title: 'Subject',
      fields: [
        'race',
        'ethnicity',
        'gender',
        'vital_status',
      ],
    },
    {
      title: 'File',
      fields: [
        'file_count',
        'file_type',
        'file_format',
      ],
    }],
  },
  buttons: [
    {
      enabled: true,
      type: 'data',
      title: 'Download All Data',
      leftIcon: 'user',
      rightIcon: 'download',
      fileName: 'data.json',
    },
    {
      enabled: true,
      type: 'manifest',
      title: 'Download Manifest',
      leftIcon: 'datafile',
      rightIcon: 'download',
      fileName: 'manifest.json',
    },
  ],
  guppyConfig: {
    dataType: 'subject',
    fieldMapping: [
      { field: 'project', name: 'project' },
      { field: 'study', name: 'study' },
      { field: 'race', name: 'race' },
      { field: 'ethnicity', name: 'ethnicity' },
      { field: 'gender', name: 'gender' },
      { field: 'vital_status', name: 'vital_status' },
      { field: 'whatever_lab_result_value', name: 'whatever_lab_result_value' },
      { field: 'file_count', name: 'file_count' },
      { field: 'file_type', name: 'file_type' },
      { field: 'file_format', name: 'file_format' },
    ],
    manifestMapping: {
      resourceIndexType: 'file',
      resourceIdField: 'file_id',
      referenceIdFieldInResourceIndex: 'subject_id',
      referenceIdFieldInDataIndex: 'subject_id',
    },
  },
};

export default config;
