(function () {
  const isDevMode = !!location.pathname.match(/^\/dev.html/);
  const buildSrc = isDevMode ? 'https://localhost/bundle.js' : '/bundle.js';
  const scriptNode = document.createElement('script');
  scriptNode.src = buildSrc;
  scriptNode.type = 'text/javascript';
  document.body.appendChild(scriptNode);
}());
