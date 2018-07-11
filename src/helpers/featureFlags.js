/* To set a feature flag:

In the browser dev tools console, type:
`sessionStorage.setItem('gen3Features', JSON.stringify({ 'featureName': true }))`
(replace 'featureName' with the feature to be enabled.)

To verify it was set correctly, use:
`JSON.parse(sessionStorage.getItem('gen3Features'))['featureMame']
*/

function isEnabled(featureName) {
  const featureFlags = JSON.parse(window.sessionStorage.getItem('gen3Features')) || {};
  return !! featureFlags[featureName];
}

export default isEnabled;
