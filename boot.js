(function() {
  const buildSrc = sessionStorage.getItem( "locaDevMode" ) !== "true" ? "/bundle.js" : "https://localhost/bundle.js";
  const scriptNode = document.createElement( 'script' );
  scriptNode.src = buildSrc;
  scriptNode.type = "text/javascript";
  document.body.appendChild( scriptNode );
})();
