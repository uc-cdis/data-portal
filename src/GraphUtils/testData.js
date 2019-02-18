
/**
 * Little helper for building test data
 */
export const buildTestData = () => {
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

  // add subgrouplinks for node a for test
  dictionary.a.links.push({
    subgroup: [
      {
        name: 'cProp',
        target_type: 'c',
      },
    ],
  });
  dictionary.a.links.push({
    subgroup: [
      {
        subgroup: [
          {
            name: 'xProp',
            target_type: 'x',
          },
        ],
      },
    ],
  });
  dictionary.a.links.push({
    subgroup: [
      {
        subgroup: [
          {
            subgroup: [
              {
                name: 'yProp',
                target_type: 'y',
              },
            ],
          },
        ],
      },
    ],
  });
  const expectedSubgoupLinks = [
    { source: 'a', target: 'c', name: 'cProp' },
    { source: 'a', target: 'x', name: 'xProp' },
    { source: 'a', target: 'y', name: 'yProp' },
  ];
  const expectedTree = [
    ['project'],
    ['b'],
    ['c', 'x', 'y'],
    ['d', 'a'],
  ];
  return {
    dictionary,
    nodes,
    edges: edges.concat(expectedSubgoupLinks),
    counts_search: nodeCounts,
    links_search: linkCounts,
    expectedTree,
  };
};

/** test graph:
 *      A
 *    /  \
 *   B    C
 *  / \  / \
 * D   E    F
 *    / \
 *   G  H
 *   |
 *   I
 *
 * B->A, C->A,
 * D->B, E->B,
 * E->C, F->C
 * G->E, H->E,
 * I->G
 */
export const testGraph1 = {
  graphNodes: [
    {
      id: 'A',
      inLinks: ['B', 'C'],
      outLinks: [],
      type: 't1',
    },
    {
      id: 'B',
      inLinks: ['D', 'E'],
      outLinks: ['A'],
      type: 't2',
    },
    {
      id: 'C',
      inLinks: ['E', 'F'],
      outLinks: ['A'],
      type: 't2',
    },
    {
      id: 'D',
      inLinks: [],
      outLinks: ['B'],
      type: 't3',
    },
    {
      id: 'E',
      inLinks: ['G', 'H'],
      outLinks: ['B', 'C'],
      type: 't3',
    },
    {
      id: 'F',
      inLinks: [],
      outLinks: ['C'],
      type: 't3',
    },
    {
      id: 'G',
      inLinks: ['I'],
      outLinks: ['E'],
      type: 't4',
    },
    {
      id: 'H',
      inLinks: [],
      outLinks: ['E'],
      type: 't4',
    },
    {
      id: 'I',
      inLinks: [],
      outLinks: ['G'],
      type: 't5',
    },
  ],
  graphEdges: [
    { source: 'I', target: 'G' },
    { source: 'G', target: 'E' },
    { source: 'H', target: 'E' },
    { source: 'D', target: 'B' },
    { source: 'E', target: 'B' },
    { source: 'E', target: 'C' },
    { source: 'F', target: 'C' },
    { source: 'B', target: 'A' },
    { source: 'C', target: 'A' },
  ],
  expectedNodeTypes: ['t1', 't2', 't3', 't4', 't5'],
  startingNode: {
    id: 'I',
    inLinks: [],
    outLinks: ['G'],
    type: 't5',
  },
  expectedChildrenNodeIDs: ['G', 'E', 'B', 'C', 'A'],
  expectedChildrenLinks: [
    { source: 'I', target: 'G' },
    { source: 'G', target: 'E' },
    { source: 'E', target: 'B' },
    { source: 'E', target: 'C' },
    { source: 'B', target: 'A' },
    { source: 'C', target: 'A' },
  ],
  testSubgraph: ['I', 'G', 'E', 'B', 'C', 'A'],
  testSubgraphEdges: [
    { source: 'I', target: 'G' },
    { source: 'G', target: 'E' },
    { source: 'E', target: 'B' },
    { source: 'E', target: 'C' },
    { source: 'B', target: 'A' },
    { source: 'C', target: 'A' },
  ],
  expectedArticulationNodesInSubgraph: ['G', 'E'],
  expectedBFSTraverseSubgraph: ['I', 'G', 'E', 'B', 'C', 'A'],
  expectedBFSTraverseSubgraphReverseDirection: ['A', 'B', 'C', 'E', 'G', 'I'],
  testNodeIDsForSort: ['B', 'G', 'A', 'C', 'E', 'I'],
  expectedSorteddNodeIDs: ['I', 'G', 'E', 'B', 'C', 'A'],
  expectedGraphNodesSortedByTopology: ['D', 'I', 'H', 'F', 'B', 'G', 'E', 'C', 'A'],
  testNode1: 'G',
  testNode2: 'A',
  expectedSummary: {
    nodeIDs: ['B', 'C', 'E'],
    links: [
      { source: 'G', target: 'E' },
      { source: 'E', target: 'B' },
      { source: 'E', target: 'C' },
      { source: 'B', target: 'A' },
      { source: 'C', target: 'A' },
    ],
  },
  expectedNodeIDsWithNoInLinks: ['I'],
  expectedNodeIDsWithNoOutLinks: ['A'],
  testClickNode: {
    id: 'E',
    inLinks: ['G', 'H'],
    outLinks: ['B', 'C'],
    type: 't3',
  },
  expectedRelatedNodeIDs: ['E', 'B', 'C', 'A'],
  testSecondClickNodeID: 'B',
  expectedSecondHighlightedPath: [
    { source: 'B', target: 'A' },
    { source: 'E', target: 'B' },
  ],
  expectedDataModelStructure: {
    routesBetweenStartEndNodes: [
      ['A', 'B', 'E', 'G', 'I'],
      ['A', 'C', 'E', 'G', 'I'],
    ],
    dataModelStructure: [
      {
        nodeID: 'A',
        nodeIDsBefore: [],
        linksBefore: [],
        category: 't1',
      },
      {
        nodeID: 'E',
        nodeIDsBefore: ['B', 'C'],
        linksBefore: [
          { source: 'E', target: 'B' },
          { source: 'E', target: 'C' },
          { source: 'B', target: 'A' },
          { source: 'C', target: 'A' },
        ],
        category: 't3',
      },
      {
        nodeID: 'G',
        nodeIDsBefore: [],
        linksBefore: [
          { source: 'G', target: 'E' },
        ],
        category: 't4',
      },
      {
        nodeID: 'I',
        nodeIDsBefore: [],
        linksBefore: [
          { source: 'I', target: 'G' },
        ],
        category: 't5',
      },
    ],
  },
};

