export const dev = (process.env.NODE_ENV && process.env.NODE_ENV == 'dev');
export const basename = '/';
export const hostname = dev == true ? 'http://api.bloodpac-data.org/' : 'https://data.bloodpac.org/';
export const userapi_path = hostname + 'user/';
export const submissionapi_path = hostname + 'api/v0/submission/';
export const submissionapi_oauth_path = hostname + 'api/v0/oauth2/';
export const graphql_path = hostname + 'api/v0/submission/graphql/';
export const appname = 'Bionimbus';
