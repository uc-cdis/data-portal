import React from 'react';
import { mount } from 'enzyme';
import RangeFilter from '.';

describe('RangeFilter', () => {
  const onDrag = jest.fn();
  const min = 0;
  const max = 100;
  let component;
  beforeEach(() => {
    component = mount(
      <RangeFilter min={min} max={max} onAfterDrag={onDrag} label='' />,
    );
  });

  it('renders', () => {
    expect(component.find(RangeFilter).length).toBe(1);
  });

  it('sets bounds on slider change', () => {
    expect(component.instance().state.lowerBound).not.toBe(30);
    expect(component.instance().state.upperBound).not.toBe(55);
    component.instance().onSliderChange([30, 55]);
    expect(component.instance().state.lowerBound).toBe(30);
    expect(component.instance().state.upperBound).toBe(55);
  });

  it('calculates fixed length after decimal point correctly', () => {
    expect(component.instance().getNumberToFixed(1.234567)).toBe(1.23);
  });

  it('updates inputs on slider change', () => {
    component.instance().onSliderChange([30, 55]);
    expect(component.instance().state.lowerBoundInputValue).toBe(30);
    expect(component.instance().state.upperBoundInputValue).toBe(55);
  });

  it('updates sliders on input submit', () => {
    component.instance().handleLowerBoundInputChange(30);
    component.instance().handleInputSubmit();
    expect(component.instance().state.lowerBound).toBe(30);
  });

  it('should clamp lowerBound to between [min, upperBound]', () => {
    // lowerBound should be clamped to min
    component.instance().handleLowerBoundInputChange(min - 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.lowerBound).toBe(min);
    expect(component.instance().state.lowerBoundInputValue).toBe(min);

    // lowerBound should be clamped to upperBound
    const upperBound = 30;
    component.instance().setState({ upperBound });
    component.instance().handleLowerBoundInputChange(upperBound + 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.lowerBound).toBe(upperBound);
    expect(component.instance().state.lowerBoundInputValue).toBe(upperBound);
  });

  it('should clamp upperBound to between [lowerBound, max]', () => {
    // upperBound should be clamped to max
    component.instance().handleUpperBoundInputChange(max + 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.upperBound).toBe(max);
    expect(component.instance().state.upperBoundInputValue).toBe(max);

    // upperBound should be clamped to lowerBound
    const lowerBound = 30;
    component.instance().setState({ lowerBound });
    component.instance().handleUpperBoundInputChange(lowerBound - 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.upperBound).toBe(lowerBound);
    expect(component.instance().state.upperBoundInputValue).toBe(lowerBound);
  });

  it('if count === hideValue, lower slider should not be allowed to increase and upper slider should not be allowed to decrease', () => {
    const lb = 30;
    const ub = 60;
    component = mount(
      <RangeFilter count={-1} hideCount={-1} lowerBound={lb} upperBound={ub} min={min} max={max} onAfterDrag={onDrag} label='' />,
    );
    // increasing lb should have no effect
    component.instance().onSliderChange([lb + 1, ub]);
    expect(component.instance().state.lowerBound).toBe(lb);
    // decreasing ub should have no effect
    component.instance().onSliderChange([lb, ub - 1]);
    expect(component.instance().state.upperBound).toBe(ub);

    // lb should still decrease like normal
    component.instance().onSliderChange([lb - 1, ub]);
    expect(component.instance().state.lowerBound).toBe(lb - 1);
    // ub should still increase like normal
    component.instance().onSliderChange([lb, ub + 1]);
    expect(component.instance().state.upperBound).toBe(ub + 1);
  });

  it('if count === hideValue, lower input should not be allowed to increase and upper input should not be allowed to decrease', () => {
    const lb = 30;
    const ub = 60;
    component = mount(
      <RangeFilter count={-1} hideCount={-1} lowerBound={lb} upperBound={ub} min={min} max={max} onAfterDrag={onDrag} label='' />,
    );
    // increasing lb should have no effect
    component.instance().handleLowerBoundInputChange(lb + 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.lowerBound).toBe(lb);
    // decreasing ub should have no effect
    component.instance().handleUpperBoundInputChange(ub - 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.upperBound).toBe(ub);

    // lb should still decrease like normal
    component.instance().handleLowerBoundInputChange(lb - 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.lowerBound).toBe(lb - 1);
    // ub should still increase like normal
    component.instance().handleUpperBoundInputChange(ub + 1);
    component.instance().handleInputSubmit();
    expect(component.instance().state.upperBound).toBe(ub + 1);
  });
});
