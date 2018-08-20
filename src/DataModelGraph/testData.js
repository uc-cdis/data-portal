
/**
 * Little helper for building test data
 */
function buildTestData() {
  const nodes = ['project', 'a', 'b', 'c', 'd', 'x', 'y', 'z']
    .map(id => ({ id, title: id, links: [], type: 'object' }));
  const nodeCounts = nodes.map((nd, i) => ({ key: `_${nd.id}_count`, value: i + 1 }))
    .reduce((db, entry) => { db[entry.key] = entry.value; return db; }, {});
  // 0 'z' nodes
  nodeCounts._z_count = 0;

  const edges = [
    { source: 'b', name: 'projProp', target: 'project' },
    { source: 'a', name: 'bProp', target: 'b' }, { source: 'c', name: 'bProp', target: 'b' },
    { source: 'x', name: 'bProp', target: 'b' }, { source: 'y', name: 'bProp', target: 'b' },
    { source: 'd', name: 'cProp', target: 'c' }, { source: 'd', name: 'projProp', target: 'project' },
  ];
  const linkCounts = edges.map((edg, i) => ({ key: `${edg.source.id}_${edg.name}_to_${edg.target.id}_link`, value: i + 1 }))
    .reduce((db, entry) => { db[entry.key] = entry.value; return db; }, {});
  const dictionary = nodes.reduce((db, nd) => { const res = db; res[nd.id] = nd; return res; }, {});
  edges.map(
    edg => (
      {
        source: dictionary[edg.source],
        target: dictionary[edg.target],
        edg,
      }), {},
  ).filter(({ source }) => !!source).forEach(({ source, edg }) => {
    dictionary[source.id].links.push({ name: edg.name, target_type: edg.target });
  });
  return { dictionary, nodes, edges, counts_search: nodeCounts, links_search: linkCounts };
}

module.exports = { buildTestData };
