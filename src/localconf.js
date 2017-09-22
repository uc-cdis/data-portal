
/**
 * Setup configuration variables based on the "app" the data-portal is
 * being deployed into (Brain Health Commons, Blood Pack, ...)
 * 
 * @param {app, dev, basename, mockStore, hostname} opts overrides for defaults
 */
function buildConfig(opts) {
  const defaults = {
    dev: !!(process.env.NODE_ENV && process.env.NODE_ENV === 'dev'),
    mockStore: !!(process.env.MOCK_STORE && process.env.MOCK_STORE === 'true'),
    app: (process.env.APP === undefined) ? 'generic' : process.env.APP,
    basename: (process.env.BASENAME === undefined) ? '/' : process.env.BASENAME,
    hostname: typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}/` : 'http://localhost/',
  };

  const { dev, mockStore, app, basename, hostname } = Object.assign({}, defaults, opts);

  let userapiPath = `${hostname}user/`;
  const submissionApiPath = `${hostname}api/v0/submission/`;
  const submissionApiOauthPath = `${hostname}api/v0/oauth2/`;
  // let credentialOauthPath = `${hostname}middleware/oauth2/v0/`;
  const credentialCdisPath = `${userapiPath}credentials/cdis/`;
  const graphqlPath = `${hostname}api/v0/submission/graphql/`;
  let login = {
    url: `${userapiPath}login/google?redirect=`,
    title: 'Login from Google',
  };
  const graphqlSchemaUrl = `${hostname}data/schema.json`;
  // let credentialPath = `${hostname}middleware/aws/v0/access_key/`;

  let appname = 'Unasigned';
  let navItems = [];
  const requiredCerts = [];

  // Support data/gqlSetup.js auto-generation of data-portal graphQL
  const gqlSetup = {
    fileTypeList: [
      'slide_image',
      'submitted_aligned_reads',
      'submitted_copy_number',
      'submitted_methylation',
      'submitted_somatic_mutation',
      'submitted_unaligned_reads',
    ],
    experimentType: 'experiment',
  };

  if (app === 'bpa') {
    appname = 'BPA Metadata Submission Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
    ];
    gqlSetup.experimentType = 'study';
  } else if (app === 'edc') {
    appname = 'Environmental Data Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
    ];
  } else if (app === 'bhc') {
    appname = 'The Brain Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#A51C30', name: 'home' },
      { icon: 'search', link: '/query', color: '#2D728F', name: 'query' },
      { icon: 'class', link: '/DD', color: '#A51C30', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#2D728F', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#A51C30', name: 'data' },
    ];

    gqlSetup.fileTypeList = [
      'slide_image',
      'submitted_aligned_reads',
      'submitted_copy_number',
      'submitted_methylation',
      'submitted_somatic_mutation',
      'submitted_unaligned_reads',
      'app_checkup',
      'cell_image',
      'clinical_checkup',
      'derived_checkup',
      'mass_cytometry_assay',
      'mass_cytometry_image',
      'mri_result',
      'sensor_checkup',
      'test_result',
    ];
    gqlSetup.experimentType = 'study';
  } else if (app === 'acct') {
    appname = 'ACCOuNT Data Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
    ];
  } else if (app === 'gdc') {
    userapiPath = dev === true ? `${hostname}user/` : `${hostname}api/`;
    // credentialPath = `${userapiPath}credentials/cleversafe/`;
    // credentialOauthPath = `${userapiPath}oauth2/`;
    appname = 'GDC Jamboree Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
    ];
    login = {
      url: 'https://itrusteauth.nih.gov/affwebservices/public/saml2sso?SPID=https://bionimbus-pdc.opensciencedatacloud.org/shibboleth&RelayState=',
      title: 'Login from NIH',
    };
  } else {
    appname = 'Generic Data Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#1d3674', name: 'home' },
      { icon: 'search', link: '/query', color: '#ad7e1c', name: 'query' },
      { icon: 'class', link: '/DD', color: '#1d3674', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#1d3674', name: 'data' },
    ];
  }

  const conf = {
    dev,
    mockStore,
    app,
    basename,
    hostname,
    userapiPath,
    submissionApiPath,
    submissionApiOauthPath,
    credentialCdisPath,
    graphqlPath,
    graphqlSchemaUrl,
    appname,
    navItems,
    login,
    requiredCerts,
    gqlSetup,
    buildConfig,
  };
  return conf;
}

const defaultConf = buildConfig();
// Commonjs style export, so can load from nodejs into data/gqlSetup.js
module.exports = defaultConf;
