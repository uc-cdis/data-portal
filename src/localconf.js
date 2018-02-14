
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
  // let credentialOauthPath = `${hostname}middleware/oauth2/v0/`;
  const graphqlPath = `${hostname}api/v0/submission/graphql/`;
  let userapiPath = `${hostname}user/`;
  let credentialCdisPath = `${userapiPath}credentials/cdis/`;
  let login = {
    url: `${userapiPath}login/google?redirect=`,
    title: 'Login from Google',
  };
  const graphqlSchemaUrl = `${hostname}data/schema.json`;
  // let credentialPath = `${hostname}middleware/aws/v0/access_key/`;

  let appname = 'Unasigned';
  let navItems = [];
  let countNames = [];
  let countPluralNames = [];
  let dashboardIcons = [
    'account_circle',
    'receipt',
    'description',
    'invert_colors',
  ];
  let localTheme = {
    'barGraph.lineColor': '#666666',
    'barGraph.bar1Color': '#8884d8',
    'barGraph.bar2Color': '#82ca9d',
    'summary.borderTopColor': '#c87152',
    'summary.borderColor': '#222222',
    'summary.countColor': '#ff4200',
    'summary.iconColor': '#008000',
    'projectTable.summaryRowColor': '#eeeeee',
    'projectTable.submitButtonColor': '#dddddd',
    tableBarColor: '#7d7474',
  };
  const requiredCerts = [];

  if (app === 'bpa') {
    appname = 'BPA Metadata Submission Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
    ];
    countNames = [
      'Case',
      'Study',
      'File',
      'Aliquot',
    ];
    countPluralNames = [
      'Cases',
      'Studies',
      'Files',
      'Aliquots',
    ];
  } else if (app === 'gtex') {
    appname = 'NIH Data Commons Consortium Pilot Phase\nGTEx & TOPMed Data Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'collections', link: 'https://dcp.bionimbus.org/dcp', color: '#a2a2a2', name: 'exploration' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
      { icon: 'dvr', link: 'https://dcp.bionimbus.org/jupyter', color: '#a2a2a2', name: 'workspace' },
    ];
    countNames = [
      'Case',
      'Study',
      'File',
      'Aliquot',
    ];
    countPluralNames = [
      'Cases',
      'Studies',
      'Files',
      'Aliquots',
    ];
  } else if (app === 'edc') {
    appname = 'Environmental Data Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
      { icon: 'dvr', link: 'https://portal.occ-data.org/jup', color: '#a2a2a2', name: 'workspace' },
    ];
    countNames = [
      'Satellite',
      'Radar',
      'File',
      'Weather station',
    ];
    countPluralNames = [
      'Satellites',
      'Radars',
      'Files',
      'Weather stations',
    ];
    dashboardIcons = [
      'satellite',
      'track_changes',
      'description',
      'timeline',
    ];
  } else if (app === 'kf') {
    appname = 'Gabriella Miller Kids First Pediatric Data Coordinating Center Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#A51C30', name: 'home' },
      { icon: 'search', link: '/query', color: '#2D728F', name: 'query' },
      { icon: 'class', link: '/DD', color: '#A51C30', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#2D728F', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#A51C30', name: 'data' },
    ];
    countNames = [
      'Case',
      'Trio',
      'File',
      'Aliquot',
    ];
    countPluralNames = [
      'Cases',
      'Trios',
      'Files',
      'Aliquots',
    ];
    localTheme = {
      'barGraph.lineColor': '#DFDFDF',
      'barGraph.bar1Color': '#00ADEE',
      'barGraph.bar2Color': '#BE1E2D',
      'summary.borderTopColor': '#F6921E',
      'summary.borderColor': '#DFDFDF',
      'summary.countColor': '#F6921E',
      'summary.iconColor': '#00ADEE',
      'projectTable.summaryRowColor': '#DFDFDF',
      'projectTable.submitButtonColor': '#DFDFDF',
      tableBarColor: '#CC3399',
    };
  } else if (app === 'bhc') {
    appname = 'The Brain Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#A51C30', name: 'home' },
      { icon: 'collections', link: 'https://data.braincommons.org/bhc', color: '#a2a2a2', name: 'exploration' },
      { icon: 'search', link: '/query', color: '#2D728F', name: 'query' },
      { icon: 'class', link: '/DD', color: '#A51C30', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#2D728F', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#A51C30', name: 'data' },
      { icon: 'dvr', link: 'https://data.braincommons.org/workspace', color: '#a2a2a2', name: 'workspace' },
      { icon: 'dvr', link: 'https://demo.braincommons.org/', color: '#a2a2a2', name: 'demo' },
    ];
    countNames = [
      'Case',
      'Study',
      'File',
      'Aliquot',
    ];
    countPluralNames = [
      'Cases',
      'Studies',
      'Files',
      'Aliquots',
    ];
    localTheme = {
      'barGraph.lineColor': '#666666',
      'barGraph.bar1Color': '#6193b1',
      'barGraph.bar2Color': '#94af83',
      'summary.borderTopColor': '#94af83',
      'summary.borderColor': '#222222',
      'summary.countColor': '#d00000',
      'summary.iconColor': '#7aa19b',
      'projectTable.summaryRowColor': '#565656',
      'projectTable.submitButtonColor': '#dddddd',
      tableBarColor: '#7d7474',
    };
  } else if (app === 'acct') {
    appname = 'ACCOuNT Data Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
    ];
  } else if (app === 'genomel') {
    appname = 'GenoMEL Data Commons Portal';
    const userapiPathOut = 'https://login.bionimbus.org/';
    credentialCdisPath = `${userapiPath}credentials/cdis/`;
    login = {
      url: `${userapiPathOut}login/shib?redirect=`,
      title: 'Login from NIH',
    };
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa520', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#a2a2a2', name: 'data' },
    ];
  } else if (app === 'ndh') {
    appname = 'Genomic Data Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#a2a2a2', name: 'home' },
      { icon: 'search', link: '/query', color: '#daa5Z20', name: 'query' },
      { icon: 'class', link: '/DD', color: '#a2a2a2', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: 'https://ndh-portal.bionimbus.org', color: '#a2a2a2', name: 'data' },
    ];
    countNames = [
      'Subject',
      'Study',
      'Socio-demographic record',
      'Lab record',
    ];
    countPluralNames = [
      'Subjects',
      'Studies',
      'Socio-demographic records',
      'Lab records',
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
    countNames = [
      'Case',
      'Study',
      'File',
      'Aliquot',
    ];
    countPluralNames = [
      'Cases',
      'Studies',
      'Files',
      'Aliquots',
    ];
  } else {
    appname = 'Generic Data Commons Portal';
    navItems = [
      { icon: 'home', link: '/', color: '#1d3674', name: 'home' },
      { icon: 'search', link: '/query', color: '#ad7e1c', name: 'query' },
      { icon: 'class', link: '/DD', color: '#1d3674', name: 'dictionary' },
      { icon: 'face', link: '/identity', color: '#daa520', name: 'profile' },
      { icon: 'content_copy', link: '/files', color: '#1d3674', name: 'data' },
    ];
    countNames = [
      'Case',
      'Experiment',
      'File',
      'Aliquot',
    ];
    countPluralNames = [
      'Cases',
      'Experiments',
      'Files',
      'Aliquots',
    ];
  }

  const conf = {
    dev,
    mockStore,
    app,
    basename,
    hostname,
    userapiPath,
    apiPath,
    submissionApiPath,
    submissionApiOauthPath,
    credentialCdisPath,
    graphqlPath,
    graphqlSchemaUrl,
    appname,
    navItems,
    countNames,
    countPluralNames,
    dashboardIcons,
    localTheme,
    login,
    requiredCerts,
    buildConfig,
  };
  return conf;
}

const defaultConf = buildConfig();
// Commonjs style export, so can load from nodejs into data/gqlSetup
module.exports = defaultConf;
