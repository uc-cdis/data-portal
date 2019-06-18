const { components, requiredCerts, config } = require('./params');

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
    fenceURL: process.env.FENCE_URL,
    indexdURL: process.env.INDEXD_URL,
    gaDebug: !!(process.env.GA_DEBUG && process.env.GA_DEBUG === 'true'),
    tierAccessLevel: process.env.TIER_ACCESS_LEVEL || 'private',
    tierAccessLimit: Number.parseInt(process.env.TIER_ACCESS_LIMIT, 10) || 1000,
  };

  //
  // Override default basename if loading via /dev.html
  // dev.html loads bundle.js via https://localhost...
  //
  if (typeof location !== 'undefined' && location.pathname.indexOf(`${defaults.basename}dev.html`) === 0) {
    defaults.basename += 'dev.html';
  }

  const {
    dev,
    mockStore,
    app,
    basename,
    hostname,
    fenceURL,
    indexdURL,
    gaDebug,
    tierAccessLevel,
    tierAccessLimit,
  } = Object.assign({}, defaults, opts);

  function ensureTailingSlash(url) {
    let u = new URL(url);
    u.pathname += u.pathname.endsWith('/') ? '' : '/';
    u.hash = '';
    u.search = '';
    return u.href;
  }

  const submissionApiPath = `${hostname}api/v0/submission/`;
  const apiPath = `${hostname}api/`;
  const submissionApiOauthPath = `${hostname}api/v0/oauth2/`;
  const graphqlPath = `${hostname}api/v0/submission/graphql/`;
  const dataDictionaryTemplatePath = `${hostname}api/v0/submission/template/`;
  const arrangerGraphqlPath = `${hostname}api/v0/flat-search/search/graphql`;
  let userapiPath = typeof fenceURL === 'undefined' ? `${hostname}user/` : ensureTailingSlash(fenceURL);
  const jobapiPath = `${hostname}job/`;
  const credentialCdisPath = `${userapiPath}credentials/cdis/`;
  const coreMetadataPath = `${hostname}coremetadata/`;
  const indexdPath = typeof indexdURL === 'undefined' ? `${hostname}index/` : ensureTailingSlash(indexdURL);
  const wtsPath = `${hostname}wts/oauth2/`;
  let login = {
    url: `${userapiPath}login/google?redirect=`,
    title: 'Login from Google',
  };
  const loginPath = `${userapiPath}login/`;
  const logoutInactiveUsers = !(process.env.LOGOUT_INACTIVE_USERS === 'false');
  const workspaceTimeoutInMinutes = process.env.WORKSPACE_TIMEOUT_IN_MINUTES || 480;
  const graphqlSchemaUrl = `${hostname}data/schema.json`;
  const workspaceUrl = '/lw-workspace/';
  const workspaceErrorUrl = '/no-workspace-access/';
  const workspaceOptionsUrl = `${workspaceUrl}options`;
  const workspaceStatusUrl = `${workspaceUrl}status`;
  const workspaceTerminateUrl = `${workspaceUrl}terminate`;
  const workspaceLaunchUrl = `${workspaceUrl}launch`;
  const datasetUrl = `${hostname}api/search/datasets`;
  const guppyUrl = `${hostname}guppy`;
  const guppyGraphQLUrl = `${guppyUrl}/graphql/`;
  const manifestServiceApiPath = `${hostname}manifests/`;
  // backward compatible: homepageChartNodes not set means using graphql query,
  // which will return 401 UNAUTHORIZED if not logged in, thus not making public
  let indexPublic = true;
  if (typeof components.index.homepageChartNodes === 'undefined') {
    indexPublic = false;
  }

  let useGuppyForExplorer = false;
  if (config.dataExplorerConfig.guppyConfig) {
    useGuppyForExplorer = true;
  }

  // for "libre" data commons, explorer page is public
  let explorerPublic = false;
  if (tierAccessLevel === 'libre') {
    explorerPublic = true;
  }

  const colorsForCharts = {
    categorical9Colors: components.categorical9Colors ? components.categorical9Colors : [
      '#3283c8',
      '#7ec500',
      '#ad91ff',
      '#f4b940',
      '#e74c3c',
      '#05b8ee',
      '#ff7abc',
      '#ef8523',
      '#26d9b1',
    ],
    categorical2Colors: components.categorical2Colors ? components.categorical2Colors : [
      '#3283c8',
      '#e7e7e7',
    ],
  };

  if (app === 'gdc' && typeof fenceURL === 'undefined') {
    userapiPath = dev === true ? `${hostname}user/` : `${hostname}api/`;
    login = {
      url: 'https://itrusteauth.nih.gov/affwebservices/public/saml2sso?SPID=https://bionimbus-pdc.opensciencedatacloud.org/shibboleth&RelayState=',
      title: 'Login from NIH',
    };
  }

  const defaultLineLimit = 30;
  const lineLimit = (config.lineLimit == null) ? defaultLineLimit : config.lineLimit;

  const analysisApps = {
    ndhHIV: {
      title: 'NDH HIV Classifier',
      description: 'Classify stored clinical data based on controller status.',
      image: '/src/img/analysis-icons/hiv-classifier.svg',
    },
    ndhVirus: {
      title: 'NDH Virulence Simulation',
      description: `This simulation runs a docker version of the Hypothesis Testing
          using Phylogenies (HyPhy) tool over data submitted in the NIAID Data Hub. \n
          The simulation is focused on modeling a Bayesian Graph Model (BGM) based on a binary matrix input.
          The implemented example predicts the virulence status of different influenza strains based on their mutations
          (the mutation panel is represented as the input binary matrix).`,
      image: '/src/img/analysis-icons/virulence.png',
    },
    vaGWAS: {
      title: 'eGWAS',
      description: 'Expression-based Genome-Wide Association Study',
      image: '/src/img/analysis-icons/gwas.svg',
      options: [
        {
          label: 'Lung',
          value: 'Lung',
        },
        {
          label: 'Gastrointestina',
          value: 'Gastrointestina',
        },
        {
          label: 'Prostate',
          value: 'Prostate',
        },
        {
          label: 'Head and Neck',
          value: 'Head and Neck',
        },
        {
          label: 'Skin',
          value: 'Skin',
        },
        {
          label: 'NULL',
          value: 'NULL',
        },
        {
          label: 'Lymph Node',
          value: 'Lymph Node',
        },
        {
          label: 'Liver',
          value: 'Liver',
        },
        {
          label: 'Musculoskeleta',
          value: 'Musculoskeleta',
        },
        {
          label: 'Occipital Mass',
          value: 'Occipital Mass',
        },
        {
          label: 'Brain',
          value: 'Brain',
        },
        {
          label: 'BxType',
          value: 'BxType',
        },
      ],
    },
  };

  const breakpoints = {
    laptop: 1024,
    tablet: 820,
    mobile: 480,
  };

  return {
    app,
    basename,
    breakpoints,
    buildConfig,
    dev,
    hostname,
    gaDebug,
    userapiPath,
    jobapiPath,
    apiPath,
    submissionApiPath,
    submissionApiOauthPath,
    credentialCdisPath,
    coreMetadataPath,
    indexdPath,
    graphqlPath,
    dataDictionaryTemplatePath,
    arrangerGraphqlPath,
    graphqlSchemaUrl,
    appname: components.appName,
    mockStore,
    colorsForCharts,
    login,
    loginPath,
    logoutInactiveUsers,
    workspaceTimeoutInMinutes,
    requiredCerts,
    lineLimit,
    certs: components.certs,
    workspaceUrl,
    workspaceErrorUrl,
    workspaceOptionsUrl,
    workspaceStatusUrl,
    workspaceLaunchUrl,
    workspaceTerminateUrl,
    homepageChartNodes: components.index.homepageChartNodes,
    datasetUrl,
    indexPublic,
    guppyUrl,
    guppyGraphQLUrl,
    manifestServiceApiPath,
    wtsPath,
    useGuppyForExplorer,
    analysisApps,
    tierAccessLevel,
    tierAccessLimit,
    explorerPublic,
  };
}

const defaultConf = buildConfig();
// Commonjs style export, so can load from nodejs into data/gqlSetup
module.exports = defaultConf;
