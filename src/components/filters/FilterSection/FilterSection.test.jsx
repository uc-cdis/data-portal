import React from 'react';
import { mount } from 'enzyme';
import FilterSection from '.';

describe('FilterSection', () => {
  const singleSelectOptions = [
    { text: "test1", filterType: "singleSelect" },
    { text: "test2", filterType: "singleSelect" },
    { text: "test3", filterType: "singleSelect" },
    { text: "test4", filterType: "singleSelect" },
  ];

  const mixedOptions = [
    { text: "test1", filterType: "singleSelect" },
    { text: "test2", filterType: "range" },
    { text: "test3", filterType: "range" },
    { text: "test4", filterType: "singleSelect" },
  ];

  const component = mount(
    <FilterSection title="Section Title" options={singleSelectOptions} />
  );

  it('renders', () => {
    expect(component.find(FilterSection).length).toBe(1);
  });

  it('toggles expand on click', () => {
    expect(component.instance().state.isExpanded).toBe(false);
    expect(component.find('button').length).toBe(1);
    component.find('button').simulate('click');
    expect(component.instance().state.isExpanded).toBe(true);
  });

  it('picks the right kind of filter to display', () => {
    expect(component.find('SingleSelectFilter').length).toBe(singleSelectOptions.length);
    expect(component.find('RangeFilter').length).toBe(0);
    const mixedFilterComponent = mount(
      <FilterSection title="Section Title" options={mixedOptions} />
    );
    mixedFilterComponent.find('button').simulate('click');
    expect(mixedFilterComponent.find('SingleSelectFilter').length).toBe(2);
    expect(mixedFilterComponent.find('RangeFilter').length).toBe(2);
  });
});
