import conf from './localconf';

describe('The localconf', () => {
  const expectedKeys = [
    'dev',
    'mockStore',
    'app',
    'basename',
    'hostname',
    'userAPIPath',
    'submissionApiPath',
    'credentialCdisPath',
    'graphqlPath',
    'graphqlSchemaUrl',
    'appname',
    'login',
    'requiredCerts',
  ];

  it('Defines a bunch of configuration variables', () => {
    expectedKeys.forEach((key) => {
      expect(conf[key]).toBeDefined();
    });
  });

  it('Defines an \'app\' variable', () => {
    expect(!!conf.app).toBe(true);
  });

  it('supports buildConfig(app)', () => {
    expect(typeof conf.buildConfig).toBe('function');
    const newConf = conf.buildConfig(conf.app);
    expect(newConf).not.toBe(conf);
    expectedKeys.forEach((key) => {
      expect(newConf[key]).toEqual(conf[key]);
    });
  });

  it('can identify bot by user-agent value', () => {
    global.userAgent.mockReturnValue('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    const newConf = conf.buildConfig(conf.app);
    expect(global.navigator.userAgent).toMatch(newConf.ddKnownBotRegex);
  });

  it('can ignore normal browser event by user-agent value', () => {
    global.userAgent.mockReturnValue('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36');
    const newConf = conf.buildConfig(conf.app);
    expect(global.navigator.userAgent).not.toMatch(newConf.ddKnownBotRegex);
  });
});
