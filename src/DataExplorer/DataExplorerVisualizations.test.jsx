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

  const arrangerConfig = {
    graphqlField: 'subject',
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
      arrangerConfig={arrangerConfig}
    />,
  );

  const noDataComponent = mount(
    <DataExplorerVisualizations arrangerConfig={arrangerConfig} />,
  );

  it('renders', () => {
    expect(component.find(DataExplorerVisualizations).length).toBe(1);
  });

  it('toggles visualization', () => {
    expect(component.find('.data-explorer__visualizations-title').length).toBe(1);
    expect(component.instance().state.showVisualization).toBe(true);
    component.find('.data-explorer__visualizations-title').simulate('click');
    expect(component.instance().state.showVisualization).toBe(false);
  });

  it('shows data when showVisualization is true', () => {
    component.find('.data-explorer__visualizations-title').simulate('click');
    expect(component.instance().props.arrangerData).toEqual(arrangerData);
    expect(component.instance().props.arrangerConfig).toEqual(arrangerConfig);
    expect(component.instance().state.showVisualization).toBe(true);
    expect(component.find('.data-explorer__charts').length).toBe(1);
  });

  it('shows doesnt data when showVisualization is false, or there is no data', () => {
    component.find('.data-explorer__visualizations-title').simulate('click');
    expect(component.instance().state.showVisualization).toBe(false);
    expect(component.find('.data-explorer__charts').length).toBe(0);

    expect(noDataComponent.instance().state.showVisualization).toBe(true);
    expect(noDataComponent.instance().props.arrangerData).toBe(null);
    expect(component.find('.data-explorer__charts').length).toBe(0);
  });
});
