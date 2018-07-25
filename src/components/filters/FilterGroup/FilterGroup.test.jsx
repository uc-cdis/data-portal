import React from 'react';
import { mount } from 'enzyme';
import FilterGroup from '.';

describe('FilterGroup', () => {
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
    { title: 'Section 3', options: filterOptions },
  ];

  const filterSections2 = [
    { title: 'Section 3', options: filterOptions },
    { title: 'Section 4', options: filterOptions },
    { title: 'Section 5', options: filterOptions },
    { title: 'Section 6', options: filterOptions },
  ];

  const filterSections3 = [
    { title: 'Section 5', options: filterOptions },
    { title: 'Section 6', options: filterOptions },
  ];

  const tabs = [
    { sections: filterSections, title: 'Section1' },
    { sections: filterSections2, title: 'Section2' },
    { sections: filterSections3, title: 'This is a long section name' },
    { sections: filterSections, title: 'Section3' },
  ];

  const onSelect = jest.fn();
  const onDrag = jest.fn();
  const component = mount(
    <FilterGroup
      tabs={tabs}
      onSelect={onSelect}
      onDrag={onDrag}
    />,
  );

  beforeEach(() => {
    component.find('.filter-group__tab').at(0).simulate('click');
  });

  it('renders', () => {
    expect(component.find(FilterGroup).length).toBe(1);
  });

  it('displays the correct number of tabs', () => {
    expect(component.find('.filter-group__tab').length).toBe(tabs.length);
  });

  it('selects the tab on click', () => {
    expect(component.instance().state.selectedTab.index).toBe(0);
    component.find('.filter-group__tab').at(2).simulate('click');
    expect(component.instance().state.selectedTab.index).toBe(2);
  });

  it('changes the class for the selected tab', () => {
    expect(component.instance().state.selectedTab.index).toBe(0);
    expect(component.find('.filter-group__tab--selected').length).toBe(1);
    component.find('.filter-group__tab').at(2).simulate('click');
    expect(component.instance().state.selectedTab.index).toBe(2);
    expect(component.find('.filter-group__tab--selected').length).toBe(1);
  });
});
