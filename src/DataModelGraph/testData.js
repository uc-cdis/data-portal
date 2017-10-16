
/**
 * Little helper for building test data
 */
export function buildTestData() {
  const nodes = ['project', 'a', 'b', 'c', 'd', 'x', 'y', 'z']
    .map(name => ({ name, links: [], type: 'object' }));
  const edges = [
    { source: 'b', name: 'projProp', target: 'project' },
    { source: 'a', name: 'bProp', target: 'b' }, { source: 'c', name: 'bProp', target: 'b' },
    { source: 'x', name: 'bProp', target: 'b' }, { source: 'y', name: 'bProp', target: 'b' },
    { source: 'd', name: 'cProp', target: 'c' }, { source: 'd', name: 'projProp', target: 'project' },
  ];
  const nodeCounts = nodes.map((nd, i) => ({ key: `_${nd.name}_count`, value: i+1 }) )
    .reduce((db, entry) => { db[entry.key] = entry.value; return db; }, {});
  // 0 'z' nodes
  nodeCounts._z_count = 0;
  const linkCounts = edges.map((edg, i) => ({ key: `${edg.source}_${edg.name}_to_${edg.target}_link`, value: i+1 }))
    .reduce((db, entry) => { db[entry.key] = entry.value; return db; }, {});
  const dictionary = nodes.reduce((db,nd) => { db[nd.name] = nd; return db; }, {});
  edges.map(edg => ({ source: dictionary[ edg.source ], edg }))
    .filter(({ source }) => !!source)
    .forEach(({ source, edg }) => {
      dictionary[ source.name ].links.push( { name: edg.name, target_type: edg.target } );
    });
  return { dictionary, nodes, edges, counts_search: nodeCounts, links_search: linkCounts };
}
