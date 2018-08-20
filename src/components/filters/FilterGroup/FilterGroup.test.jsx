import React from 'react';
import { mount } from 'enzyme';
import FilterGroup from '.';
import FilterList from '../FilterList/.';

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
    <FilterList key={0} sections={filterSections} />,
    <FilterList key={1} sections={filterSections2} />,
    <FilterList key={2} sections={filterSections3} />,
  ];

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
    <FilterGroup
      tabs={tabs}
      filterConfig={filterConfig}
      onSelect={jest.fn()}
      onDrag={jest.fn()}
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

  it('displays the correct tab title', () => {
    expect(component.find('.filter-group__tab-title').length).toBe(3);
    expect(
      component.find('.filter-group__tab-title').at(0).text(),
    ).toBe(filterConfig.tabs[0].title);
    expect(
      component.find('.filter-group__tab-title').at(1).text(),
    ).toBe(filterConfig.tabs[1].title);
    expect(
      component.find('.filter-group__tab-title').at(2).text(),
    ).toBe(filterConfig.tabs[2].title);
  });

  it('selects the tab on click', () => {
    expect(component.instance().state.selectedTabIndex).toBe(0);
    component.find('.filter-group__tab').at(2).simulate('click');
    expect(component.instance().state.selectedTabIndex).toBe(2);
  });

  it('changes the class for the selected tab', () => {
    expect(component.instance().state.selectedTabIndex).toBe(0);
    expect(component.find('.filter-group__tab--selected').length).toBe(1);
    component.find('.filter-group__tab').at(2).simulate('click');
    expect(component.instance().state.selectedTabIndex).toBe(2);
    expect(component.find('.filter-group__tab--selected').length).toBe(1);
  });
});
