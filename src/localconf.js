const { components } = require('./text');

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
    app: process.env.APP || 'generic',
    basename: process.env.BASENAME || '/',
    hostname: typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}/` : 'http://localhost/',
  };

  //
  // Override default basename if loading via /dev.html
  // dev.html loads bundle.js via https://localhost...
  //
  if (typeof location !== 'undefined' && location.pathname.indexOf(`${defaults.basename}dev.html`) === 0) {
    defaults.basename += 'dev.html';
  }

  const { dev, mockStore, app, basename, hostname } = Object.assign({}, defaults, opts);

  const submissionApiPath = `${hostname}api/v0/submission/`;
  const apiPath = `${hostname}api/`;
  const submissionApiOauthPath = `${hostname}api/v0/oauth2/`;
  const graphqlPath = `${hostname}api/v0/submission/graphql/`;
  let userapiPath = `${hostname}user/`;
  const jobapiPath = `${hostname}/job/`;
  const credentialCdisPath = `${userapiPath}credentials/cdis/`;
  let login = {
    url: `${userapiPath}login/google?redirect=`,
    title: 'Login from Google',
  };
  const loginPath = `${userapiPath}login/`;
  const graphqlSchemaUrl = `${hostname}data/schema.json`;

  let dashboardIcons = [
    'account_circle',
    'receipt',
    'invert_colors',
    'description',
  ];
  let localTheme = {
    'barGraph.lineColor': '#666666',
    'barGraph.bar1Color': '#3283c8',
    'barGraph.bar2Color': '#7ec500',
    'barGraph.bar3Color': '#ad91ff',
    'barGraph.bar4Color': '#f4b940',
    'barGraph.bar5Color': '#e74c3c',
    'barGraph.bar6Color': '#05b8ee',
    'barGraph.bar7Color': '#ff7abc',
    'barGraph.bar8Color': '#ef8523',
    'barGraph.bar9Color': '#26d9b1',
    'summary.borderTopColor': '#c87152',
    'summary.borderColor': '#222222',
    'summary.countColor': '#ff4200',
    'summary.iconColor': '#008000',
    'projectTable.summaryRowColor': '#eeeeee',
    'projectTable.submitButtonColor': '#dddddd',
    tableBarColor: '#7d7474',
  };
  const requiredCerts = [];

  if (app === 'edc') {
    dashboardIcons = [
      'satellite',
      'track_changes',
      'description',
      'timeline',
    ];
  } else if (app === 'kf') {
    localTheme = {
      'barGraph.lineColor': '#dfdfdf',
      'barGraph.bar1Color': '#00adee',
      'barGraph.bar2Color': '#be1e2d',
      'barGraph.bar3Color': '#ef8523',
      'barGraph.bar4Color': '#ff9635',
      'barGraph.bar5Color': '#e74c3c',
      'summary.borderTopColor': '#f6921e',
      'summary.borderColor': '#dfdfdf',
      'summary.countColor': '#f6921e',
      'summary.iconColor': '#00adee',
      'projectTable.summaryRowColor': '#dfdfdf',
      'projectTable.submitButtonColor': '#dfdfdf',
      tableBarColor: '#CC3399',
    };
  } else if (app === 'bhc') {
    localTheme = {
      'barGraph.lineColor': '#666666',
      'barGraph.bar1Color': '#6193b1',
      'barGraph.bar2Color': '#94af83',
      'barGraph.bar3Color': '#ef8523',
      'barGraph.bar4Color': '#ff9635',
      'barGraph.bar5Color': '#e74c3c',
      'summary.borderTopColor': '#94af83',
      'summary.borderColor': '#222222',
      'summary.countColor': '#d00000',
      'summary.iconColor': '#7aa19b',
      'projectTable.summaryRowColor': '#565656',
      'projectTable.submitButtonColor': '#dddddd',
      tableBarColor: '#7d7474',
    };
  } else if (app === 'gdc') {
    userapiPath = dev === true ? `${hostname}user/` : `${hostname}api/`;
    login = {
      url: 'https://itrusteauth.nih.gov/affwebservices/public/saml2sso?SPID=https://bionimbus-pdc.opensciencedatacloud.org/shibboleth&RelayState=',
      title: 'Login from NIH',
    };
  }

  const conf = {
    app,
    basename,
    buildConfig,
    dev,
    hostname,
    userapiPath,
    jobapiPath,
    apiPath,
    submissionApiPath,
    submissionApiOauthPath,
    credentialCdisPath,
    graphqlPath,
    graphqlSchemaUrl,
    appname: components.appName,
    mockStore,
    dashboardIcons,
    localTheme,
    login,
    loginPath,
    requiredCerts,
  };
  return conf;
}

const defaultConf = buildConfig();
// Commonjs style export, so can load from nodejs into data/gqlSetup
module.exports = defaultConf;
