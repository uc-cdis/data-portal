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
    <AggregationTabs filterConfig={filterConfig} />,
  );

  test.skip('it renders', () => {

  });

  test.skip('it divides into tabs based on config', () => {

  });
});
