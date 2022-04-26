/**
 * @param {Object} args
 * @param {string} args.field
 * @param {import("../types").ExplorerFilters} args.filter
 */
export function pluckFromFilter({ field, filter }) {
  const newFilter = {};
  for (const [key, value] of Object.entries(filter))
    if (key !== field) newFilter[key] = value;

  return newFilter;
}

/**
 * @param {Object} args
 * @param {string} args.anchor
 * @param {string} args.field
 * @param {import("../types").ExplorerFilters} args.filter
 */
export function pluckFromAnchorFilter({ anchor, field, filter }) {
  const newFilter = {};
  for (const [key, value] of Object.entries(filter))
    if (key !== anchor) newFilter[key] = value;
    else if (typeof value === 'object' && 'filter' in value) {
      const newAnchorFilter = pluckFromFilter({ field, filter: value.filter });
      if (Object.keys(newAnchorFilter).length > 0)
        newFilter[key] = { filter: newAnchorFilter };
    }

  return newFilter;
}
