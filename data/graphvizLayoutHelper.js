// COPYING: src/GraphUtils/utils > getSubgroupLinks
function getSubgroupLinks(link, nameToNode, sourceId) {
  if (!link.subgroup) return [];

  const subgroupLinks = [];
  for (const sgLink of link.subgroup)
    if (sgLink.subgroup)
      subgroupLinks.push(...getSubgroupLinks(sgLink, nameToNode, sourceId));
    else
      subgroupLinks.push({
        source: nameToNode[sourceId],
        target: nameToNode[sgLink.target_type],
        exists: 1,
        ...sgLink,
      });

  return subgroupLinks;
}

// MODIFYING: src/GraphUtils/utils > createNodesAndEdges
// Simplifies the original to use dictionary only
function createNodesAndEdges(dictionary) {
  const nodes = [];
  for (const key of Object.keys(dictionary))
    if (
      !key.startsWith('_') &&
      dictionary[key].type === 'object' &&
      dictionary[key].category !== 'internal'
    )
      nodes.push({ count: 0, name: dictionary[key].title, ...dictionary[key] });

  const nameToNode = {};
  for (const node of nodes) nameToNode[node.id] = node;

  const edges = [];
  for (const node of nodes)
    if (node.links?.length > 0) {
      const newLinks = [];
      for (const link of node.links) {
        const newLink = {
          source: node,
          target: nameToNode[link.target_type],
          exists: 1,
          ...link,
        };

        if (newLink.target) newLinks.push(newLink);
        if (newLink.subgroup)
          newLinks.push(...getSubgroupLinks(newLink, nameToNode, node.id));
      }

      const newEdges = [];
      for (const link of newLinks)
        if (link.target && link.target.id in nameToNode) newEdges.push(link);

      edges.push(...newEdges);
    }

  return { nodes, edges };
}

// COPYING: src/GraphUtils/utils > findRoot
function findRoot(nodes, edges) {
  const couldBeRoot = {};
  for (const node of nodes) couldBeRoot[node.id] = true;
  for (const edge of edges) {
    const sourceName =
      typeof edge.source === 'object' ? edge.source.id : edge.source;
    if (couldBeRoot[sourceName]) couldBeRoot[sourceName] = false;
  }

  const rootNode = nodes.find(({ id }) => couldBeRoot[id]);
  return rootNode?.id ?? '';
}

// COPYING: src/GraphUtils/utils > getTreeHierarchyHelper
function getTreeHierarchyHelper(root, name2EdgesIn, hierarchy) {
  let _hierarcy = hierarchy;
  const descendants = new Set();
  descendants.add(root);

  _hierarcy.set(root, descendants);
  for (const edge of name2EdgesIn[root]) {
    const sourceName =
      typeof edge.source === 'object' ? edge.source.id : edge.source;
    if (!_hierarcy.get(sourceName)) {
      _hierarcy = getTreeHierarchyHelper(sourceName, name2EdgesIn, _hierarcy);
      descendants.add(sourceName);
      for (const n of _hierarcy.get(sourceName)) descendants.add(n);
    }
  }

  _hierarcy.set(root, descendants);
  return _hierarcy;
}

// COPYING: src/GraphUtils/utils > getTreeHierarchy
function getTreeHierarchy(root, name2EdgesIn) {
  const hierarchy = new Map();
  return getTreeHierarchyHelper(root, name2EdgesIn, hierarchy);
}

// MODYFYING: src/GraphUtils/utils > nodesBreadthFirst
// Simplifies the original to output treeLevel2Names only
function getTreeLevel2Names(nodes, edges) {
  const treeLevel2Names = [];

  const name2EdgesIn = {};
  for (const node of nodes) name2EdgesIn[node.id] = [];
  for (const edge of edges) {
    const targetName =
      typeof edge.target === 'object' ? edge.target.id : edge.target;
    if (Array.isArray(name2EdgesIn[targetName]))
      name2EdgesIn[targetName].push(edge);
  }

  const root = findRoot(nodes, edges);
  if (!root) {
    console.log('Could not find root of given graph');
    return treeLevel2Names;
  }

  if (!Array.isArray(name2EdgesIn[root])) name2EdgesIn[root] = [];

  const hierarchy = getTreeHierarchy(root, name2EdgesIn);
  const name2ActualLvl = {};
  const preQueue = [{ query: root, level: 0 }];
  for (let head = 0; head < preQueue.length; head += 1) {
    const { query, level } = preQueue[head];
    name2ActualLvl[query] = level;

    for (const edge of name2EdgesIn[query]) {
      const sourceName =
        typeof edge.source === 'object' ? edge.source.id : edge.source;
      const isAncestor = hierarchy.get(sourceName).has(query);

      if (name2EdgesIn[sourceName] && !isAncestor)
        preQueue.push({ query: sourceName, level: level + 1 });
    }
  }

  const processedNodes = new Set();
  const queue = [{ query: root, level: 0 }];
  for (let head = 0; head < queue.length; head += 1) {
    const { query, level } = queue[head];
    processedNodes.add(query);

    if (treeLevel2Names.length <= level) treeLevel2Names.push([]);
    treeLevel2Names[level].push(query);

    for (const edge of name2EdgesIn[query]) {
      const sourceName =
        typeof edge.source === 'object' ? edge.source.id : edge.source;
      if (
        name2EdgesIn[sourceName] &&
        !processedNodes.has(sourceName) &&
        name2ActualLvl[sourceName] === level + 1
      ) {
        processedNodes.add(sourceName);
        queue.push({ query: sourceName, level: level + 1 });
      }
    }
  }

  return treeLevel2Names;
}

function createDotStringFromDictionary(dictionary) {
  const { nodes, edges } = createNodesAndEdges(dictionary);
  const treeLevel2Names = getTreeLevel2Names(nodes, edges);

  let dotString = `digraph dictionary {\n  size="5, 5"\n  ratio=1\n\n`;

  for (const node of nodes)
    dotString += `  ${node.id} [type="${node.category}" label="${node.name}" \
fixedsize=true width=1.2 height=0.8 shape=rectangle]\n`;
  dotString += '\n';

  for (const edge of edges)
    dotString += `  ${edge.source.id} -> ${edge.target.id}[arrowhead=none tailport=s ]\n`;
  dotString += '\n';

  for (const [i, names] of treeLevel2Names.entries())
    dotString += `  {rank=${i} ${names.join(' ')}}\n`;

  dotString += '}';
  return dotString;
}

module.exports = {
  createDotStringFromDictionary,
};
