import React from 'react';
import { mount } from 'enzyme';
import DataExplorerFilters from './DataExplorerFilters';

describe('DataExplorerFilters', () => {
  const filterConfig = {
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
        'file_type',
      ],
    }],
  };

  it('renders', () => {
    const component = mount(
      <DataExplorerFilters filterConfig={filterConfig} />,
    );
    expect(component.find(DataExplorerFilters).length).toBe(1);
  });
});
