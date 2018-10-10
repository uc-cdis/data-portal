
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
export const calculateDropdownButtonConfigs = (explorerTableConfig) => {
  const dropdownConfig = explorerTableConfig
    && explorerTableConfig.dropdowns
    && Object.keys(explorerTableConfig.dropdowns).length > 0
    && Object.keys(explorerTableConfig.dropdowns)
      .reduce((map, dropdownId) => {
        const buttonCount = explorerTableConfig.buttons
          .filter(btnCfg => btnCfg.enabled)
          .filter(btnCfg => btnCfg.dropdownId && btnCfg.dropdownId === dropdownId)
          .length;
        const drpdnCfg = explorerTableConfig.dropdowns[dropdownId];
        const buttonConfigs = explorerTableConfig.buttons
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
