import { SessionMonitor } from '.';

describe('SessionMonitor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('logs the user out after inactivity', () => {
    const sessionMonitor = new SessionMonitor(500, -1);
    const refreshSessionSpy = jest.spyOn(sessionMonitor, 'refreshSession');
    const logoutUserSpy = jest.spyOn(sessionMonitor, 'logoutUser');

    sessionMonitor.updateSession();
    expect(refreshSessionSpy).not.toHaveBeenCalled();
    expect(logoutUserSpy).toHaveBeenCalledTimes(1);
  });

  it('refreshes the users token if active', () => {
    const sessionMonitor = new SessionMonitor(500, 10000000);
    const refreshSessionSpy = jest.spyOn(sessionMonitor, 'refreshSession');
    const logoutUserSpy = jest.spyOn(sessionMonitor, 'logoutUser');

    sessionMonitor.updateSession();
    expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
    expect(logoutUserSpy).not.toHaveBeenCalled();
  });
});
