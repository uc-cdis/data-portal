import React from 'react';
import { mount } from 'enzyme';
import DataExplorerTable from '.';

describe('DataExplorerTable', () => {
  const mockConfig = {
    timestamp: '2018-01-12T16:42:07.495Z',
    type: 'items',
    keyField: 'col1',
    defaultSorted: [{ id: 'col1', desc: false }],
    columns: [
      {
        show: true,
        Header: 'Col1',
        type: 'string',
        sortable: true,
        canChangeShow: true,
        accessor: 'col1',
      },
      {
        show: true,
        Header: 'Col2',
        type: 'string',
        sortable: true,
        canChangeShow: true,
        accessor: 'col2',
      },
    ],
  };

  const mockData = Array(100)
    .fill()
    .map((_, i) => ({
      col1: i,
      col2: 'test',
    }));

  const fetchMockData = () => Promise.resolve({
    total: mockData.length,
    data: mockData,
  });

  const component = mount(
    <DataExplorerTable config={mockConfig} fetchData={fetchMockData} />,
  ).find(DataExplorerTable);

  it('renders', () => {
    expect(component.length).toBe(1);
  });

  it('sets selected rows', () => {
    const rows = [1, 2, 3];
    expect(component.instance().state.selectedTableRows.length).toBe(0);
    component.instance().setSelectedTableRows(rows);
    expect(component.instance().state.selectedTableRows.length).toBe(rows.length);
  });
});
