import React from 'react';
import { mount } from 'enzyme';
import Legend from './Legend';

describe('Legend', () => {
  const items = ['c1', 'c2', 'c3'];
  it('can render and toggle', () => {
    const legend = mount(
      <Legend items={items} />,
    );
    expect(legend.find(Legend).length).toBe(1);
    expect(legend.state('show')).toBe(true);
    expect(legend.find('.data-dictionary-graph-legend__info').length).toBe(0);
    const toggleElem = legend.find('.data-dictionary-graph-legend__close');
    toggleElem.simulate('click');
    expect(legend.state('show')).toBe(false);
    const infoElem = legend.find('.data-dictionary-graph-legend__info');
    infoElem.simulate('click');
    expect(legend.state('show')).toBe(true);
  });
});
