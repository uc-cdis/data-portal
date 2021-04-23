import { SessionMonitor } from '.';

describe('SessionMonitor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('does not refresh the users token after inactivity', () => {
    const sessionMonitor = new SessionMonitor(500, -1);
    const refreshSessionSpy = jest.spyOn(sessionMonitor, 'refreshSession');

    sessionMonitor.updateSession();
    expect(refreshSessionSpy).not.toHaveBeenCalled();
  });

  it('refreshes the users token if active', () => {
    const sessionMonitor = new SessionMonitor(500, 10000000);
    const refreshSessionSpy = jest.spyOn(sessionMonitor, 'refreshSession');

    sessionMonitor.updateSession();
    expect(refreshSessionSpy).toHaveBeenCalledTimes(1);
  });

  it('detects the page correctly', () => {
    expect(
      SessionMonitor.pageFromURL('https://example.subdomain.org/workspace/'),
    ).toEqual('workspace');

    expect(
      SessionMonitor.pageFromURL('https://example.subdomain.org/workspace'),
    ).toEqual('workspace');

    expect(
      SessionMonitor.pageFromURL('https://example.subdomain.org/dev.html/workspace/'),
    ).toEqual('workspace');

    expect(
      SessionMonitor.pageFromURL('example-site.example-subdomain.org/login'),
    ).toEqual('login');

    expect(
      SessionMonitor.pageFromURL('example-site.example-subdomain.org//login//'),
    ).toEqual('login');

    expect(
      SessionMonitor.pageFromURL('https://example.subdomain.org/analysis/abc123//'),
    ).toEqual('abc123');

    expect(
      SessionMonitor.pageFromURL('https://example.subdomain.org/dev.html/analysis/abc123//'),
    ).toEqual('abc123');
  });
});
