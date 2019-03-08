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

  const props = {
    graphqlField: '',
    projectId: '',
    setSQON: jest.fn(),
    api: jest.fn(),
  };

  const componentWithFilters = mount(
    <DataExplorerFilters
      dataExplorerConfig={{ filters: filterConfig }}
      {...props}
    />,
  );

  const componentWithoutFilters = mount(
    <DataExplorerFilters
      {...props}
    />,
  );

  it('renders', () => {
    expect(componentWithFilters.find(DataExplorerFilters).length).toBe(1);
    expect(componentWithoutFilters.find(DataExplorerFilters).length).toBe(1);
  });

  it('shows tabs when config is provided', () => {
    expect(componentWithFilters.find('AggregationTabs').length).toBe(1);
    expect(componentWithFilters.find('Aggregations').length).toBe(0);
    expect(componentWithFilters.find('.filter-group__tab').length).toBe(filterConfig.tabs.length);
  });

  it('doesnt show tabs when config is not provided', () => {
    expect(componentWithoutFilters.find('Aggregations').length).toBe(1);
    expect(componentWithoutFilters.find('AggregationTabs').length).toBe(0);
    expect(componentWithoutFilters.find('.filter-group__tab').length).toBe(0);
  });
});
