import React from 'react';
import { mount } from 'enzyme';
import FilterSection from '.';

describe('FilterSection', () => {
  const singleSelectOptions = [
    { text: 'test1', filterType: 'singleSelect' },
    { text: 'test2', filterType: 'singleSelect' },
    { text: 'test3', filterType: 'singleSelect' },
    { text: 'test4', filterType: 'singleSelect' },
  ];

  const onDrag = jest.fn();
  const onSelect = jest.fn();
  let component;
  beforeEach(() => {
    component = mount(
      <FilterSection
        title='Section Title'
        options={singleSelectOptions}
        onSelect={onSelect}
        onAfterDrag={onDrag}
        hideZero={false}
      />
    );
  });

  it('renders', () => {
    expect(component.exists(FilterSection)).toBe(true);
  });

  it('toggles expand on click', () => {
    expect(
      component.exists(`[aria-label="Collapse filter: Section Title"]`)
    ).toBe(true);
    component.find('.g3-filter-section__title').simulate('click');
    expect(
      component.exists(`[aria-label="Expand filter: Section Title"]`)
    ).toBe(true);
  });
});
