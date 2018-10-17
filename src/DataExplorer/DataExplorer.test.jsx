import React from 'react';
import { mount } from 'enzyme';
import DataExplorer from '.';

describe('DataExplorer', () => {
  const component = mount(
    <DataExplorer refreshSessionTime={1} inactiveTimeLimit={2}/>
  );

  it('renders', () => {
    expect(component.find(DataExplorer).length).toBe(1);
  });

  it('logs the user out after inactivity', () => {

  });

  it('refreshes the users token if active', () => {

  });
});
