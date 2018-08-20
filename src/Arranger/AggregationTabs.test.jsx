import React from 'react';
import { mount } from 'enzyme';
import AggregationTabs from './AggregationTabs';

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
      api={''}
    />,
  );

  it('renders', () => {
    expect(component.find(AggregationTabs).length).toBe(1);
  });

  it('divides into tabs based on config', () => {
    expect(component.find('.filter-group__tab').length).toBe(filterConfig.tabs.length);
  });
});
