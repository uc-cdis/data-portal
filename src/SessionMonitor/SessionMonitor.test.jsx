import React from 'react';
import { mount } from 'enzyme';
import SessionMonitor from '.';

describe('SessionMonitor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('logs the user out after inactivity', () => {
    const component = mount(
      <SessionMonitor refreshSessionTime={500} inactiveTimeLimit={-1} />,
    );
    setTimeout(() => {
      const refreshSessionSpy = jest.spyOn(component.instance(), 'refreshSession');
      expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
      expect(setTimeout).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    }, 1000);
  });

  it('refreshes the users token if active', () => {
    const component = mount(
      <SessionMonitor refreshSessionTime={500} inactiveTimeLimit={-1} />,
    );
    setTimeout(() => {
      const refreshSessionSpy = jest.spyOn(component.instance(), 'refreshSession');
      expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(1);
    }, 1000);
  });
});
