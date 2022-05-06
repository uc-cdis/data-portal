(function () {
  const basename = document.currentScript.getAttribute('basename');
  const { pathname } = location;
  const isDevMode = !!pathname.match(/^.*(\/dev\.html)/);
  let buildSrc = '/bundle.js';
  if (isDevMode) {
    if (basename && basename !== '/') {
      buildSrc = `https://localhost:9443${basename}/bundle.js`;
    } else {
      buildSrc = 'https://localhost:9443/bundle.js';
    }
  } else if (basename && basename !== '/') {
    buildSrc = `${basename}/bundle.js`;
  }
  // create buildSrc node in body
  const scriptNode = document.createElement('script');
  scriptNode.src = buildSrc;
  scriptNode.type = 'text/javascript';
  document.body.appendChild(scriptNode);
  // create theme override node in body
  const themeOverridesSrc = (basename && basename !== '/') ? `${basename}/src/css/themeoverrides.css` : '/src/css/themeoverrides.css';
  let linkNode = document.createElement('link');
  linkNode.href = themeOverridesSrc;
  linkNode.type = 'text/css';
  linkNode.id = 'gen3-theme-overrides';
  linkNode.rel = 'stylesheet';
  document.body.appendChild(linkNode);
  // create local theme override node in body
  const localThemeOverridesSrc = (basename && basename !== '/') ? `https://localhost:9443${basename}/src/css/themeoverrides.css` : 'https://localhost:9443/src/css/themeoverrides.css';
  linkNode = document.createElement('link');
  linkNode.href = localThemeOverridesSrc;
  linkNode.type = 'text/css';
  linkNode.rel = 'stylesheet';
  document.body.appendChild(linkNode);
  // create stylesheet-less node in head
  const stylesheetLessSrc = (basename && basename !== '/') ? `${basename}/src/css/base.less` : '/src/css/base.less';
  linkNode = document.createElement('link');
  linkNode.href = stylesheetLessSrc;
  linkNode.type = 'text/css';
  linkNode.rel = 'stylesheet/less';
  linkNode.media = 'all';
  document.head.appendChild(linkNode);
  // create graphiql stylesheet node in head
  const stylesheetSrc = (basename && basename !== '/') ? `${basename}/src/css/graphiql.css` : '/src/css/graphiql.css';
  linkNode = document.createElement('link');
  linkNode.href = stylesheetSrc;
  linkNode.type = 'text/css';
  linkNode.rel = 'stylesheet';
  linkNode.media = 'all';
  document.head.appendChild(linkNode);
  // create favicon  node in head
  const faviconSrc = (basename && basename !== '/') ? `${basename}/src/img/favicon.ico` : '/src/img/favicon.ico';
  linkNode = document.createElement('link');
  linkNode.href = faviconSrc;
  linkNode.type = 'image/png';
  linkNode.rel = 'icon';
  document.head.appendChild(linkNode);
}());
