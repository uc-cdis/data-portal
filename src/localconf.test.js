import conf from './localconf';

describe('The localconf', () => {
  const expectedKeys = [
    'dev',
    'mockStore',
    'app',
    'basename',
    'hostname',
    'userapiPath',
    'submissionApiPath',
    'submissionApiOauthPath',
    'credentialCdisPath',
    'graphqlPath',
    'graphqlSchemaUrl',
    'appname',
    'login',
    'requiredCerts',
  ];

  it('Defines a bunch of configuration variables', () => {
    expectedKeys.forEach((key) => {
      // if (conf[key] === undefined) {
      //   console.log(`conf[${key}] === ${conf[key]}`);
      // }
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
});
