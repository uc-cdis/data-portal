import React from 'react';
import { mount } from 'enzyme';
import DataExplorerVisualizations from './DataExplorerVisualizations';

describe('DataExplorerVisualizations', () => {
  const arrangerData = {
    subject: {
      aggregations: {
        gender: {
          buckets: [
            { doc_count: 4, key: 'Male' },
            { doc_count: 6, key: 'Female' },
          ],
        },
      },
    },
  };

  const dataExplorerConfig = {
    arrangerConfig: {
      graphqlField: 'subject',
    },
    charts: {
      gender: {
        chartType: 'bar',
        title: 'Gender',
      },
    },
  };

  const component = mount(
    <DataExplorerVisualizations
      arrangerData={arrangerData}
      dataExplorerConfig={dataExplorerConfig}
    />,
  );

  it('renders', () => {
    expect(component.find(DataExplorerVisualizations).length).toBe(1);
  });
});
