const { components, requiredCerts, config } = require('./params');

/**
 * Setup configuration variables based on the "app" the data-portal is
 * being deployed into (Brain Health Commons, Blood Pack, ...)
 *
 * @param {app, dev, basename, mockStore, hostname} opts overrides for defaults
 */
function buildConfig(opts) {
  const hostnameValue = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const hostnameParts = hostnameValue.split('.');
  const hLen = hostnameParts.length;
  const hostnameNoSubdomain = (hLen > 2) ? hostnameParts.splice(hLen - 2).join('.') : hostnameValue;

  const defaults = {
    dev: !!(process.env.NODE_ENV && process.env.NODE_ENV === 'dev'),
    mockStore: !!(process.env.MOCK_STORE && process.env.MOCK_STORE === 'true'),
    app: process.env.APP || 'generic',
    basename: process.env.BASENAME || '/',
    protocol: typeof window !== 'undefined' ? `${window.location.protocol}` : 'http:',
    hostnameOnly: typeof window !== 'undefined' ? hostnameNoSubdomain : 'localhost',
    hostname: typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}/` : 'http://localhost/',
    fenceURL: process.env.FENCE_URL,
    indexdURL: process.env.INDEXD_URL,
    arboristURL: process.env.ARBORIST_URL,
    wtsURL: process.env.WTS_URL,
    workspaceURL: process.env.WORKSPACE_URL,
    manifestServiceURL: process.env.MANIFEST_SERVICE_URL,
    gaDebug: !!(process.env.GA_DEBUG && process.env.GA_DEBUG === 'true'),
    tierAccessLevel: process.env.TIER_ACCESS_LEVEL || 'private',
    tierAccessLimit: Number.parseInt(process.env.TIER_ACCESS_LIMIT, 10) || 1000,
    mapboxAPIToken: process.env.MAPBOX_API_TOKEN,
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
    protocol,
    hostnameOnly,
    hostname,
    fenceURL,
    indexdURL,
    arboristURL,
    wtsURL,
    workspaceURL,
    manifestServiceURL,
    gaDebug,
    tierAccessLevel,
    tierAccessLimit,
    mapboxAPIToken,
  } = Object.assign({}, defaults, opts);

  function ensureTrailingSlash(url) {
    const u = new URL(url);
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
  let userapiPath = typeof fenceURL === 'undefined' ? `${hostname}user/` : ensureTrailingSlash(fenceURL);
  const jobapiPath = `${hostname}job/`;
  const credentialCdisPath = `${userapiPath}credentials/cdis/`;
  const coreMetadataPath = `${hostname}coremetadata/`;
  const indexdPath = typeof indexdURL === 'undefined' ? `${hostname}index/` : ensureTrailingSlash(indexdURL);
  const wtsPath = typeof wtsURL === 'undefined' ? `${hostname}wts/oauth2/` : ensureTrailingSlash(wtsURL);
  const externalLoginOptionsUrl = `${hostname}wts/external_oidc/`;
  let login = {
    url: `${userapiPath}login/google?redirect=`,
    title: 'Login from Google',
  };
  const authzPath = typeof arboristURL === 'undefined' ? `${hostname}authz` : `${arboristURL}authz`;
  const authzMappingPath = typeof arboristURL === 'undefined' ? `${hostname}authz/mapping` : `${arboristURL}authz/mapping`;
  const loginPath = `${userapiPath}login/`;
  const logoutInactiveUsers = !(process.env.LOGOUT_INACTIVE_USERS === 'false');
  const useIndexdAuthz = !(process.env.USE_INDEXD_AUTHZ === 'false');
  const workspaceTimeoutInMinutes = process.env.WORKSPACE_TIMEOUT_IN_MINUTES || 480;
  const graphqlSchemaUrl = `${hostname}data/schema.json`;
  const workspaceUrl = typeof workspaceURL === 'undefined' ? '/lw-workspace/' : ensureTrailingSlash(workspaceURL);
  const workspaceErrorUrl = '/no-workspace-access/';
  const workspaceOptionsUrl = `${workspaceUrl}options`;
  const workspaceStatusUrl = `${workspaceUrl}status`;
  const workspaceTerminateUrl = `${workspaceUrl}terminate`;
  const workspaceLaunchUrl = `${workspaceUrl}launch`;
  const datasetUrl = `${hostname}api/search/datasets`;
  const guppyUrl = `${hostname}guppy`;
  const guppyGraphQLUrl = `${guppyUrl}/graphql/`;
  const guppyDownloadUrl = `${guppyUrl}/download`;
  const manifestServiceApiPath = typeof manifestServiceURL === 'undefined' ? `${hostname}manifests/` : ensureTrailingSlash(manifestServiceURL);
  const auspiceUrl = `${protocol}//auspice.${hostnameOnly}/covid19`;
  // backward compatible: homepageChartNodes not set means using graphql query,
  // which will return 401 UNAUTHORIZED if not logged in, thus not making public
  let indexPublic = true;
  if (typeof components.index.homepageChartNodes === 'undefined') {
    indexPublic = false;
  }

  let useGuppyForExplorer = false;

  let explorerConfig = [];
  let useNewExplorerConfigFormat = false;
  // for backward compatibilities
  if (config.dataExplorerConfig) {
    explorerConfig.push(
      {
        tabTitle: 'Data',
        ...config.dataExplorerConfig,
      },
    );
    if (config.dataExplorerConfig.guppyConfig) {
      useGuppyForExplorer = true;
    }
  }
  if (config.fileExplorerConfig) {
    explorerConfig.push(
      {
        tabTitle: 'File',
        ...config.fileExplorerConfig,
      },
    );
    useGuppyForExplorer = true;
  }

  // new explorer config format
  if (config.explorerConfig) {
    useGuppyForExplorer = true;
    useNewExplorerConfigFormat = true;
    explorerConfig = config.explorerConfig;
  }

  const dataAvailabilityToolConfig = config.dataAvailabilityToolConfig;

  let showArboristAuthzOnProfile = false;
  if (config.showArboristAuthzOnProfile) {
    showArboristAuthzOnProfile = config.showArboristAuthzOnProfile;
  }

  let showFenceAuthzOnProfile = true;
  if (config.showFenceAuthzOnProfile === false) {
    showFenceAuthzOnProfile = config.showFenceAuthzOnProfile;
  }

  let useArboristUI = false;
  if (config.useArboristUI) {
    useArboristUI = config.useArboristUI;
  }

  let terraExportWarning;
  if (config.terraExportWarning) {
    terraExportWarning = config.terraExportWarning;
  }

  let homepageChartNodesChunkSize = 15;
  if (components.index.homepageChartNodesChunkSize) {
    homepageChartNodesChunkSize = components.index.homepageChartNodesChunkSize;
  }

  // for "libre" data commons, explorer page is public
  let explorerPublic = false;
  if (tierAccessLevel === 'libre') {
    explorerPublic = true;
  }
  if (config.featureFlags && config.featureFlags.explorerPublic) {
    explorerPublic = true;
  }

  const enableResourceBrowser = !!config.resourceBrowser;
  let resourceBrowserPublic = false;
  if (config.resourceBrowser && config.resourceBrowser.public) {
    resourceBrowserPublic = true;
  }

  const covid19DashboardConfig = config.covid19DashboardConfig;
  const enableCovid19Dashboard = !!(covid19DashboardConfig &&
    Object.keys(covid19DashboardConfig).length > 0);
  if (covid19DashboardConfig) {
    covid19DashboardConfig.dataUrl = ensureTrailingSlash(covid19DashboardConfig.dataUrl || '');
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
  const fenceDownloadPath = `${userapiPath}data/download`;

  const defaultLineLimit = 30;
  const lineLimit = (config.lineLimit == null) ? defaultLineLimit : config.lineLimit;

  const analysisApps = {
    ndhHIV: {
      title: 'NDH HIV Classifier',
      description: 'Classify stored clinical data based on controller status.',
      image: '/src/img/analysis-icons/hiv-classifier.svg',
      visitIndexTypeName: config.HIVAppIndexTypeName || 'follow_up',
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
    homepageChartNodesChunkSize,
    customHomepageChartConfig: components.index.customHomepageChartConfig,
    datasetUrl,
    indexPublic,
    fenceDownloadPath,
    guppyUrl,
    guppyGraphQLUrl,
    guppyDownloadUrl,
    manifestServiceApiPath,
    wtsPath,
    externalLoginOptionsUrl,
    useGuppyForExplorer,
    showArboristAuthzOnProfile,
    showFenceAuthzOnProfile,
    useArboristUI,
    terraExportWarning,
    analysisApps,
    tierAccessLevel,
    tierAccessLimit,
    useIndexdAuthz,
    explorerPublic,
    authzPath,
    authzMappingPath,
    enableResourceBrowser,
    resourceBrowserPublic,
    explorerConfig,
    useNewExplorerConfigFormat,
    dataAvailabilityToolConfig,
    enableCovid19Dashboard,
    covid19DashboardConfig,
    mapboxAPIToken,
    auspiceUrl,
  };
}

const defaultConf = buildConfig();
// Commonjs style export, so can load from nodejs into data/gqlSetup
module.exports = defaultConf;
