import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render';
import _ from 'underscore';
import { createNodesAndEdges, createDotStrinByNodesEdges } from '../../../GraphUtils/utils';
import { truncateLines, graphStyleConfig } from '../../utils';
import { getCategoryColor } from '../../NodeCategories/helper';

export const getAllTypes = (nodes) => {
  const types = nodes.map(node => node.type);
  const uniqueTypes = _.uniq(types);
  return uniqueTypes;
};

export const getAllChildrenNodeIDs = (highlightingNode, nodes) => {
  const relatedNodeIDs = [];
  let currentLevelNodeIDs = highlightingNode.outLinks;
  while (currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    currentLevelNodeIDs.forEach((nodeId) => {
      if (relatedNodeIDs.includes(nodeId) || nextLevelNodeIDs.includes(nodeId)) return;
      relatedNodeIDs.push(nodeId);
      const originNode = nodes.find(n => (n.id === nodeId));
      const nextLevel = originNode.outLinks;
      nextLevel.forEach((outNodeId) => {
        nextLevelNodeIDs.push(outNodeId);
      });
    });
    currentLevelNodeIDs = nextLevelNodeIDs;
  }
  return relatedNodeIDs;
};

export const getAllChildrenLinks = (startingNode, nodes) => {
  let currentLevelNodeIDs = startingNode.outLinks;
  const relatedLinks = currentLevelNodeIDs.map(outID => ({
    source: startingNode.id,
    target: outID,
  }));
  while (currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    for (let i = 0; i < currentLevelNodeIDs.length; i += 1) {
      const nodeID = currentLevelNodeIDs[i];
      if (nextLevelNodeIDs.includes(nodeID)) break;
      const originNode = nodes.find(n => (n.id === nodeID));
      const nextLevel = originNode.outLinks;
      for (let j = 0; j < nextLevel.length; j += 1) {
        const outNodeID = nextLevel[j];
        relatedLinks.push({
          source: nodeID,
          target: outNodeID,
        });
        if (nextLevelNodeIDs.includes(outNodeID)
          || currentLevelNodeIDs.includes(outNodeID)) break;
        nextLevelNodeIDs.push(outNodeID);
      }
    }
    currentLevelNodeIDs = nextLevelNodeIDs;
  }
  return relatedLinks;
};

/* eslint-disable no-underscore-dangle */
export const calculateGraphLayout = (dictionary, countsSearch, linksSearch) => {
  const { nodes, edges } = createNodesAndEdges({
    dictionary,
    counts_search: countsSearch,
    links_search: linksSearch,
  }, true, []);
  const dotString = createDotStrinByNodesEdges(nodes, edges);
  const viz = new Viz({ Module, render });
  return viz.renderJSONObject(dotString)
    .then((renderedJSON) => {
      // draw nodes
      const renderedNodes = renderedJSON.objects
        .filter(n => !n.rank)
        .map((n) => {
          const boundingBox = n._draw_[1].points.reduce((acc, cur) => {
            if (acc.x1 > cur[0]) acc.x1 = cur[0];
            if (acc.y1 > cur[1]) acc.y1 = cur[1];
            if (acc.x2 < cur[0]) acc.x2 = cur[0];
            if (acc.y2 < cur[1]) acc.y2 = cur[1];
            return acc;
          }, {
            x1: Infinity,
            y1: Infinity,
            x2: -Infinity,
            y2: -Infinity,
          });
          const iconRadius = graphStyleConfig.nodeIconRadius;
          const topCenterX = (boundingBox.x1 + boundingBox.x2) / 2;
          const topCenterY = boundingBox.y1;
          const width = boundingBox.x2 - boundingBox.x1;
          const height = boundingBox.y2 - boundingBox.y1;
          const originNode = nodes.find(node => node.id === n.name);
          const outLinks = edges
            .filter(edge => edge.source.id === n.name)
            .map(edge => edge.target.id);
          const inLinks = edges
            .filter(edge => edge.target.id === n.name)
            .map(edge => edge.source.id);

          const nodeColor = getCategoryColor(n.type);
          const textPadding = graphStyleConfig.nodeContentPadding;
          const fontSize = graphStyleConfig.nodeTextFontSize;
          const textLineGap = graphStyleConfig.nodeTextLineGap;
          const nodeNames = truncateLines(n.label);
          const rectMinHeight = height;
          const rectHeight = Math.max(
            rectMinHeight,
            (textPadding * 2) + (nodeNames.length * (fontSize + textLineGap)),
          );
          const requiredPropertiesCount = originNode.required ? originNode.required.length : 0;
          const optionalPropertiesCount = originNode.properties ?
            Object.keys(originNode.properties).length - requiredPropertiesCount : 0;
          let nodeLevel = 0;
          if (originNode && originNode.positionIndex && originNode.positionIndex.length >= 2) {
            nodeLevel = originNode.positionIndex[1];
          }
          return {
            id: n.name,
            type: n.type,
            boundingBox,
            topCenterX,
            topCenterY,
            width,
            height: rectHeight,
            color: nodeColor,
            iconRadius,
            textPadding,
            fontSize,
            textLineGap,
            names: nodeNames,
            label: n.label,
            level: nodeLevel,
            outLinks,
            inLinks,
            _gvid: n._gvid,
            requiredPropertiesCount,
            optionalPropertiesCount,
          };
        });

      // draw edges
      const renderedEdges = renderedJSON.edges
        .map((edge) => {
          const controlPoints = edge._draw_[1].points;
          let pathString = `M${controlPoints[0].join(',')}C${controlPoints.slice(1)
            .map(pair => `${pair[0]},${pair[1]}`).join(' ')}`;
          const sourceNode = renderedNodes.find(node => node._gvid === edge.tail);
          const targetNode = renderedNodes.find(node => node._gvid === edge.head);
          if (sourceNode.level === targetNode.level + 1) {
            const sourePosition = [
              (sourceNode.boundingBox.x1 + sourceNode.boundingBox.x2) / 2,
              sourceNode.boundingBox.y1,
            ];
            const targetPosition = [
              (targetNode.boundingBox.x1 + targetNode.boundingBox.x2) / 2,
              targetNode.boundingBox.y2,
            ];
            pathString = `M${sourePosition[0]} ${sourePosition[1]} 
              L ${targetPosition[0]} ${targetPosition[1]}`;
          }
          const required = edges
            .find(e => (e.source.id === sourceNode.id && e.target.id === targetNode.id))
            .required;
          return {
            source: sourceNode.id,
            target: targetNode.id,
            controlPoints,
            pathString,
            required,
          };
        });

      // get bounding box for whole graph
      const graphBoundingBox = renderedJSON._draw_.find(entry => entry.op === 'P').points;

      const layoutResult = {
        nodes: renderedNodes,
        edges: renderedEdges,
        graphBoundingBox,
      };
      return layoutResult;
    })
    .catch((e) => {
      throw e;
    });
};
/* eslint-enable no-underscore-dangle */

export const getNodeIDsThatHaveNoInLinks = (
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const resultIDs = [];
  subgraphNodeIDs.forEach((nodeID) => {
    const node = wholeGraphNodes.find(n => n.id === nodeID);
    const inLinks = node.inLinks
      .filter(inNodeID => subgraphNodeIDs.includes(inNodeID))
      .filter(inNodeID => subgraphEdges.find(e =>
        e.target === nodeID && e.source === inNodeID && subgraphNodeIDs.includes(e.source)))
      .filter(inNodeID => (inNodeID !== nodeID));
    if (!inLinks || inLinks.length === 0) {
      resultIDs.push(nodeID);
    }
  });
  return resultIDs;
};

export const getNodeIDsThatHaveNoOutLinks = (
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const resultIDs = [];
  subgraphNodeIDs.forEach((nodeID) => {
    const node = wholeGraphNodes.find(n => n.id === nodeID);
    const outLinks = node.outLinks
      .filter(inNodeID => subgraphNodeIDs.includes(inNodeID))
      .filter(inNodeID => subgraphEdges.find(e =>
        e.source === nodeID && e.target === inNodeID && subgraphNodeIDs.includes(e.target)))
      .filter(inNodeID => (inNodeID !== nodeID));
    if (!outLinks || outLinks.length === 0) {
      resultIDs.push(nodeID);
    }
  });
  return resultIDs;
};

export const isArticulationNodeInSubgraph = (
  targetNodeID,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  // step.1: calculate connected node count if there's no target node in subgraph
  const nodeIdsWithoutInLinks = getNodeIDsThatHaveNoInLinks(
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

export const getArticulationNodesInSubgraph = (
  startingNodeID,
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

export const BFSTraverseSubgraph = (subgraphNodeIDs, subgraphEdges, wholeGraphNodes) => {
  let currentLevelNodeIDs = [];
  subgraphNodeIDs.forEach((nodeID) => {
    const node = wholeGraphNodes.find(n => n.id === nodeID);
    const inLinks = node.inLinks
      .filter(inNodeID => subgraphNodeIDs.includes(inNodeID))
      .filter(inNodeID => subgraphEdges.find(e =>
        e.target === nodeID && e.source === inNodeID && subgraphNodeIDs.includes(e.source)))
      .filter(inNodeID => (inNodeID !== nodeID));
    if (!inLinks || inLinks.length === 0) {
      currentLevelNodeIDs.push(nodeID);
    }
  });
  const resultNodeIDs = [];
  while (currentLevelNodeIDs.length > 0) {
    const nextLevelNodeIDs = [];
    for (let i = 0; i < currentLevelNodeIDs.length; i += 1) {
      const nodeID = currentLevelNodeIDs[i];
      if (!resultNodeIDs.includes(nodeID)) resultNodeIDs.push(nodeID);
      const node = wholeGraphNodes.find(n => n.id === nodeID);
      if (!node) break;
      const outNeighbors = node.outLinks.filter(outNodeID =>
        subgraphEdges.find(e => e.source === nodeID && outNodeID === e.target));
      for (let j = 0; j < outNeighbors.length; j += 1) {
        const outNodeID = outNeighbors[j];
        if (currentLevelNodeIDs.includes(outNodeID) || nextLevelNodeIDs.includes(outNodeID)) {
          break;
        }
        nextLevelNodeIDs.push(outNodeID);
      }
    }
    currentLevelNodeIDs = nextLevelNodeIDs;
  }
  return resultNodeIDs;
};

export const sortNodesByTopology = (
  nodeIDsToSort,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const graphBFSTraverse = BFSTraverseSubgraph(subgraphNodeIDs, subgraphEdges, wholeGraphNodes);
  const sortedNodeIDs = graphBFSTraverse.filter(nodeID => nodeIDsToSort.includes(nodeID));
  return sortedNodeIDs;
};

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
  return {
    nodeIDs: betweenNodeIDs,
    links: betweenLinks,
  };
};

export const calculateFurtherHighlightedPath = (
  newHighlightingNode,
  newSecondHighlightingNodeID,
  wholeGraphNodes,
) => {
  if (!newHighlightingNode || !newSecondHighlightingNodeID) {
    return [];
  }
  const node = wholeGraphNodes.find(n => n.id === newSecondHighlightingNodeID);
  const furtherHighlightedPath = getAllChildrenLinks(node, wholeGraphNodes);
  furtherHighlightedPath.push({
    source: newHighlightingNode.id,
    target: newSecondHighlightingNodeID,
  });
  return furtherHighlightedPath;
};

export const calculateHighlightRelatedNodeIDs = (
  newHighlightingNode,
  wholeGraphNodes,
) => {
  if (!newHighlightingNode) {
    return [];
  }
  const relatedNodeIDs = getAllChildrenNodeIDs(newHighlightingNode, wholeGraphNodes);
  if (!relatedNodeIDs.includes(newHighlightingNode.id)) {
    return [newHighlightingNode.id, ...relatedNodeIDs];
  }
  return relatedNodeIDs;
};

export const getSingleEndDescendentNodeID = (
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  const nodeIDs = getNodeIDsThatHaveNoOutLinks(subgraphNodeIDs, subgraphEdges, wholeGraphNodes);
  if (nodeIDs.length === 1) return nodeIDs[0];
  return null;
};

export const calculateDataModelStructure = (
  startingNode,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  if (!startingNode) return null;
  const startingNodeID = startingNode.id;
  const articulationNodeIDs = getArticulationNodesInSubgraph(
    startingNodeID,
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  const unsortedCriticalNodeIDs = articulationNodeIDs.includes(startingNodeID)
    ? articulationNodeIDs : [...articulationNodeIDs, startingNodeID];

  if (!unsortedCriticalNodeIDs || unsortedCriticalNodeIDs.length === 0) return null;
  const sortedCriticalNodeIDs = sortNodesByTopology(
    unsortedCriticalNodeIDs,
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  if (!sortedCriticalNodeIDs || sortedCriticalNodeIDs.length === 0) { // loop in graph
    return null;
  }

  const resultCriticalNodeIDs = sortedCriticalNodeIDs;
  // if there's a single end descendent node
  const singleDescendentNodeID = getSingleEndDescendentNodeID(
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  // add single descendent node if not counted in critical nodes list
  if (singleDescendentNodeID && !resultCriticalNodeIDs.includes(singleDescendentNodeID)) {
    resultCriticalNodeIDs.push(singleDescendentNodeID);
  }

  let resultStructure = [];
  for (let i = 1; i < resultCriticalNodeIDs.length; i += 1) {
    const { nodeIDs, links } = getNodesAndLinksSummaryBetweenNodesInSubgraph(
      resultCriticalNodeIDs[i - 1],
      resultCriticalNodeIDs[i],
      subgraphNodeIDs,
      subgraphEdges,
      wholeGraphNodes,
    );
    resultStructure.push({
      nodeID: resultCriticalNodeIDs[i - 1],
      nodeIDsBefore: nodeIDs,
      linksBefore: links,
    });
  }

  if (singleDescendentNodeID) {
    resultStructure.push({
      nodeID: singleDescendentNodeID,
      nodeIDsBefore: [],
      linksBefore: [],
    });
  } else {
    // summary for all rest descendent nodes after last critical node
    const lastCriticalNodeID = resultCriticalNodeIDs[resultCriticalNodeIDs.length - 1];
    const nodeIDsBeforeNode = getAllChildrenNodeIDs(
      lastCriticalNodeID,
      wholeGraphNodes,
    );
    const linksBeforeNode = getAllChildrenLinks(
      lastCriticalNodeID,
      wholeGraphNodes,
    );
    resultStructure.push({
      nodeID: lastCriticalNodeID,
      nodeIDsBefore: nodeIDsBeforeNode,
      linksBefore: linksBeforeNode,
    });
  }

  resultStructure = resultStructure.map((entry) => {
    const { nodeID, nodeIDsBefore, linksBefore } = entry;
    const category = wholeGraphNodes.find(n => n.id === nodeID).type;
    return {
      nodeID,
      nodeIDsBefore,
      linksBefore,
      category,
    };
  }).reverse();
  return resultStructure;
};
