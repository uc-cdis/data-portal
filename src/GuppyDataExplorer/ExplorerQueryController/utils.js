export function pluckFromFilter({ filter, filterKey }) {
  const newFilter = {};
  for (const [key, value] of Object.entries(filter))
    if (key !== filterKey) newFilter[key] = value;

  return newFilter;
}

export function pluckFromAnchorFilter({ anchor, filter, filterKey }) {
  const newFilter = {};
  for (const [key, value] of Object.entries(filter))
    if (key !== anchor) newFilter[key] = value;
    else if (typeof value === 'object' && 'filter' in value) {
      const newAnchorFilter = pluckFromFilter({
        filter: value.filter,
        filterKey,
      });
      if (Object.keys(newAnchorFilter).length > 0)
        newFilter[key] = { filter: newAnchorFilter };
    }

  return newFilter;
}
