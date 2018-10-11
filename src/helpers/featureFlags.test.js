import isEnabled from './featureFlags';
import { config } from '../params';

jest.mock('../params', () => ({
  components: {
  },
  config: {
    featureFlags: {
      testFlag: false,
    },
  },
}));

describe('featureFlags', () => {
  beforeEach(() => {
    global.sessionStorage.clear();
    config.featureFlags.testFlag = false;
  });

  it('returns false if the flag was not enabled anywhere', () => {
    expect(isEnabled('testFlag')).toBe(false);
  });

  it('returns true if the flag has been enabled in browser', () => {
    expect(isEnabled('testFlag')).toBe(false);
    global.sessionStorage.setItem('gen3Features', JSON.stringify({ testFlag: true }));
    expect(isEnabled('testFlag')).toBe(true);
  });

  it('returns true if the flag has been enabled in default config', () => {
    expect(isEnabled('testFlag')).toBe(false);
    config.featureFlags.testFlag = true;
    expect(isEnabled('testFlag')).toBe(true);
  });

  it('returns false if default config is empty', () => {
    expect(isEnabled('testFlag')).toBe(false);
    config.featureFlags = {};
    expect(isEnabled('testFlag')).toBe(false);
  });
});
