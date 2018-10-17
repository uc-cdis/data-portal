import React from 'react';
import { mount } from 'enzyme';
import DataExplorer from '.';

describe('DataExplorer', () => {
  it('renders', () => {
    const component = mount(<DataExplorer />);
    expect(component.find(DataExplorer).length).toBe(1);
  });
});
