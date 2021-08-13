import { guppyUrl } from '../../localconf';

export const filterConfig = {
  tabs: [
    {
      title: 'Project',
      fields: ['project_id'],
    },
    {
      title: 'Subject',
      fields: ['race', 'ethnicity', 'sex'],
    },
  ],
};

export const tableConfig = [
  { field: 'project_id', name: 'Project' },
  { field: 'race', name: 'Race' },
  { field: 'ethnicity', name: 'Ethnicity' },
  { field: 'sex', name: 'Sex' },
];

export const guppyConfig = {
  path: guppyUrl,
  dataType: 'subject',
  tierAccessLimit: 20,
  nodeCountTitle: 'Subjects',
};

export const fieldMapping = [
  {
    field: 'project',
    name: 'Project Name',
  },
];
