const { components, requiredCerts, config } = require('./params');

/**
 * Setup configuration variables based on the "app" the data-portal is
 * being deployed into (Brain Health Commons, Blood Pack, ...)
 *
 * @param {Object} opts overrides for defaults
 */
function buildConfig(opts) {
  const defaults = {
    mockStore: process.env.MOCK_STORE === 'true',
    app: process.env.APP ?? 'generic',
    basename: process.env.BASENAME ?? '/',
    hostname:
      typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}/`
        : 'http://localhost/',
    fenceURL: process.env.FENCE_URL,
    indexdURL: process.env.INDEXD_URL,
    arboristURL: process.env.ARBORIST_URL,
    wtsURL: process.env.WTS_URL,
    workspaceURL: process.env.WORKSPACE_URL,
    manifestServiceURL: process.env.MANIFEST_SERVICE_URL,
    gaDebug: process.env.GA_DEBUG === 'true',
  };

  // Override default basename if loading via /dev.html
  // dev.html loads bundle.js via https://localhost...
  if (window?.location.pathname.startsWith(`${defaults.basename}dev.html`))
    defaults.basename += 'dev.html';

  const {
    mockStore,
    app,
    basename,
    hostname,
    fenceURL,
    indexdURL,
    arboristURL,
    wtsURL,
    workspaceURL,
    manifestServiceURL,
    gaDebug,
  } = Object.assign(defaults, opts);

  function ensureTrailingSlash(url) {
    const u = new URL(url);
    u.pathname += u.pathname.endsWith('/') ? '' : '/';
    u.hash = '';
    u.search = '';
    return u.href;
  }

  const submissionApiPath = `${hostname}api/v0/submission/`;
  const apiPath = `${hostname}api/`;
  const graphqlPath = `${hostname}api/v0/submission/graphql/`;
  const dataDictionaryTemplatePath = `${hostname}api/v0/submission/template/`;
  const userapiPath =
    typeof fenceURL === 'undefined'
      ? `${hostname}user/`
      : ensureTrailingSlash(fenceURL);
  const jobapiPath = `${hostname}job/`;
  const credentialCdisPath = `${userapiPath}credentials/cdis/`;
  const coreMetadataPath = `${hostname}coremetadata/`;
  const indexdPath =
    typeof indexdURL === 'undefined'
      ? `${hostname}index/`
      : ensureTrailingSlash(indexdURL);
  const wtsPath =
    typeof wtsURL === 'undefined'
      ? `${hostname}wts/oauth2/`
      : ensureTrailingSlash(wtsURL);
  const externalLoginOptionsUrl = `${hostname}wts/external_oidc/`;
  const login = {
    url: `${userapiPath}login/google?redirect=`,
    title: 'Login from Google',
  };
  const authzPath =
    typeof arboristURL === 'undefined'
      ? `${hostname}authz`
      : `${arboristURL}authz`;
  const loginPath = `${userapiPath}login/`;
  const logoutInactiveUsers = process.env.LOGOUT_INACTIVE_USERS !== 'false';
  const useIndexdAuthz = process.env.USE_INDEXD_AUTHZ !== 'false';
  const workspaceTimeoutInMinutes =
    process.env.WORKSPACE_TIMEOUT_IN_MINUTES || 480;
  const graphqlSchemaUrl = `${hostname}data/schema.json`;
  const workspaceUrl =
    typeof workspaceURL === 'undefined'
      ? '/lw-workspace/'
      : ensureTrailingSlash(workspaceURL);
  const workspaceErrorUrl = '/no-workspace-access/';
  const workspaceOptionsUrl = `${workspaceUrl}options`;
  const workspaceStatusUrl = `${workspaceUrl}status`;
  const workspaceTerminateUrl = `${workspaceUrl}terminate`;
  const workspaceLaunchUrl = `${workspaceUrl}launch`;
  const datasetUrl = `${hostname}api/search/datasets`;
  const guppyUrl = `${hostname}guppy`;
  const guppyGraphQLUrl = `${guppyUrl}/graphql/`;
  const guppyDownloadUrl = `${guppyUrl}/download`;
  const manifestServiceApiPath =
    typeof manifestServiceURL === 'undefined'
      ? `${hostname}manifests/`
      : ensureTrailingSlash(manifestServiceURL);

  const showFenceAuthzOnProfile = config.showFenceAuthzOnProfile ?? true;
  const { terraExportWarning } = config;
  const enableResourceBrowser = config.resourceBrowser ?? true;
  const resourceBrowserPublic = config.resourceBrowser?.public ?? false;

  const colorsForCharts = {
    categorical9Colors: components.categorical9Colors ?? [
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
    categorical2Colors: components.categorical2Colors ?? ['#3283c8', '#e7e7e7'],
  };

  const fenceDownloadPath = `${userapiPath}data/download`;

  const defaultLineLimit = 30;
  const lineLimit = config.lineLimit ?? defaultLineLimit;

  const breakpoints = {
    laptop: 1024,
    tablet: 820,
    mobile: 480,
  };

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-csrf-token': document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken=") && row.length > "csrftoken=".length)
      ?.split("=")[1],
  };

  return {
    app,
    basename,
    breakpoints,
    buildConfig,
    hostname,
    gaDebug,
    userapiPath,
    jobapiPath,
    apiPath,
    submissionApiPath,
    credentialCdisPath,
    coreMetadataPath,
    indexdPath,
    graphqlPath,
    dataDictionaryTemplatePath,
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
    datasetUrl,
    fenceDownloadPath,
    guppyUrl,
    guppyGraphQLUrl,
    guppyDownloadUrl,
    manifestServiceApiPath,
    wtsPath,
    externalLoginOptionsUrl,
    showFenceAuthzOnProfile,
    terraExportWarning,
    useIndexdAuthz,
    authzPath,
    enableResourceBrowser,
    resourceBrowserPublic,
    explorerConfig: config.explorerConfig,
    headers,
    contactEmail: 'pcdc_help@lists.uchicago.edu',
  };
}

const defaultConf = buildConfig();
// Commonjs style export, so can load from nodejs into data/getGqlHelper
module.exports = defaultConf;
