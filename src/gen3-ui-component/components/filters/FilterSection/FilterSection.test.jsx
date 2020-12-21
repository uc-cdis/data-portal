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
      />,
    );
  });

  it('renders', () => {
    expect(component.find(FilterSection).length).toBe(1);
  });

  it('toggles expand on click', () => {
    expect(component.instance().state.isExpanded).toBe(true);
    expect(component.find('.g3-filter-section__header').length).toBe(1);
    component.find('.g3-filter-section__title').simulate('click');
    expect(component.instance().state.isExpanded).toBe(false);
  });

  it('shows the number of currently selected filters', () => {
    // expect the filterChip to not be shown
    expect(component.find('.g3-filter-section__selected-count-chip').length).toBe(0);

    // select two options
    const option1 = singleSelectOptions[0];
    const option2 = singleSelectOptions[1];
    component.instance().handleSelectSingleSelectFilter(option1.text);
    component.instance().handleSelectSingleSelectFilter(option2.text);

    // expect the filterChip to appear
    component.update();
    expect(component.find('.g3-filter-section__selected-count-chip').length).toBe(1);
    // expect the filterChip to display that 2 filters are selected
    const filterChip = component.find('.g3-filter-section__selected-count-chip').first();
    expect(filterChip.find('.g3-filter-section__selected-count-chip-text-emphasis').first().instance().text === '2');
  });

  it('clears all selected filters on clear button click', () => {
    // select two options
    const option1 = singleSelectOptions[0];
    const option2 = singleSelectOptions[1];
    component.instance().handleSelectSingleSelectFilter(option1.text);
    component.instance().handleSelectSingleSelectFilter(option2.text);

    // expect options to be selected
    expect(component.state('filterStatus')).toEqual({
      [option1.text]: true,
      [option2.text]: true,
    });

    // click the clear button
    const mockEvent = { stopPropagation: () => {} };
    component.instance().handleClearButtonClick(mockEvent);

    // expect all options to be unselected
    expect(component.state('filterStatus')).toEqual({});
  });
});
