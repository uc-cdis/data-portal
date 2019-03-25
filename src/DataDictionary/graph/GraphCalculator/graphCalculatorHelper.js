import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render';
import _ from 'underscore';
import { createNodesAndEdges, createDotStrinByNodesEdges } from '../../../GraphUtils/utils';
import {
  truncateLines,
  graphStyleConfig,
} from '../../utils';
import {
  getAllChildrenNodeIDs,
  getAllChildrenLinks,
  getArticulationNodesInSubgraph,
  sortNodesByTopology,
  getSingleEndDescendentNodeID,
  getNodesAndLinksSummaryBetweenNodesInSubgraph,
  getAllRoutesBetweenTwoNodes,
} from './graphStructureHelper.js';
import { getCategoryColor } from '../../NodeCategories/helper';

/**
 * Get a set of types from an array of nodes
 * @param {Node[]} nodes
 * @returns {string[]} array of type names(duplicating names removed) of given nodes
 */
export const getAllTypes = (nodes) => {
  const types = nodes.map(node => node.type);
  const uniqueTypes = _.uniq(types);
  return uniqueTypes;
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

          const nodeType = n.type.toLowerCase();
          const nodeColor = getCategoryColor(nodeType);
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
            type: nodeType,
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

/**
 * Get all node IDs that are descendent of the first highlighting node
 * @param {Node} highlightingNode - the first highlighting node
 * @param {Node[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {string[]} array of node IDs that are descendent of the first highlighting node
 */
export const calculateHighlightRelatedNodeIDs = (
  highlightingNode,
  wholeGraphNodes,
) => {
  if (!highlightingNode) {
    return [];
  }
  const relatedNodeIDs = getAllChildrenNodeIDs(highlightingNode.id, wholeGraphNodes);
  if (!relatedNodeIDs.includes(highlightingNode.id)) {
    return [highlightingNode.id, ...relatedNodeIDs];
  }
  return relatedNodeIDs;
};

/**
 * Get all routes that pass the second highlighting node and ends at the first highlighting node
 * @param {Node} highlightingNode - the first highlighting node
 * @param {string} secondHighlightingNodeID - the second highlighting node ID
 * @param {Node[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {Edge[]} array of links along  routes that pass
 *                   the second and ends at the first highlighting node
 */
export const calculatePathRelatedToSecondHighlightingNode = (
  highlightingNode,
  secondHighlightingNodeID,
  wholeGraphNodes,
) => {
  if (!highlightingNode || !secondHighlightingNodeID) {
    return [];
  }
  const pathRelatedToSecondHighlightingNode = getAllChildrenLinks(
    secondHighlightingNodeID,
    wholeGraphNodes,
  );
  pathRelatedToSecondHighlightingNode.push({
    source: highlightingNode.id,
    target: secondHighlightingNodeID,
  });
  return pathRelatedToSecondHighlightingNode;
};

/**
 * For a given node in subgraph, summary about how do its descendent structure look like.
 * I.e., which nodes along the descendent structure, and how many nodes/links between.
 * (A node's descendent structure means nodes and links that are started from this node)
 * @param {Node} startingNode
 * @param {string[]} subgraphNodeIDs - array of node IDs in subgraph
 * @param {Edge[]} subgraphEdges - array of edges in subgraph
 * @param {Node[]} wholeGraphNodes - array of nodes in the origin whole graph
 * @returns {Object[]} array of ordered items, each refers to a descendent node,
 *                     its category, nodes and links between this item and previous item
 * Calculating process:
 *    step.1: find all critical nodes in subgraph
             (critical nodes here means all articulation nodes in subgraph and the starting node)
 *    step.2: sort those nodes by linking order (source nodes come before target node)
 *    step.3: if there's a single node that is also descendent to all other node, add it to list
 *    step.4: for all nodes in critical node list, get summary description for all pairs
 *           of neighbor nodes (summary description means how many nodes and links between)
 *    step.4.1 (optional): if there isn't a single descendent node, get summary description
 *           for all of the rest nodes
 *    step.5: if there is a single descendent node, get all routes between this node and
 *           the starting Node
 *    step.6: return final data model structure
 */
export const calculateDataModelStructure = (
  startingNode,
  subgraphNodeIDs,
  subgraphEdges,
  wholeGraphNodes,
) => {
  if (!startingNode) return null;
  const startingNodeID = startingNode.id;
  // step.1
  const articulationNodeIDs = getArticulationNodesInSubgraph(
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  const unsortedCriticalNodeIDs = articulationNodeIDs.includes(startingNodeID)
    ? articulationNodeIDs : [...articulationNodeIDs, startingNodeID];
  if (!unsortedCriticalNodeIDs || unsortedCriticalNodeIDs.length === 0) return null;

  // step.2
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

  // step.3 if there's a single end descendent node
  const singleDescendentNodeID = getSingleEndDescendentNodeID(
    subgraphNodeIDs,
    subgraphEdges,
    wholeGraphNodes,
  );
  // add single descendent node if not counted in critical nodes list
  if (singleDescendentNodeID && !resultCriticalNodeIDs.includes(singleDescendentNodeID)) {
    resultCriticalNodeIDs.push(singleDescendentNodeID);
  }

  // step.4
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

  let routesBetweenStartEndNodes = [];
  if (singleDescendentNodeID) {
    resultStructure.push({
      nodeID: singleDescendentNodeID,
      nodeIDsBefore: [],
      linksBefore: [],
    });
    // step.5 get all routes between the starting node and this single descendent node
    routesBetweenStartEndNodes = getAllRoutesBetweenTwoNodes(
      startingNodeID,
      singleDescendentNodeID,
      subgraphNodeIDs,
      subgraphEdges,
      wholeGraphNodes,
    );
  } else {
    // step.4.1 (optional)
    // Summary for all rest descendent nodes after last critical node
    // (normally we won't need this step, because there should be only one single last
    // descendent node (root note) "program", just in case that more than one appear in graph)
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

    // step.5.1 (optional)
    // Get all routes between the starting node and the all rest descendent nodes
    // (normally we won't need this step, because there should be only one single last
    // descendent node (root note) "program", just in case that more than one appear in graph)
    nodeIDsBeforeNode.forEach((nid) => {
      routesBetweenStartEndNodes = routesBetweenStartEndNodes.concat(getAllRoutesBetweenTwoNodes(
        startingNodeID,
        nid,
        subgraphNodeIDs,
        subgraphEdges,
        wholeGraphNodes,
      ));
    });
  }

  // step.6
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
  return {
    dataModelStructure: resultStructure,
    routesBetweenStartEndNodes,
  };
};
