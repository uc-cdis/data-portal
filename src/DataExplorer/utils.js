
/*
* Check if an object as chain of keys
* obj - object
* keyChainString - keys separated by dotf
* return: boolean, whether object as keys
* e.g.: obj={ a: { b: {c: 1 } } }, keyChainString='a.b.c', return true
* e.g.: obj={ a: { b: 1 } }, keyChainString='a.b.c', return false
*/
export const hasKeyChain = (obj, keyChainString) => {
  if (!obj) return false;
  const keyList = keyChainString.split('.');
  if (keyList.length === 0) return false;
  let o = obj;
  for (let i = 0; i < keyList.length; i += 1) {
    const key = keyList[i];
    if (o[key] === undefined) {
      return false;
    }
    o = o[key];
  }
  return true;
};

/*
* Buttons are grouped by their dropdownId value.
* This function calculates and groups buttons under the same dropdown,
* and return a map of dropdown ID and related infos for that dropdown:
*   cnt: how many buttons under this dropdown
*   dropdownConfig: infos for this dropdown, e.g. "title"
*   buttonConfigs: a list of button configs (includes buttion title, button type, etc.)
*/
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
