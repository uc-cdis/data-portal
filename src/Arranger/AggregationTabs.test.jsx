import React from 'react';
import { mount } from 'enzyme';
import AggregationTabs from './AggregationTabs';

// TODO: fix Arranger tests [PXD-1313]
describe('AggregationTabs', () => {
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


  const component = mount(
    <AggregationTabs
      filterConfig={filterConfig}
      setSQON={jest.fn()}
      projectId={''}
      graphqlField={''}
    />,
  );

  test.skip('it renders', () => {
    expect(component.find(AggregationTabs).length).toBe(1);
  });

  test.skip('it divides into tabs based on config', () => {
    expect(component.find('.filter-group__tab').length).toBe(filterConfig.tabs.length);
  });
});
