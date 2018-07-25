import React from 'react';
import { mount } from 'enzyme';
import FilterList from '.';

describe('FilterList', () => {
  const filterOptions = [
    { text: 'test1', filterType: 'singleSelect' },
    { text: 'test2', filterType: 'singleSelect' },
    { text: 'test3', filterType: 'singleSelect' },
    {
      text: 'test4',
      filterType: 'range',
      min: 0,
      max: 100,
    },
  ];

  const filterSections = [
    { title: 'Section 1', options: filterOptions },
    { title: 'Section 2', options: filterOptions },
  ];

  const onDrag = jest.fn();
  const onSelect = jest.fn();
  const component = mount(
    <FilterList
      sections={filterSections}
      onSelect={onSelect}
      onDrag={onDrag}
    />,
  );

  it('renders', () => {
    expect(component.find(FilterList).length).toBe(1);
  });
});
