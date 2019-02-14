/**
 * Get subgroup links from link
 * @param {object} link - array of links
 * @param {object} nameToNode - key (node name) value (node object) map
 * @param {string} sourceId - source id for subgroup links
 * This function traverse links recursively and return all nested subgroup lnks
 */
const getSubgroupLinks = (link, nameToNode, sourceId) => {
  let subgroupLinks = [];
  if (link.subgroup) {
    link.subgroup.forEach((sgLink) => {
      if (sgLink.subgroup) {
        subgroupLinks = subgroupLinks.concat(getSubgroupLinks(sgLink, nameToNode, sourceId));
      } else {
        subgroupLinks.push({
          source: nameToNode[sourceId],
          target: nameToNode[sgLink.target_type],
          exists: 1,
          ...sgLink,
        });
      }
    });
  }
  return subgroupLinks;
};

/**
 * Given a data dictionary that defines a set of nodes
 *    and edges, returns the nodes and edges in correct format
 *
 * @method createNodesAndEdges
 * @param props: Object (normally taken from redux state) that includes dictionary
 *    property defining the dictionary as well as other optional properties
 *    such as counts_search and links_search (created by getCounts) with
 *    information about the number of each type (node) and link (between
 *    nodes with a link's source and target types) that actually
 *    exist in the data
 * @param createAll: Include all nodes and edges or only those that are populated in
 *    counts_search and links_search
 * @param nodesToHide: Array of nodes to hide from graph
 * @returns { nodes, edges } Object containing nodes and edges
 */
export function createNodesAndEdges(props, createAll, nodesToHide = ['program']) {
  const dictionary = props.dictionary;
  const nodes = Object.keys(dictionary).filter(
    key => !key.startsWith('_') && dictionary[key].type === 'object'
      && dictionary[key].category !== 'internal' && !nodesToHide.includes(key),
  ).map(
    (key) => {
      let count = 0;
      if (props.counts_search) {
        count = props.counts_search[`_${key}_count`];
      }
      return {
        name: dictionary[key].title,
        count,
        ...dictionary[key],
      };
    },
  ).filter(
    node => createAll || node.count !== 0,
  );

  const nameToNode = nodes.reduce((db, node) => { db[node.id] = node; return db; }, {});
  const hideDb = nodesToHide.reduce((db, name) => { db[name] = true; return db; }, {});

  const edges = nodes.filter(
    node => node.links && node.links.length > 0,
  )
    .reduce( // add each node's links to the edge list
      (list, node) => {
        const newLinks = node.links.map(
          link => ({ source: node, target: nameToNode[link.target_type], exists: 1, ...link }),
        );
        return list.concat(newLinks);
      }, [])
    .reduce( // add link subgroups to the edge list
      (list, link) => {
        let result = list;
        if (link.target) { // "subgroup" link entries in dictionary are not links themselves ...
          result.push(link);
        }
        if (link.subgroup) {
          const sgLinks = getSubgroupLinks(link, nameToNode, link.source.id);
          result = result.concat(sgLinks);
        }
        return result;
      }, [])
    .filter(
    // target type exist and is not in hide list
      link => (link.target && link.target.id in nameToNode && !(link.target.id in hideDb)))
    .map(
      (link) => {
      // decorate each link with its "exists" count if available
      //  (number of instances of link between source and target types in the data)
        const res = link;
        res.exists = props.links_search
          ? props.links_search[`${res.source.id}_${res.name}_to_${res.target.id}_link`] :
          undefined;
        return res;
      })
    .filter(
    // filter out if no instances of this link exists and createAll is not specified
      link => createAll || link.exists || link.exists === undefined,
    );
  return {
    nodes,
    edges,
  };
}

/**
 * Find the root of the given graph (no edges out)
 * @method findRoot
 * @param nodes
 * @param edges
 * @return {string} rootName or null if no root
 */
export function findRoot(nodes, edges) {
  const couldBeRoot = edges.reduce(
    (db, edge) => {
      // At some point the d3 force layout converts
      //   edge.source and edge.target into node references ...
      const sourceName = typeof edge.source === 'object' ? edge.source.id : edge.source;
      if (db[sourceName]) {
        db[sourceName] = false;
      }
      return db;
    },
    // initialize emptyDb - any node could be the root
    nodes.reduce((emptyDb, node) => { const res = emptyDb; res[node.id] = true; return res; }, {}),
  );
  const rootNode = nodes.find(n => couldBeRoot[n.id]);
  return rootNode ? rootNode.id : null;
}

/**
 * Recursive helper function for getTreeHierarchy
 * Returns the hierarchy of the tree in the form of a map
 * Each (key, value) consists of (node, node's descendants including the node itself)
 * @method getTreeHierarchyHelper
 * @param root
 * @param name2EdgesIn
 * @param hierarchy
 * @return {map}
 */
function getTreeHierarchyHelper(node, name2EdgesIn, hierarchy) {
  const descendants = new Set();
  descendants.add(node);
  hierarchy.set(node, descendants);
  name2EdgesIn[node].forEach((edge) => {
    const sourceName = typeof edge.source === 'object' ? edge.source.id : edge.source;
    if (!hierarchy.get(sourceName)) { // don't want to visit node again
      hierarchy = getTreeHierarchyHelper(sourceName, name2EdgesIn, hierarchy);
      descendants.add(sourceName);
      hierarchy.get(sourceName).forEach((n) => {
        descendants.add(n);
      });
    }
  });
  hierarchy.set(node, descendants);
  return hierarchy;
}

/**
 * Returns the hierarchy of the tree in the form of a map
 * Each (key, value) consists of (node, node's descendants including the node itself)
 * @method getTreeHierarchy
 * @param root
 * @param name2EdgesIn
 * @return {map}
 */
export function getTreeHierarchy(root, name2EdgesIn) {
  return getTreeHierarchyHelper(root, name2EdgesIn, new Map());
}

/**
 * Arrange nodes in dictionary graph breadth first, and build level database.
 * If a node links to multiple parents, then place it under the highest parent ...
 * Exported for testing.
 *
 * @param {Array} nodes
 * @param {Array} edges
 * @return { nodesBreadthFirst, treeLevel2Names, name2Level } where
 *          nodesBreadthFirst is array of node names, and
 *          treeLevel2Names is an array of arrays of node names,
 *          and name2Level is a mapping of node name to level
 */
export function nodesBreadthFirst(nodes, edges) {
  const result = {
    bfOrder: [],
    treeLevel2Names: [],
    name2Level: {},
  };

  // mapping of node name to edges that point into that node
  const name2EdgesIn = edges.reduce(
    (db, edge) => {
      // At some point the d3 force layout converts edge.source
      //   and edge.target into node references ...
      const targetName = typeof edge.target === 'object' ? edge.target.id : edge.target;
      if (db[targetName]) {
        db[targetName].push(edge);
      } else {
        console.error(`Edge points to unknown node: ${targetName}`);
      }
      return db;
    },
    // initialize emptyDb - include nodes that have no incoming edges (leaves)
    nodes.reduce((emptyDb, node) => { const res = emptyDb; res[node.id] = []; return res; }, {}),
  );

  // root node has no edges coming out of it, just edges coming in
  const root = findRoot(nodes, edges);
  if (!root) {
    console.log('Could not find root of given graph');
    return result;
  }

  const processedNodes = new Set(); // account for nodes that link to multiple other nodes
  let queue = [];
  queue.push({ query: root, level: 0 });

  // just 2b safe - could be user gives us a graph without a 'project'
  if (!name2EdgesIn[root]) {
    name2EdgesIn[root] = [];
  }

  const name2ActualLvl = {};
  const hierarchy = getTreeHierarchy(root, name2EdgesIn);
  // Run through this once to determine the actual level of each node
  for (let head = 0; head < queue.length; head += 1) {
    const { query, level } = queue[head]; // breadth first
    name2ActualLvl[query] = level;
    name2EdgesIn[query].forEach((edge) => {
      // At some point the d3 force layout converts edge.source
      //   and edge.target into node references ...
      const sourceName = typeof edge.source === 'object' ? edge.source.id : edge.source;
      if (name2EdgesIn[sourceName]) {
        const isAncestor = hierarchy.get(sourceName).has(query);
        // only push node if it is not an ancestor of the current node, or else --> cycle
        if (!isAncestor) {
          queue.push({ query: sourceName, level: level + 1 });
        }
      } else {
        console.log(`Edge comes from unknown node ${sourceName}`);
      }
    },
    );
  }

  // Reset and run for real
  queue = [];
  queue.push({ query: root, level: 0 });

  // queue.shift is O(n), so just keep pushing, and move the head
  for (let head = 0; head < queue.length; head += 1) {
    const { query, level } = queue[head]; // breadth first
    result.bfOrder.push(query);
    processedNodes.add(query);
    if (result.treeLevel2Names.length <= level) {
      result.treeLevel2Names.push([]);
    }
    result.treeLevel2Names[level].push(query);
    result.name2Level[query] = level;
    name2EdgesIn[query].forEach(
      (edge) => {
        // At some point the d3 force layout converts edge.source
        //   and edge.target into node references ...
        const sourceName = typeof edge.source === 'object' ? edge.source.id : edge.source;
        if (name2EdgesIn[sourceName]) {
          if (!processedNodes.has(sourceName) && name2ActualLvl[sourceName] === (level + 1)) {
            //
            // edge source has not yet been processed via another link from the source
            // to a node higher in the graph
            //
            processedNodes.add(sourceName); // don't double-queue a node
            queue.push({ query: sourceName, level: level + 1 });
          }
        } else {
          console.log(`Edge comes from unknown node ${sourceName}`);
        }
      },
    );
  }
  return result;
}


/**
 * Decorate the nodes of a graph with a position based on the node's position in the graph
 * Exported for testing.  Decorates nodes with position property array [x,y] on a [0,1) space
 *
 * @method assignNodePositions
 * @param nodes
 * @param edges
 * @param opts {breadthFirstInfo,numPerRow} breadthFirstInfo is output
 *          from nodesBreadthFirst - otherwise call it ourselves,
 *          numPerRow specifies number of nodes per row if we want a
 *          grid under the root rather than the tree structure
 */
export function assignNodePositions(nodes, edges, opts) {
  const breadthFirstInfo = (opts && opts.breadthFirstInfo) ?
    opts.breadthFirstInfo : nodesBreadthFirst(nodes, edges);
  const name2Node = nodes.reduce((db, node) => {
    const res = db; res[node.id] = node; return res;
  }, {});

  // the tree has some number of levels with some number of nodes each,
  // but we may want to break each level down into multiple rows
  // @return {rowNumber:[nodeNameList]}
  const row2Names = (() => {
    if (!opts || !opts.numPerRow) {
      return breadthFirstInfo.treeLevel2Names;
    }
    const { numPerRow } = opts;
    const { bfOrder } = breadthFirstInfo;
    // put the root on its own level
    return bfOrder.reduce(
      (db, node) => {
        if (db.length < 2) { // put root node on its own level
          db.push([node]);
        } else {
          const lastRow = db[db.length - 1];
          if (lastRow.length < numPerRow) {
            lastRow.push(node);
          } else {
            db.push([node]);
          }
        }
        return db;
      }, [],
    );
  })();

  // Assign a (x,y) position in [0,1) space to each node based on its level in the tree
  const numLevels = row2Names.length;
  row2Names.forEach(
    (nodesAtLevel, level) => {
      const numNodesAtLevel = nodesAtLevel.length;
      nodesAtLevel.forEach(
        (nodeName, posAtLevel) => {
          const node = name2Node[nodeName];
          node.position = [ // (x,y) in [0,1) coordinates
            (posAtLevel + 1) / (numNodesAtLevel + 1),
            (level + 1) / (numLevels + 1),
          ];
          node.positionIndex = [
            posAtLevel, level,
          ];
        });
    },
  );
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
  const dotString = buildGraphVizDOTString(nodes, edges, posInfo.treeLevel2Names);
  return dotString;
}
