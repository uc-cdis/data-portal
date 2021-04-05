(function () {
  const isDevMode = !!location.pathname.match(/^\/dev.html/);
  const buildSrc = isDevMode
    ? 'https://localhost:9443/main.bundle.js'
    : '/main.bundle.js';
  const scriptNode = document.createElement('script');
  scriptNode.src = buildSrc;
  scriptNode.type = 'text/javascript';
  document.body.appendChild(scriptNode);
})();
