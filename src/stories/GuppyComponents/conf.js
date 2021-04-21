export const filterConfig = {
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
};

export const tableConfig = [
  { field: 'project', name: 'Project' },
  { field: 'study', name: 'Study' },
  { field: 'race', name: 'Race' },
  { field: 'ethnicity', name: 'Ethnicity' },
  { field: 'gender', name: 'Gender' },
  { field: 'vital_status', name: 'Vital Status' },
  { field: 'whatever_lab_result_value', name: 'Lab Result Value' },
  { field: 'file_count', name: 'File Count' },
  { field: 'file_type', name: 'File Type' },
  { field: 'file_format', name: 'File Format' },
];

export const guppyConfig = {
  path: 'http://localhost:3000',
  type: 'subject',
  fileType: 'file',
  tierAccessLimit: 20,
};

export const fieldMapping = [
  {
    field: 'project',
    name: 'Project Name',
  },
];
