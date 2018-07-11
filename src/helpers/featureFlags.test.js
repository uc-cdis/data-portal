import isEnabled from './featureFlags';

describe('featureFlags', () => {
  it('returns false if the flag was not enabled', () => {
    expect(isEnabled('testFlag')).toBe(false);
  });

  it('returns true if the flag has been enabled', () => {
    expect(isEnabled('testFlag')).toBe(false);
    global.sessionStorage.setItem('gen3Features', JSON.stringify({ 'testFlag': true }));
    expect(isEnabled('testFlag')).toBe(true);
  })
});
