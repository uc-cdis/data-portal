import React from 'react';
import { mount } from 'enzyme';
import RangeFilter from '.';

describe('RangeFilter', () => {
  const onDrag = jest.fn();
  const component = mount(
    <RangeFilter min={0} max={100} onDrag={onDrag} label='' />,
  );

  it('renders', () => {
    expect(component.find(RangeFilter).length).toBe(1);
  });

  it('sets bounds on slider change', () => {
    expect(component.instance().state.lowerBound).toBe(0);
    expect(component.instance().state.upperBound).toBe(100);
    component.instance().onSliderChange([30, 55]);
    expect(component.instance().state.lowerBound).toBe(30);
    expect(component.instance().state.upperBound).toBe(55);
  });
});
