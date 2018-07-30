import React from 'react';
import { mount } from 'enzyme';
import DataExplorerFilters from './DataExplorerFilters';

describe('DataExplorerFilters', () => {
  it('renders', () => {
    const component = mount(
      <DataExplorerFilters />,
    );
    expect(component.find(DataExplorerFilters).length).toBe(1);
  });
});
