import React from 'react';
import { mount } from 'enzyme';
import DataExplorer from '.';

describe('DataExplorer', () => {
  it('renders', () => {
    const component = mount(<DataExplorer />);
    expect(component.find(DataExplorer).length).toBe(1);
  });

  it('registers mouse clicks', () => {

  });

  it('logs the user out after inactivity', () => {

  });

  it('refreshes the users token if active', () => {

  });
});
