import React from 'react';
import { mount } from 'enzyme';
import DataExplorer from '.';

// TODO: skipping tests because Arranger causes them to time out [PXD-1313]
describe('DataExplorer', () => {
  test.skip('it renders', () => {
    const component = mount(<DataExplorer />);
    expect(component.find(DataExplorer).length).toBe(1);
  });
});
