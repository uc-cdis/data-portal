import React from 'react';
import { mount } from 'enzyme';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import FilterSection from '.';

describe('FilterSection', () => {
  library.add(faAngleUp, faAngleDown);

  const singleSelectOptions = [
    { text: 'test1', filterType: 'singleSelect' },
    { text: 'test2', filterType: 'singleSelect' },
    { text: 'test3', filterType: 'singleSelect' },
    { text: 'test4', filterType: 'singleSelect' },
  ];

  const mixedOptions = [
    { text: 'test1', filterType: 'singleSelect' },
    {
      text: 'test2',
      filterType: 'range',
      min: 0,
      max: 100,
    },
    {
      text: 'test3',
      filterType: 'range',
      min: 0,
      max: 100,
    },
    { text: 'test4', filterType: 'singleSelect' },
  ];

  const onDrag = jest.fn();
  const onSelect = jest.fn();
  const component = mount(
    <FilterSection
      title='Section Title'
      options={singleSelectOptions}
      onSelect={onSelect}
      onDrag={onDrag}
    />,
  );

  it('renders', () => {
    expect(component.find(FilterSection).length).toBe(1);
  });

  it('toggles expand on click', () => {
    expect(component.instance().state.isExpanded).toBe(false);
    expect(component.find('.svg-inline--fa').length).toBe(1);
    component.find('.svg-inline--fa').simulate('click');
    expect(component.instance().state.isExpanded).toBe(true);
  });

  it('picks the right kind of filter to display', () => {
    expect(component.find('.single-select-filter').length).toBe(singleSelectOptions.length);
    expect(component.find('.range-filter').length).toBe(0);
    const mixedFilterComponent = mount(
      <FilterSection
        title='Section Title'
        options={mixedOptions}
        onSelect={onSelect}
        onDrag={onDrag}
      />,
    );
    mixedFilterComponent.find('.svg-inline--fa').simulate('click');
    expect(mixedFilterComponent.find('.single-select-filter').length).toBe(2);
    expect(mixedFilterComponent.find('.range-filter').length).toBe(2);
  });
});
