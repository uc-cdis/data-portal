/*
* Buttons are grouped by their dropdownId value.
* This function calculates and groups buttons under the same dropdown,
* and return a map of dropdown ID and related infos for that dropdown:
*   cnt: how many buttons under this dropdown
*   dropdownConfig: infos for this dropdown, e.g. "title"
*   buttonConfigs: a list of button configs (includes buttion title, button type, etc.)
*/
import pluralize from 'pluralize';

export const calculateDropdownButtonConfigs = (config) => {
  const dropdownConfig = config
    && config.dropdowns
    && Object.keys(config.dropdowns).length > 0
    && Object.keys(config.dropdowns)
      .reduce((map, dropdownId) => {
        const buttonCount = config.buttons
          .filter(btnCfg => btnCfg.enabled)
          .filter(btnCfg => btnCfg.dropdownId && btnCfg.dropdownId === dropdownId)
          .length;
        const drpdnCfg = config.dropdowns[dropdownId];
        const buttonConfigs = config.buttons
          .filter(btnCfg => btnCfg.enabled)
          .filter(btnCfg => btnCfg.dropdownId && btnCfg.dropdownId === dropdownId);
        const ret = Object.assign({}, map);
        ret[dropdownId] = {
          cnt: buttonCount,
          dropdownConfig: drpdnCfg,
          buttonConfigs,
        };
        return ret;
      }, {});
  return dropdownConfig;
};

/*
* Humanize a number
* @param {number} number - a integer to convert
* @param {number} fixedPoint - fixzed point position
* @returns {string|number} the humanized number
*/
export const humanizeNumber = (number, fixedPoint = 2) => {
  const largeNumberNames = {
    1: 'K', // Thousand, 10^3
    2: 'M', // Milliion, 10^6
    3: 'B', // Billion, 10^9
    4: 'T', // Trillion, 10^12
    5: 'Qa', // Quadrillion, 10^15
  };
  if (number < 1000) {
    return number;
  }
  for (let i = 5; i >= 1; i -= 1) {
    if (number > (1000 ** i)) {
      return `${Number.parseFloat(number / (1000 ** i)).toFixed(fixedPoint)}${largeNumberNames[i]}`;
    }
  }

  // 10^15+, number is too large
  return Number.parseFloat(number).toExponential(fixedPoint);
};

/*
* Convert label to pluralized (optional title case)
* @param {label} string - a label to convert to title
* @param {titleCase} boolean - Should first letter be capitalized default false
* @returns {string} Pluralized formatted word
*/
export const labelToPlural = (label, titleCase = false) => {
  const pluralizedLabel = pluralize(label);
  if (titleCase) {
    return pluralizedLabel.charAt(0).toUpperCase() + pluralizedLabel.slice(1);
  }
  return pluralizedLabel.toLowerCase();
};

// TODO: delete this stack overflow approach and use btoa instead
// Base 64 encode/decode utilities
// Source: https://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

export const base64Encode = (stringToEncode) => {
  // TODO: use btoa instead
  return Base64.encode(stringToEncode);
}

export const base64Decode = (stringToDecode) => {
  return atob(stringToDecode);
}

export const getQueryParameter = (key) => {
  // Stable method to get query parameter for given key
  let decoded = decodeURIComponent(window.location.search)
  .replace('?', '')
  .split('&')
  .map(param => param.split('='))
  .reduce((values, [ key, value ]) => {
    values[ key ] = value
    return values
  }, {});

  return decoded[key];
}

export const IsValidJSONString = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
