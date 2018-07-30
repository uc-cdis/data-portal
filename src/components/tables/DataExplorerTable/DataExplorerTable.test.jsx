import React from 'react';
import { mount } from 'enzyme';
import DataExplorerTable from '.';

describe('DataExplorerTable', () => {
  const selectedTableRows = [];

  const component = mount(
    <DataExplorerTable selectedTableRows={selectedTableRows} />,
  ).find(DataExplorerTable);

  it('renders', () => {
    expect(component.length).toBe(1);
  });
});
