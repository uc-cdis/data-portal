/**
 * @typedef {Object} Link
 * @property {Link[]} [subgroup]
 * @property {string} target_type
 */

/**
 * Get subgroup links from link.
 * Traverse links recursively and return all nested subgroup lnks.
 * @param {Link} link - array of links
 * @param {{ [name: string]: any }} nameToNode - key (node name) value (node object) map
 * @param {string} sourceId - source id for subgroup links
 * @returns {Array}
 */
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

/**
 * Given a data dictionary that defines a set of nodes and edges,
 * returns the nodes and edges in correct format
 * @param {Object} props: Object (normally taken from redux state) that includes
 * dictionary property defining the dictionary as well as other optional
 * properties such as counts_search and links_search (created by getCounts)
 * with information about the number of each type (node) and link (between
 * nodes with a link's source and target types) that actually exist in the data
 * @param {Object} props.dictionary
 * @param {{ [key: string]: number }} props.counts_search
 * @param {{ [key: string]: number }} props.links_search
 * @param {boolean} createAll: Include all nodes and edges or only those that
 * are populated in counts_search and links_search
 * @param {string[]} [nodesToHide] Array of nodes to hide from graph
 * @returns {{ nodes: Array; edges: Array }} Object containing nodes and edges
 */
export function createNodesAndEdges(
  props,
  createAll,
  nodesToHide = ['program']
) {
  const {
    dictionary,
    counts_search: countsSearch,
    links_search: linksSearch,
  } = props;

  const nodes = [];
  for (const key of Object.keys(dictionary)) {
    const isValidNode =
      !key.startsWith('_') &&
      dictionary[key].type === 'object' &&
      dictionary[key].category !== 'internal' &&
      !nodesToHide.includes(key);

    if (isValidNode) {
      const searchKey = `_${key}_count`;
      const count = countsSearch?.[searchKey] ?? 0;

      if (createAll || count !== 0)
        nodes.push({ count, name: dictionary[key].title, ...dictionary[key] });
    }
  }

  const nameToNode = {};
  for (const node of nodes) nameToNode[node.id] = node;

  const hideDb = {};
  for (const name of nodesToHide) hideDb[name] = true;

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
      for (const link of newLinks) {
        const isValidEdge =
          link.target &&
          link.target.id in nameToNode &&
          !(link.target.id in hideDb);

        if (isValidEdge) {
          const searchKey = `${link.source.id}_${link.name}_to_${link.target.id}_link`;
          const exists = linksSearch?.[searchKey];

          if (createAll || exists || exists === undefined)
            newEdges.push({ exists, ...link });
        }
      }

      edges.push(...newEdges);
    }

  return {
    nodes,
    edges,
  };
}

/**
 * Find the root of the given graph (no edges out)
 * @param {{ id: string }[]} nodes
 * @param {{ source: { id: string } | string }[]} edges
 * @return {string} rootName or null if no root
 */
export function findRoot(nodes, edges) {
  /** @type {{ [name: string]: boolean }} */
  const couldBeRoot = {};
  for (const node of nodes) couldBeRoot[node.id] = true;
  for (const edge of edges) {
    const sourceName =
      typeof edge.source === 'object' ? edge.source.id : edge.source;
    if (couldBeRoot[sourceName]) couldBeRoot[sourceName] = false;
  }

  const rootNode = nodes.find(({ id }) => couldBeRoot[id]);
  return rootNode?.id ?? null;
}

/**
 * Recursive helper function for getTreeHierarchy
 * Returns the hierarchy of the tree in the form of a map
 * Each (key, value) consists of (node, node's descendants including the node itself)
 * @param {string} root
 * @param {{ [name:string]: { source: { id: string } | string }[] }} name2EdgesIn
 * @param {Map<string, Set<string>>} hierarchy
 */
function getTreeHierarchyHelper(root, name2EdgesIn, hierarchy) {
  const descendants = /** @type {Set<string>} */ (new Set());
  descendants.add(root);

  hierarchy.set(root, descendants);
  for (const edge of name2EdgesIn[root]) {
    const sourceName =
      typeof edge.source === 'object' ? edge.source.id : edge.source;
    if (!hierarchy.get(sourceName)) {
      // don't want to visit node again
      hierarchy = getTreeHierarchyHelper(sourceName, name2EdgesIn, hierarchy);
      descendants.add(sourceName);
      for (const n of hierarchy.get(sourceName)) descendants.add(n);
    }
  }

  hierarchy.set(root, descendants);
  return hierarchy;
}

/**
 * Returns the hierarchy of the tree in the form of a map
 * Each (key, value) consists of (node, node's descendants including the node itself)
 * @param {string} root
 * @param {{ [name:string]: { source: { id: string } | string }[] }} name2EdgesIn
 */
export function getTreeHierarchy(root, name2EdgesIn) {
  const hierarchy = /** @type {Map<string, Set<string>>} */ (new Map());
  return getTreeHierarchyHelper(root, name2EdgesIn, hierarchy);
}

/**
 * @typedef {Object} NodesBreathFirst
 * @property {string[]} bfOrder array of node names
 * @property {string[][]} treeLevel2Names array of arrays of node names
 * @property {{ [name: string]: number }} name2Level mapping of node name to level
 */

/**
 * Arrange nodes in dictionary graph breadth first, and build level database.
 * If a node links to multiple parents, then place it under the highest parent ...
 * Exported for testing.
 * @param {Array} nodes
 * @param {Array} edges
 * @return {NodesBreathFirst}
 */
export function nodesBreadthFirst(nodes, edges) {
  /** @type {NodesBreathFirst} */
  const result = {
    bfOrder: [],
    treeLevel2Names: [],
    name2Level: {},
  };

  /**
   * mapping of node name to edges that point into that node
   * @type {{ [name: string]: Object[] }}
   */
  const name2EdgesIn = {};
  for (const node of nodes) name2EdgesIn[node.id] = [];
  for (const edge of edges) {
    const targetName =
      typeof edge.target === 'object' ? edge.target.id : edge.target;
    if (Array.isArray(name2EdgesIn[targetName]))
      name2EdgesIn[targetName].push(edge);
    else console.error(`Edge points to unknown node: ${targetName}`);
  }

  // root node has no edges coming out of it, just edges coming in
  const root = findRoot(nodes, edges);
  if (!root) {
    console.log('Could not find root of given graph');
    return result;
  }

  // just to be safe - could be user gives us a graph without a 'project'
  if (!Array.isArray(name2EdgesIn[root])) name2EdgesIn[root] = [];

  const hierarchy = getTreeHierarchy(root, name2EdgesIn);
  const name2ActualLvl = {};
  const preQueue = [{ query: root, level: 0 }];
  // Run through this once to determine the actual level of each node
  for (let head = 0; head < preQueue.length; head += 1) {
    const { query, level } = preQueue[head]; // breadth first
    name2ActualLvl[query] = level;

    for (const edge of name2EdgesIn[query]) {
      const sourceName =
        typeof edge.source === 'object' ? edge.source.id : edge.source;
      const isAncestor = hierarchy.get(sourceName).has(query);

      if (name2EdgesIn[sourceName] && !isAncestor)
        preQueue.push({ query: sourceName, level: level + 1 });
      else {
        console.log(`Edge comes from unknown node ${sourceName}`);
      }
    }
  }

  // account for nodes that link to multiple other nodes
  const processedNodes = new Set();
  const queue = [{ query: root, level: 0 }];
  // Run for real; queue.shift is O(n), so just keep pushing, and move the head
  for (let head = 0; head < queue.length; head += 1) {
    const { query, level } = queue[head]; // breadth first
    result.bfOrder.push(query);
    processedNodes.add(query);

    if (result.treeLevel2Names.length <= level) result.treeLevel2Names.push([]);
    result.treeLevel2Names[level].push(query);
    result.name2Level[query] = level;

    for (const edge of name2EdgesIn[query]) {
      const sourceName =
        typeof edge.source === 'object' ? edge.source.id : edge.source;
      if (
        name2EdgesIn[sourceName] &&
        !processedNodes.has(sourceName) &&
        name2ActualLvl[sourceName] === level + 1
      ) {
        // edge source has not yet been processed via another link from
        // the source to a node higher in the graph
        processedNodes.add(sourceName); // don't double-queue a node
        queue.push({ query: sourceName, level: level + 1 });
      } else {
        console.log(`Edge comes from unknown node ${sourceName}`);
      }
    }
  }

  return result;
}

/**
 * Decorate the nodes of a graph with a position based on the node's position in the graph
 * Exported for testing.  Decorates nodes with position property array [x,y] on a [0,1) space
 * @param {Array} nodes
 * @param {Array} edges
 * @param {{ breadthFirstInfo?: NodesBreathFirst; numPerRow?: number }} [opts]
 * breadthFirstInfo is output from nodesBreadthFirst; otherwise call it ourselves,
 * numPerRow specifies number of nodes per row if we want a grid under the root
 * rather than the tree structure
 */
export function assignNodePositions(nodes, edges, opts) {
  const breadthFirstInfo =
    opts?.breadthFirstInfo ?? nodesBreadthFirst(nodes, edges);

  // the tree has some number of levels with some number of nodes each,
  // but we may want to break each level down into multiple rows
  const row2Names = /** @type {string[][]} */ ([]);
  if (!opts?.numPerRow) row2Names.push(...breadthFirstInfo.treeLevel2Names);
  else
    for (const node of breadthFirstInfo.bfOrder)
      if (
        row2Names.length < 2 ||
        row2Names[row2Names.length - 1].length >= opts.numPerRow
      )
        // put the root node on its own level
        row2Names.push([node]);

  const name2Node = {};
  for (const node of nodes) name2Node[node.id] = node;

  // Assign a (x,y) position in [0,1) space to each node based on its level in the tree
  for (const [level, nodesAtLevel] of row2Names.entries())
    for (const [posAtLevel, nodeName] of nodesAtLevel.entries()) {
      const posX = (posAtLevel + 1) / (nodesAtLevel.length + 1);
      const posY = (level + 1) / (row2Names.length + 1);

      const node = name2Node[nodeName];
      node.position = [posX, posY];
      node.positionIndex = [posAtLevel, level];
    }

  return breadthFirstInfo;
}

/**
 * convert graph structure to string using DOT language
 * DOT Language ref: http://www.graphviz.org/doc/info/lang.html
 * @param {Array} nodes
 * @param {Array} edges
 * @params {Object} treeLevel2Names - levels and nodes in each level, {levelNum:[nodeNameList]}
 * @returns {string} graph translated into DOT language
 */
const buildGraphVizDOTString = (nodes, edges, treeLevel2Names) => {
  const whRatio = 1;
  const canvasSize = 5;
  const nodeWidth = 1.2;
  const nodeHeight = 0.8;
  let graphString = 'digraph dictionary {\n';
  graphString += `size="${canvasSize}, ${canvasSize}"\n`;
  graphString += `ratio=${whRatio}\n`;
  nodes.forEach((node) => {
    graphString += `${node.id} [type="${node.category}" \
label="${node.name}" \
fixedsize=true width=${nodeWidth} height=${nodeHeight} \
shape=rectangle
]\n`;
  });
  edges.forEach((edge) => {
    graphString += `${edge.source.id} -> ${edge.target.id}[arrowhead=none tailport=s ]\n`;
  });
  if (treeLevel2Names) {
    treeLevel2Names.forEach((IDsInThisLevel, i) => {
      graphString += `{rank=${i} ${IDsInThisLevel.join(' ')}}\n`;
    });
  }
  graphString += '}';
  return graphString;
};

export function createDotStrinByNodesEdges(nodes, edges) {
  const posInfo = assignNodePositions(nodes, edges);
  const dotString = buildGraphVizDOTString(
    nodes,
    edges,
    posInfo.treeLevel2Names
  );
  return dotString;
}
