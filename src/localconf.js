import crawlers from 'crawler-user-agents';

/* eslint-disable prefer-destructuring */
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
    hostnameWithSubdomain: hostnameValue,
    fenceURL: process.env.FENCE_URL,
    indexdURL: process.env.INDEXD_URL,
    cohortMiddlewareURL: process.env.COHORT_MIDDLEWARE_URL,
    gwasWorkflowURL: process.env.GWAS_WORKFLOW_URL,
    arboristURL: process.env.ARBORIST_URL,
    wtsURL: process.env.WTS_URL,
    workspaceURL: process.env.WORKSPACE_URL,
    manifestServiceURL: process.env.MANIFEST_SERVICE_URL,
    requestorURL: process.env.REQUESTOR_URL,
    tierAccessLevel: process.env.TIER_ACCESS_LEVEL || 'private',
    tierAccessLimit: Number.parseInt(process.env.TIER_ACCESS_LIMIT, 10) || 1000,
    mapboxAPIToken: process.env.MAPBOX_API_TOKEN,
    ddApplicationId: process.env.DATADOG_APPLICATION_ID,
    ddClientToken: process.env.DATADOG_CLIENT_TOKEN,
    bundle: process.env.GEN3_BUNDLE,
  };

  //
  // Override default basename if loading via /dev.html
  // dev.html loads bundle.js via https://localhost...
  //
  const ensureTrailingSlashBasename = `${defaults.basename}${defaults.basename.endsWith('/') ? '' : '/'}`;
  if (typeof window.location !== 'undefined' && window.location.pathname.indexOf(`${ensureTrailingSlashBasename}dev.html`) === 0) {
    defaults.basename = `${ensureTrailingSlashBasename}dev.html`;
  }

  const {
    dev,
    mockStore,
    app,
    basename,
    protocol,
    hostnameOnly,
    hostname,
    hostnameWithSubdomain,
    fenceURL,
    indexdURL,
    cohortMiddlewareURL,
    gwasWorkflowURL,
    arboristURL,
    wtsURL,
    workspaceURL,
    manifestServiceURL,
    requestorURL,
    tierAccessLevel,
    tierAccessLimit,
    mapboxAPIToken,
    ddApplicationId,
    ddClientToken,
    bundle,
  } = { ...defaults, ...opts };

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
  const peregrineVersionPath = `${hostname}api/search/_version`;
  const dataDictionaryTemplatePath = `${hostname}api/v0/submission/template/`;
  let userAPIPath = typeof fenceURL === 'undefined' ? `${hostname}user/` : ensureTrailingSlash(fenceURL);
  const jobAPIPath = `${hostname}job/`;
  const credentialCdisPath = `${userAPIPath}credentials/cdis/`;

  const coreMetadataPath = `${hostname}api/search/coremetadata/`;
  const coreMetadataLegacyPath = `${hostname}coremetadata/`;

  const indexdPath = typeof indexdURL === 'undefined' ? `${hostname}index/` : ensureTrailingSlash(indexdURL);

  const cohortMiddlewarePath = typeof cohortMiddlewareURL === 'undefined' ? `${hostname}cohort-middleware/` : ensureTrailingSlash(cohortMiddlewareURL);
  const gwasWorkflowPath = typeof gwasWorkflowURL === 'undefined' ? `${hostname}ga4gh/wes/v2/` : ensureTrailingSlash(gwasWorkflowURL);

  const wtsPath = typeof wtsURL === 'undefined' ? `${hostname}wts/oauth2/` : ensureTrailingSlash(wtsURL);
  const wtsAggregateAuthzPath = `${hostname}wts/aggregate/authz/mapping`;
  const externalLoginOptionsUrl = `${hostname}wts/external_oidc/`;
  let login = {
    url: `${userAPIPath}login/google?redirect=`,
    title: 'Login from Google',
  };
  const authzPath = typeof arboristURL === 'undefined' ? `${hostname}authz` : `${arboristURL}authz`;
  const authzMappingPath = typeof arboristURL === 'undefined' ? `${hostname}authz/mapping` : `${arboristURL}authz/mapping`;
  const loginPath = `${userAPIPath}login/`;
  const logoutInactiveUsers = !(process.env.LOGOUT_INACTIVE_USERS === 'false');
  const useIndexdAuthz = !(process.env.USE_INDEXD_AUTHZ === 'false');
  const workspaceTimeoutInMinutes = process.env.WORKSPACE_TIMEOUT_IN_MINUTES || 480;
  const cleanBasename = basename.replace(/^\/+/g, '').replace(/(dev.html$)/, '').replace(/\/$/, '');
  const graphqlSchemaUrl = `${hostname}${cleanBasename}/data/schema.json`;
  const workspaceUrl = typeof workspaceURL === 'undefined' ? '/lw-workspace/' : ensureTrailingSlash(workspaceURL);
  const workspaceErrorUrl = '/no-workspace-access/';
  const Error403Url = '/403error';
  const workspaceOptionsUrl = `${workspaceUrl}options`;
  const workspaceStatusUrl = `${workspaceUrl}status`;
  const workspacePayModelUrl = `${workspaceUrl}paymodels`;
  const workspaceSetPayModelUrl = `${workspaceUrl}setpaymodel`;
  const workspaceAllPayModelsUrl = `${workspaceUrl}allpaymodels`;
  const workspaceTerminateUrl = `${workspaceUrl}terminate`;
  const workspaceLaunchUrl = `${workspaceUrl}launch`;
  const datasetUrl = `${hostname}api/search/datasets`;
  const guppyUrl = `${hostname}guppy`;
  const guppyGraphQLUrl = `${guppyUrl}/graphql`;
  const guppyDownloadUrl = `${guppyUrl}/download`;
  const manifestServiceApiPath = typeof manifestServiceURL === 'undefined' ? `${hostname}manifests/` : ensureTrailingSlash(manifestServiceURL);
  const requestorPath = typeof requestorURL === 'undefined' ? `${hostname}requestor/` : ensureTrailingSlash(requestorURL);
  const auspiceUrl = `${protocol}//auspice.${hostnameOnly}/covid19`;
  const auspiceUrlIL = `${protocol}//auspice.${hostnameOnly}/covid19/il`;
  const workspaceStorageUrl = `${hostname}ws-storage`;
  const workspaceStorageListUrl = `${workspaceStorageUrl}/list`;
  const workspaceStorageDownloadUrl = `${workspaceStorageUrl}/download`;
  const marinerUrl = `${hostname}ga4gh/wes/v1/runs`;
  const enableDAPTracker = !!config.DAPTrackingURL;

  // datadog related setup
  let ddEnv = 'PROD';
  if (hostnameOnly.includes('qa-')) {
    ddEnv = 'QA';
  } else if (hostnameOnly.includes('planx-pla.net')) {
    ddEnv = 'DEV';
  }
  if (config.ddEnv) {
    ddEnv = config.ddEnv;
  }
  let ddUrl = 'datadoghq.com';
  if (config.ddUrl) {
    ddUrl = config.ddUrl;
  }
  let ddSampleRate = 100;
  if (config.ddSampleRate) {
    if (Number.isNaN(config.ddSampleRate)) {
      // eslint-disable-next-line no-console
      console.warn('Datadog sampleRate value in Portal config is not a number, ignoring');
    } else {
      ddSampleRate = config.ddSampleRate;
    }
  }
  const ddKnownBotPattern = crawlers.map((c) => c.pattern).join('|');
  const ddKnownBotRegex = new RegExp(ddKnownBotPattern, 'i');

  // backward compatible: homepageChartNodes not set means using graphql query,
  // which will return 401 UNAUTHORIZED if not logged in, thus not making public
  let indexPublic = true;
  if (typeof components.index.homepageChartNodes === 'undefined') {
    indexPublic = false;
  }

  let studyViewerConfig = [];
  if (config.studyViewerConfig) {
    studyViewerConfig = [...config.studyViewerConfig];
    const validOpenOptions = ['open-first', 'open-all', 'close-all'];
    studyViewerConfig.forEach((cfg, i) => {
      if (cfg.openMode
        && !validOpenOptions.includes(cfg.openMode)) {
        studyViewerConfig[i].openMode = 'open-all';
      }
    });
  }

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
  }
  if (config.fileExplorerConfig) {
    explorerConfig.push(
      {
        tabTitle: 'File',
        ...config.fileExplorerConfig,
      },
    );
  }

  // new explorer config format
  if (config.explorerConfig) {
    useNewExplorerConfigFormat = true;
    explorerConfig = config.explorerConfig;
  }

  // Two tiered-access options: site-wide and index-scoped.
  // Tiered access is index-scoped if all guppyConfigs in the portal config
  // contain a tierAccessLevel.
  let indexScopedTierAccessMode = true;
  explorerConfig.forEach((item) => {
    if (!item.guppyConfig || !item.guppyConfig.tierAccessLevel) {
      indexScopedTierAccessMode = false;
    }
  });

  const { dataAvailabilityToolConfig, stridesPortalURL, gaTrackingId } = config;

  let showSystemUse = false;
  if (components.systemUse && components.systemUse.systemUseText) {
    showSystemUse = true;
  }
  let showSystemUseOnlyOnLogin = false;
  if (components.systemUse && components.systemUse.showOnlyOnLogin) {
    showSystemUseOnlyOnLogin = true;
  }

  let showArboristAuthzOnProfile = false;
  if (config.showArboristAuthzOnProfile) {
    showArboristAuthzOnProfile = config.showArboristAuthzOnProfile;
  }

  let gwasTemplate = 'gwas-template-latest';
  if (config.argoTemplate) {
    gwasTemplate = config.argoTemplate;
  }

  let showFenceAuthzOnProfile = true;
  if (config.showFenceAuthzOnProfile === false) {
    showFenceAuthzOnProfile = config.showFenceAuthzOnProfile;
  }

  let showExternalLoginsOnProfile = false;
  if (config.showExternalLoginsOnProfile === true) {
    showExternalLoginsOnProfile = config.showExternalLoginsOnProfile;
  }

  let hideSubmissionIfIneligible = false;
  if (config.hideSubmissionIfIneligible) {
    hideSubmissionIfIneligible = config.hideSubmissionIfIneligible;
  }

  let useArboristUI = false;
  if (config.useArboristUI) {
    useArboristUI = config.useArboristUI;
  }

  let terraExportWarning;
  if (config.terraExportWarning) {
    terraExportWarning = config.terraExportWarning;
  }

  let homepageChartNodesExcludeFiles = false;
  if (components.index.homepageChartNodesExcludeFiles) {
    homepageChartNodesExcludeFiles = components.index.homepageChartNodesExcludeFiles;
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

  let explorerHideEmptyFilterSection = false;
  if (config.featureFlags && config.featureFlags.explorerHideEmptyFilterSection) {
    explorerHideEmptyFilterSection = true;
  }

  let explorerFilterValuesToHide = [];
  if (config.featureFlags && config.featureFlags.explorerFilterValuesToHide) {
    explorerFilterValuesToHide = config.featureFlags.explorerFilterValuesToHide;
  }

  let forceSingleLoginDropdownOptions = [];
  if (config.featureFlags && config.featureFlags.forceSingleLoginDropdownOptions) {
    forceSingleLoginDropdownOptions = config.featureFlags.forceSingleLoginDropdownOptions;
  }

  const enableResourceBrowser = !!config.resourceBrowser;
  let resourceBrowserPublic = false;
  if (config.resourceBrowser && config.resourceBrowser.public) {
    resourceBrowserPublic = true;
  }

  const { covid19DashboardConfig } = config;
  if (covid19DashboardConfig) {
    covid19DashboardConfig.dataUrl = ensureTrailingSlash(covid19DashboardConfig.dataUrl || '');
  }

  const { discoveryConfig } = config;
  const { registrationConfigs } = config;
  const studyRegistrationConfig = (registrationConfigs && registrationConfigs.features)
    ? (registrationConfigs.features.studyRegistrationConfig || {}) : {};
  if (!studyRegistrationConfig.studyRegistrationTrackingField) {
    studyRegistrationConfig.studyRegistrationTrackingField = 'registrant_username';
  }
  if (!studyRegistrationConfig.studyRegistrationValidationField) {
    studyRegistrationConfig.studyRegistrationValidationField = 'is_registered';
  }
  if (!studyRegistrationConfig.studyRegistrationAccessCheckField) {
    studyRegistrationConfig.studyRegistrationAccessCheckField = 'registration_authz';
  }
  if (!studyRegistrationConfig.studyRegistrationUIDField) {
    studyRegistrationConfig.studyRegistrationUIDField = discoveryConfig?.minimalFieldMapping?.uid;
  }
  if (!studyRegistrationConfig.dataDictionaryField) {
    studyRegistrationConfig.dataDictionaryField = '';
  }
  if (!studyRegistrationConfig.cdeMetadataGUIDType) {
    studyRegistrationConfig.cdeMetadataGUIDType = '';
  }
  if (!studyRegistrationConfig.cdeMetadataField) {
    studyRegistrationConfig.cdeMetadataField = '';
  } else if (!studyRegistrationConfig.cdeMetadataInStudyMetadataField) {
    studyRegistrationConfig.cdeMetadataInStudyMetadataField = studyRegistrationConfig.cdeMetadataField;
  }
  const { workspacePageTitle } = config;
  const { workspacePageDescription } = config;
  const workspaceRegistrationConfig = (registrationConfigs && registrationConfigs.features)
    ? registrationConfigs.features.workspaceRegistrationConfig : null;
  const kayakoConfig = registrationConfigs ? registrationConfigs.kayakoConfig : null;

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
    userAPIPath = dev === true ? `${hostname}user/` : `${hostname}api/`;
    login = {
      url: 'https://itrusteauth.nih.gov/affwebservices/public/saml2sso?SPID=https://bionimbus-pdc.opensciencedatacloud.org/shibboleth&RelayState=',
      title: 'Login from NIH',
    };
  }

  const fenceDataPath = `${userAPIPath}data/`;
  const fenceDownloadPath = `${fenceDataPath}download`;

  const defaultLineLimit = 30;
  const lineLimit = (config.lineLimit == null) ? defaultLineLimit : config.lineLimit;

  const { analysisTools } = config;
  const analysisApps = {};
  if (analysisTools) {
    analysisTools.forEach((at) => {
      if (typeof at === 'string' || at instanceof String) {
        switch (at) {
        case 'ndhHIV':
          analysisApps.ndhHIV = {
            title: 'NDH HIV Classifier',
            description: 'Classify stored clinical data based on controller status.',
            image: '/src/img/analysis-icons/hiv-classifier.svg',
            visitIndexTypeName: config.HIVAppIndexTypeName || 'follow_up',
          };
          break;
        case 'ndhVirus':
          analysisApps.ndhVirus = {
            title: 'NDH Virulence Simulation',
            description: `This simulation runs a docker version of the Hypothesis Testing
          using Phylogenies (HyPhy) tool over data submitted in the NIAID Data Hub. \n
          The simulation is focused on modeling a Bayesian Graph Model (BGM) based on a binary matrix input.
          The implemented example predicts the virulence status of different influenza strains based on their mutations
          (the mutation panel is represented as the input binary matrix).`,
            image: '/src/img/analysis-icons/virulence.png',
          };
          break;
        case 'vaGWAS':
          analysisApps.vaGWAS = {
            title: 'vaGWAS',
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
          };
          break;
        default:
          break;
        }
      } else if (at.appId) {
        analysisApps[at.appId] = at;
      } else if (at.title) {
        analysisApps[at.title] = at;
      }
    });
  }

  const breakpoints = {
    laptop: 1024,
    tablet: 820,
    mobile: 480,
  };

  const mdsURL = `${hostname}mds/metadata`;
  const aggMDSURL = `${hostname}mds/aggregate`;
  const aggMDSDataURL = `${aggMDSURL}/metadata`;
  const cedarWrapperURL = `${hostname}cedar`;
  const kayakoWrapperURL = `${hostname}kayako`;

  // Disallow gitops.json configurability of Gen3 Data Commons and CTDS logo alt text.
  // This allows for one point-of-change in the case of future rebranding.
  // Map href or explicit descriptor to alt text.
  const commonsWideAltText = {
    portalLogo: `${components.appName} - home`, // Standardized, accessible logo alt text for all commons
    'https://ctds.uchicago.edu/gen3': 'Gen3 Data Commons - information and resources',
    'https://ctds.uchicago.edu/': 'Center for Translational Data Science at the University of Chicago - information and resources',

  };

  const topNavLogin = !components?.login?.hideNavLink;

  return {
    app,
    basename,
    breakpoints,
    buildConfig,
    gwasTemplate,
    dev,
    hostname,
    hostnameWithSubdomain,
    gaTrackingId,
    userAPIPath,
    jobAPIPath,
    apiPath,
    submissionApiPath,
    credentialCdisPath,
    coreMetadataPath,
    coreMetadataLegacyPath,
    indexdPath,
    cohortMiddlewarePath,
    gwasWorkflowPath,
    graphqlPath,
    peregrineVersionPath,
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
    workspacePayModelUrl,
    workspaceSetPayModelUrl,
    workspaceAllPayModelsUrl,
    workspaceLaunchUrl,
    workspaceTerminateUrl,
    stridesPortalURL,
    homepageChartNodes: components.index.homepageChartNodes,
    homepageChartNodesChunkSize,
    homepageChartNodesExcludeFiles,
    customHomepageChartConfig: components.index.customHomepageChartConfig,
    datasetUrl,
    indexPublic,
    fenceDataPath,
    fenceDownloadPath,
    guppyUrl,
    guppyGraphQLUrl,
    guppyDownloadUrl,
    manifestServiceApiPath,
    wtsPath,
    wtsAggregateAuthzPath,
    externalLoginOptionsUrl,
    showArboristAuthzOnProfile,
    showFenceAuthzOnProfile,
    showExternalLoginsOnProfile,
    hideSubmissionIfIneligible,
    useArboristUI,
    terraExportWarning,
    analysisApps,
    tierAccessLevel,
    tierAccessLimit,
    indexScopedTierAccessMode,
    useIndexdAuthz,
    explorerPublic,
    explorerHideEmptyFilterSection,
    explorerFilterValuesToHide,
    forceSingleLoginDropdownOptions,
    authzPath,
    authzMappingPath,
    enableResourceBrowser,
    resourceBrowserPublic,
    explorerConfig,
    useNewExplorerConfigFormat,
    dataAvailabilityToolConfig,
    requestorPath,
    studyViewerConfig,
    covid19DashboardConfig,
    discoveryConfig,
    kayakoConfig,
    studyRegistrationConfig,
    mapboxAPIToken,
    auspiceUrl,
    auspiceUrlIL,
    workspacePageTitle,
    workspacePageDescription,
    enableDAPTracker,
    workspaceRegistrationConfig,
    workspaceStorageUrl,
    workspaceStorageListUrl,
    workspaceStorageDownloadUrl,
    marinerUrl,
    mdsURL,
    aggMDSDataURL,
    cedarWrapperURL,
    kayakoWrapperURL,
    commonsWideAltText,
    ddApplicationId,
    ddClientToken,
    ddEnv,
    ddUrl,
    ddSampleRate,
    ddKnownBotRegex,
    showSystemUse,
    showSystemUseOnlyOnLogin,
    Error403Url,
    bundle,
    topNavLogin,
  };
}

const defaultConf = buildConfig();
// Commonjs style export, so can load from nodejs into data/gqlSetup
module.exports = defaultConf;
