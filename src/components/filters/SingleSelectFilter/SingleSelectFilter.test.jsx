import React from 'react';
import { mount } from 'enzyme';
import SingleSelectFilter from '.';

describe('SingleSelectFilter', () => {
  const onSelect = jest.fn();
  const component = mount(
    <SingleSelectFilter label='test1' onSelect={onSelect} />,
  );

  it('renders', () => {
    expect(component.find(SingleSelectFilter).length).toBe(1);
  });

  it('calls onSelect when selected', () => {
    expect(component.find('input').length).toBe(1);
    component.find('input').simulate('click');
    expect(onSelect).toHaveBeenCalled();
  });
});
