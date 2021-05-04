
function buildConfig(opts) {
  const defaults = {
    mapboxAPIToken: process.env.MAPBOX_API_TOKEN,
  };

  const {
    mapboxAPIToken,
  } = Object.assign({}, defaults, opts);

  return {
    mapboxAPIToken,
  };
}

const defaultConf = buildConfig();
module.exports = defaultConf;
