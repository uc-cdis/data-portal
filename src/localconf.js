const dev = (process.env.NODE_ENV && process.env.NODE_ENV == 'dev');
const mock_store = (process.env.MOCK_STORE && process.env.MOCK_STORE == 'true');

const app = (process.env.APP === undefined) ? 'bpa' : process.env.APP;
const basename = (process.env.BASENAME === undefined) ? '/' : process.env.BASENAME;
let hostname, userapi_path, submissionapi_path, submissionapi_oauth_path, credential_path, credential_oauth_path, credential_cdis_path, graphql_path, appname, nav_items, login, graphql_schema_url;
let required_certs = [];

hostname = `${window.location.protocol}//${window.location.hostname}/`;

if (app === 'bpa') {
  required_certs = dev === true ? [] : [];
  userapi_path = hostname + 'user/';
  submissionapi_path = hostname + 'api/v0/submission/';
  submissionapi_oauth_path = hostname + 'api/v0/oauth2/';
  credential_path = hostname + 'middleware/aws/v0/access_key/';
  credential_oauth_path = hostname + 'middleware/oauth2/v0/';
  credential_cdis_path = userapi_path + 'credentials/cdis/';
  graphql_path = hostname + 'api/v0/submission/graphql/';
  graphql_schema_url = hostname + '/data/schema.json';
  appname = 'BPA Metadata Submission Portal';
  nav_items = [
    {'icon': 'home', 'link': '/', 'color': '#a2a2a2', 'name': 'home'},
    {'icon': 'search', 'link': '/query', 'color': '#daa520', 'name': 'query'},
    {'icon': 'class', 'link': '/DD', 'color': '#a2a2a2', 'name': 'dictionary'},
    {'icon': 'face', 'link': '/identity', 'color': '#daa520', 'name': 'profile'},
    {'icon': 'content_copy', 'link': '/files', 'color': '#a2a2a2', 'name': 'data'}
  ];
  login = {
    url: userapi_path + 'login/google' + '?redirect=',
    title: 'Login from Google'
  };
} else if (app === 'edc') {
  required_certs = [];
  userapi_path = hostname + 'user/';
  submissionapi_path = hostname + 'api/v0/submission/';
  submissionapi_oauth_path = hostname + 'api/v0/oauth2/';
  credential_path = hostname + 'middleware/aws/v0/access_key/';
  credential_oauth_path = hostname + 'middleware/oauth2/v0/';
  credential_cdis_path = userapi_path + 'credentials/cdis/';
  graphql_path = hostname + 'api/v0/submission/graphql/';
  graphql_schema_url = hostname + '/data/schema.json';
  appname = 'Environmental Data Commons Portal';
  nav_items = [
    {'icon': 'home', 'link': '/', 'color': '#a2a2a2', 'name': 'home'},
    {'icon': 'search', 'link': '/query', 'color': '#daa520', 'name': 'query'},
    {'icon': 'class', 'link': '/DD', 'color': '#a2a2a2', 'name': 'dictionary'},
    {'icon': 'face', 'link': '/identity', 'color': '#daa520', 'name': 'profile'},
    {'icon': 'content_copy', 'link': '/files', 'color': '#a2a2a2', 'name': 'data'}
  ];
  login = {
    url: userapi_path + 'login/google' + '?redirect=',
    title: 'Login from Google'
  };
} else if (app === 'bhc') {
  required_certs = [];
  userapi_path = hostname + 'user/';
  submissionapi_path = hostname + 'api/v0/submission/';
  submissionapi_oauth_path = hostname + 'api/v0/oauth2/';
  credential_path = hostname + 'middleware/aws/v0/access_key/';
  credential_oauth_path = hostname + 'middleware/oauth2/v0/';
  credential_cdis_path = userapi_path + 'credentials/cdis/';
  graphql_path = hostname + 'api/v0/submission/graphql/';
  graphql_schema_url = hostname + '/data/schema.json';
  appname = 'The Brain Commons Portal';
  nav_items = [
    {'icon': 'home', 'link': '/', 'color': '#A51C30', 'name': 'home'},
    {'icon': 'search', 'link': '/query', 'color': '#2D728F', 'name': 'query'},
    {'icon': 'class', 'link': '/DD', 'color': '#A51C30', 'name': 'dictionary'},
    {'icon': 'face', 'link': '/identity', 'color': '#2D728F', 'name': 'profile'},
    {'icon': 'content_copy', 'link': '/files', 'color': '#a2a2a2', 'name': 'data'}
  ];
  login = {
    url: userapi_path + 'login/google' + '?redirect=',
    title: 'Login from Google'
  };
} else if (app === 'acct'){
  required_certs = [];
  userapi_path = hostname + 'user/';
  submissionapi_path = hostname + 'api/v0/submission/';
  submissionapi_oauth_path = hostname + 'api/v0/oauth2/';
  credential_path = hostname + 'middleware/aws/v0/';
  credential_oauth_path = hostname + 'middleware/oauth2/v0/';
  credential_cdis_path = userapi_path + 'credentials/cdis/';
  graphql_path = hostname + 'api/v0/submission/graphql/';
  graphql_schema_url = hostname + '/data/schema.json';
  appname = 'ACCOuNT Data Commons Portal';
  nav_items = [
    {'icon': 'home', 'link': '/', 'color': '#a2a2a2', 'name': 'home'},
    {'icon': 'search', 'link': '/query', 'color': '#daa520', 'name': 'query'},
    {'icon': 'class', 'link': '/DD', 'color': '#a2a2a2', 'name': 'dictionary'},
    {'icon': 'face', 'link': '/identity', 'color': '#daa520', 'name': 'profile'},
    {'icon': 'content_copy', 'link': '/files', 'color': '#a2a2a2', 'name': 'data'}
  ];
  login = {
    url: userapi_path + 'login/google' + '?redirect=',
    title: 'Login from Google'
  };
} else if (app ==='gdc') {
  userapi_path = dev === true ? hostname + 'user/' : hostname + 'api/';
  credential_path = userapi_path + 'credentials/cleversafe/';
  credential_oauth_path = userapi_path + 'oauth2/';
  credential_cdis_path = userapi_path + 'credentials/cdis/';
  graphql_schema_url = hostname + 'data/schema.json';
  appname = 'GDC Jamboree Portal';
  nav_items = [
    {'icon': 'home', 'link': '/', 'color': '#a2a2a2', 'name': 'home'}
  ];
  login = {
    url: 'https://itrusteauth.nih.gov/affwebservices/public/saml2sso?SPID=https://bionimbus-pdc.opensciencedatacloud.org/shibboleth&RelayState=',
    title: 'Login from NIH'
  };
} else {
  required_certs = [];
  userapi_path = hostname + 'user/';
  submissionapi_path = hostname + 'api/v0/submission/';
  submissionapi_oauth_path = hostname + 'api/v0/oauth2/';
  credential_path = hostname + 'middleware/aws/v0/';
  credential_oauth_path = hostname + 'middleware/oauth2/v0/';
  credential_cdis_path = userapi_path + 'credentials/cdis/';
  graphql_path = hostname + 'api/v0/submission/graphql/';
  graphql_schema_url = hostname + '/data/schema.json';
  appname = 'Generic Data Commons Portal';
  nav_items = [
    {'icon': 'home', 'link': '/', 'color': '#1d3674', 'name': 'home'},
    {'icon': 'search', 'link': '/query', 'color': '#ad7e1c', 'name': 'query'},
    {'icon': 'class', 'link': '/DD', 'color': '#1d3674', 'name': 'dictionary'},
    {'icon': 'face', 'link': '/identity', 'color': '#daa520', 'name': 'profile'},
    {'icon': 'content_copy', 'link': '/files', 'color': '#1d3674', 'name': 'data'}
  ];
  login = {
    url: userapi_path + 'login/google' + '?redirect=',
    title: 'Login from Google'
  };
}

export {
  dev,
  mock_store,
  app,
  basename,
  hostname,
  userapi_path,
  submissionapi_path,
  submissionapi_oauth_path,
  credential_path,
  credential_oauth_path,
  credential_cdis_path,
  graphql_path,
  graphql_schema_url,
  appname,
  nav_items,
  login,
  required_certs,
};
