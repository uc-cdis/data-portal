/**
 * @typedef {Object} Node
 * @property {string} id - ID of this node
 * @property {string[]} inLinks - array of soure node IDs that link to this node
 * @property {string[]} outLinks - array of target node IDs that are linked from this node
 */

/**
 * @typedef {Object} Edge
 * @property {string} source - edge source node ID
 * @property {string} target - edge target node ID
 */

/**
 * Get all descendent node IDs from a given node
 * @param {string} startingNodeID
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string[]} array of descendent node IDs
 */
export const getAllChildrenNodeIDs = (startingNodeID, wholeGraphNodes) => {
  const relatedNodeIDs = [];
  const startingNode = wholeGraphNodes.find(n => n.id === startingNodeID);
  let currentLevelNodeIDs = startingNode.outLinks;
  while (currentLevelNodeIDs && currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    currentLevelNodeIDs.forEach((nodeId) => {
      if (relatedNodeIDs.includes(nodeId) || nextLevelNodeIDs.includes(nodeId)) return;
      relatedNodeIDs.push(nodeId);
      const originNode = wholeGraphNodes.find(n => (n.id === nodeId));
      const nextLevel = originNode.outLinks;
      nextLevel.forEach((outNodeId) => {
        nextLevelNodeIDs.push(outNodeId);
      });
    });
    currentLevelNodeIDs = nextLevelNodeIDs;
  }
  return relatedNodeIDs;
};

/**
 * Get all children links from a given node
 * @param {string} startingNodeID
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {Edge[]} array of descendent links
 */
export const getAllChildrenLinks = (startingNodeID, wholeGraphNodes) => {
  const startingNode = wholeGraphNodes.find(n => n.id === startingNodeID);
  let currentLevelNodeIDs = startingNode.outLinks;
  const relatedLinks = currentLevelNodeIDs.map(outID => ({
    source: startingNode.id,
    target: outID,
  }));
  const sourceNodeHistory = {};
  while (currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    for (let i = 0; i < currentLevelNodeIDs.length; i += 1) {
      const nodeID = currentLevelNodeIDs[i];
      if (sourceNodeHistory[nodeID]) continue; // eslint-disable-line no-continue
      const originNode = wholeGraphNodes.find(n => (n.id === nodeID));
      const nextLevel = originNode.outLinks;
      for (let j = 0; j < nextLevel.length; j += 1) {
        const outNodeID = nextLevel[j];
        relatedLinks.push({
          source: nodeID,
          target: outNodeID,
        });
        sourceNodeHistory[nodeID] = true;
        nextLevelNodeIDs.push(outNodeID);
      }
    }
    currentLevelNodeIDs = nextLevelNodeIDs;
  }
  return relatedLinks;
};

/**
 * Get all inlinks or outlinks for a given node, in subgraph
 * @param {string} nodeID - ID of the given node
 * @param {boolean} inOrOut - true: get inlinks, false: get outlinks
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string[]} array of node IDs that are inlinks or outlinks of the given node
 */
const inOrOutLinksFromGivenNode = (
  nodeID,
  inOrOut,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const node = wholeGraphNodes.find(n => n.id === nodeID);
  const links = inOrOut ? node.inLinks : node.outLinks;
  const inLinksFilterFunc = (e, neighborNodeID) => (e.target === nodeID
    && e.source === neighborNodeID
    && subgraphNodeIDs.includes(e.source));
  const outLinksFilterFunc = (e, neighborNodeID) => (e.source === nodeID
    && e.target === neighborNodeID
    && subgraphNodeIDs.includes(e.target));
  return links.filter(neighborNodeID => subgraphNodeIDs.includes(neighborNodeID))
    .filter(neighborNodeID => subgraphEdges.find((e) => {
      if (inOrOut) return inLinksFilterFunc(e, neighborNodeID);
      return outLinksFilterFunc(e, neighborNodeID);
    }))
    .filter(neighborNodeID => (neighborNodeID !== nodeID));
};

/**
 * Inside a subgraph, get all nodes that have no inlinks or outlinks
 * (inlinks of a node means links that is pointing at this node)
 * (node without inlinks means no other nodes inside subgraph is pointing at it)
 * (outlinks of a node means links that is starting from this node)
 * (node without outlinks means this node is not pointing at any other nodes in subgraph)
 * @param {boolean} inOrOut - true: get inlinks, false: get outlinks
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string[]} array of node IDs that have no inlinks or outlinks
 */
export const getNodeIDsThatHaveNoInOrOutLinks = (
  inOrOut,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const resultIDs = [];
  subgraphNodeIDs.forEach((nodeID) => {
    const links = inOrOutLinksFromGivenNode(
      nodeID,
      inOrOut,
      subgraphNodeIDs,
      subgraphEdges,
      wholeGraphNodes,
    );
    if (!links || links.length === 0) {
      resultIDs.push(nodeID);
    }
  });
  return resultIDs;
};

/**
 * Judge if a given node is articulation node inside subgraph
 * (An articulation node of a graph is a node whose removal will disconnect the graph)
 * @param {string} targetNodeID - the target node to validate
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {boolean} whether this node is articulation node inside subgraph
 */
export const isArticulationNodeInSubgraph = (
  targetNodeID,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  // step.1: calculate connected node count if there's no target node in subgraph
  const nodeIdsWithoutInLinks = getNodeIDsThatHaveNoInOrOutLinks(
    true,
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  if (nodeIdsWithoutInLinks.includes(targetNodeID)) return false;
  let currentLevelNodeIDs = nodeIdsWithoutInLinks;
  const nodeIDsInSubgraphWithoutTargetNode = [];
  while (currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    currentLevelNodeIDs.forEach((nodeID) => {
      if (nodeIDsInSubgraphWithoutTargetNode.includes(nodeID)
        || nextLevelNodeIDs.includes(nodeID)) return;
      nodeIDsInSubgraphWithoutTargetNode.push(nodeID);
      const node = wholeGraphNodes.find(n => n.id === nodeID);
      const inNeighbors = node.inLinks
        .filter(inNodeID => subgraphEdges.find(e => e.source === inNodeID && e.target === nodeID));
      const outNeighbors = node.outLinks.filter(outNodeID =>
        subgraphEdges.find(e => e.target === outNodeID && e.source === nodeID));
      const neighborNodeIDs = [...inNeighbors, ...outNeighbors];
      neighborNodeIDs
        .filter(nid => subgraphNodeIDs.includes(nid))
        .filter(nid => (nid !== targetNodeID))
        .forEach((nid) => {
          nextLevelNodeIDs.push(nid);
        });
    });
    currentLevelNodeIDs = nextLevelNodeIDs;
  }

  // step.2: if node count equals subgraph's node count - 1, then not articulation node
  return (nodeIDsInSubgraphWithoutTargetNode.length !== subgraphNodeIDs.length - 1);
};

/**
 * Get all articulation node is articulation inside subgraph
 * (An articulation node of a graph is a node whose removal will disconnect the graph)
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string[]} array of articulation node IDs inside subgraph
 */
export const getArticulationNodesInSubgraph = (
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const articulationNodeIDs = [];
  subgraphNodeIDs.forEach((nodeID) => {
    if (isArticulationNodeInSubgraph(
      nodeID,
      subgraphNodeIDs,
      subgraphEdges,
      wholeGraphNodes,
    )) {
      articulationNodeIDs.push(nodeID);
    }
  });
  return articulationNodeIDs;
};

/**
 * Traverse a subgraph via breath Breadth-first search algorithm
 * @param {boolean} alongLinkDirection - if want traverse from link direction
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string[]} array of node IDs in BFS traverse
 * Note that this function only consider union of `subgraphNodeIDs` and `subgraphEdges`,
 * if a node is in `subgraphEdges` but not in `subgraphNodeIDs`, it'll be ignored.
 */
export const BFSTraverseSubgraph = (
  alongLinkDirection,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  let currentLevelNodeIDs = getNodeIDsThatHaveNoInOrOutLinks(
    alongLinkDirection,
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  const resultNodeIDs = [];
  while (currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    for (let i = 0; i < currentLevelNodeIDs.length; i += 1) {
      const nodeID = currentLevelNodeIDs[i];
      if (!resultNodeIDs.includes(nodeID)) resultNodeIDs.push(nodeID);
      const node = wholeGraphNodes.find(n => n.id === nodeID);
      if (node) {
        const links = alongLinkDirection ? node.outLinks : node.inLinks;
        const linkNeighbors = links.filter((neighborNodeID) => {
          if (!subgraphNodeIDs.includes(neighborNodeID)) return false;
          if (alongLinkDirection) {
            return subgraphEdges.find(e => e.source === nodeID && neighborNodeID === e.target);
          }

          return subgraphEdges.find(e => e.target === nodeID && neighborNodeID === e.source);
        });
        for (let j = 0; j < linkNeighbors.length; j += 1) {
          const neighborNodeID = linkNeighbors[j];
          if (!currentLevelNodeIDs.includes(neighborNodeID)
            && !nextLevelNodeIDs.includes(neighborNodeID)) {
            nextLevelNodeIDs.push(neighborNodeID);
          }
        }
      }
    }
    currentLevelNodeIDs = nextLevelNodeIDs;
  }
  return resultNodeIDs;
};

/**
 * Get topological sorting of an array of node inside subgraph
 * I.e., order nodes so that for each link A->B, A comes before B in the ordering
 * @param {string[]} nodeIDsToSort - array of node IDs to sort
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string[]} array of node IDs in topological order
 */
export const sortNodesByTopology = (
  nodeIDsToSort,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const graphBFSTraverse = BFSTraverseSubgraph(
    true,
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  const sortedNodeIDs = graphBFSTraverse.filter(nodeID => nodeIDsToSort.includes(nodeID));
  return sortedNodeIDs;
};


/**
 * Find a node that is descendent of all other nodes inside subgraph
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Node[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string} if find, return node ID, otherwise return null
 */
export const getSingleEndDescendentNodeID = (
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const nodeIDs = getNodeIDsThatHaveNoInOrOutLinks(
    false,
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  if (nodeIDs.length === 1) return nodeIDs[0];
  return null;
};

/**
 * @typedef {Object} Summary
 * @property {string[]} nodeIDs - array of node IDs between two given nodes
 * @property {Edge[]} links - array of links between two given nodes
 */
/**
 * Get summary of how many nodes and links are between given two nodes inside subgraph
 * I.e., nodes and links along the route between given two nodes
 * @param {string} startingNodeID
 * @param {string} endingNodeID
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Object[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {Summary}
 */
export const getNodesAndLinksSummaryBetweenNodesInSubgraph = (
  startingNodeID,
  endingNodeID,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const startingNode = wholeGraphNodes.find(node => node.id === startingNodeID);
  const betweenNodeIDs = [];
  const firstLevelOutNodeIDs = startingNode.outLinks.filter(outNodeID =>
    subgraphEdges.find(e => e.source === startingNodeID && e.target === outNodeID));
  let currentLevelNodeIDs = firstLevelOutNodeIDs;
  const betweenLinks = firstLevelOutNodeIDs.map(outID => ({
    source: startingNodeID,
    target: outID,
  }));
  while (currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    currentLevelNodeIDs.forEach((nodeID) => {
      if (betweenNodeIDs.includes(nodeID)
        || nextLevelNodeIDs.includes(nodeID)
        || nodeID === endingNodeID
      ) return;
      betweenNodeIDs.push(nodeID);
      const node = wholeGraphNodes.find(n => (n.id === nodeID));
      const outNOdeIDsInSubgraph = node.outLinks
        .filter(outNodeID => subgraphNodeIDs.includes(outNodeID))
        .filter(outNodeID => subgraphEdges.find(e =>
          e.source === nodeID && e.target === outNodeID));
      outNOdeIDsInSubgraph.forEach((outNodeID) => {
        betweenLinks.push({
          source: nodeID,
          target: outNodeID,
        });
      });
      outNOdeIDsInSubgraph
        .filter(outNodeID => outNodeID !== endingNodeID)
        .forEach((outNodeID) => {
          nextLevelNodeIDs.push(outNodeID);
        });
    });
    currentLevelNodeIDs = nextLevelNodeIDs;
  }
  const sortedBetweenNodeIDs = BFSTraverseSubgraph(
    false,
    betweenNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  return {
    nodeIDs: sortedBetweenNodeIDs,
    links: betweenLinks,
  };
};

export const getAllRoutesBetweenTwoNodes = (
  startingNodeID,
  endingNodeID,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const resultRoutes = [];
  const takeOneStep = (curID, curPath) => {
    if (curID === endingNodeID) {
      const resultPath = Array.from(curPath);
      resultPath.reverse(); // we actually want route from top to bottom
      resultRoutes.push(resultPath);
      return;
    }
    const curNode = wholeGraphNodes.find(n => n.id === curID);
    curNode.outLinks.forEach((oid) => {
      if (curPath.has(oid)) return; // avoid loop
      if (!subgraphNodeIDs.includes(oid)) return;
      if (!subgraphEdges.find(e => e.target === oid && e.source === curID)) return;
      curPath.add(oid);
      takeOneStep(oid, curPath);
      curPath.delete(oid);
    });
  };
  takeOneStep(startingNodeID, new Set([startingNodeID]));
  return resultRoutes;
};

