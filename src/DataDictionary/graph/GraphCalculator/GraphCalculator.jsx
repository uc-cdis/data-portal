import React from 'react';
import PropTypes from 'prop-types';
import Viz from 'viz.js';
import _ from 'underscore';
import { Module, render } from 'viz.js/full.render';
import { createNodesAndEdges, createDotStrinByNodesEdges } from '../../../DataModelGraph/utils';
import { truncateLines, getCategoryColor } from '../../utils';

class GraphCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.oldHighlightingNode = null;
  }

  componentDidMount() {
    this.calculateGraphLayout().then((layoutResult) => {
      this.props.onGraphLayoutCalculated(layoutResult);
      const legendItems = this.getAllTypes(layoutResult);
      this.props.onGraphLegendCalculated(legendItems);
    });
  }

  getAllTypes(layoutResult) {
    const { nodes } = layoutResult;
    const types = nodes.map(node => node.type);
    const uniqueTypes = _.uniq(types);
    return uniqueTypes;
  }

  getAllChildrenNodes(highlightingNode) {
    const relatedNodes = [];
    let currentLevelNodeIDs = highlightingNode.outLinks;
    while (currentLevelNodeIDs.length > 0) {
      let nextLevelNodeIDs = [];
      currentLevelNodeIDs.forEach((nodeId) => {
        if (relatedNodes.find(n=>n.id === nodeId) || nextLevelNodeIDs.includes(nodeId)) return;
        const originNode = this.props.nodes.find(n => (n.id === nodeId));
        relatedNodes.push(originNode);
        const nextLevel = originNode.outLinks;
        nextLevel.forEach((outNodeId) => {
          nextLevelNodeIDs.push(outNodeId);
        });
      });
      currentLevelNodeIDs = nextLevelNodeIDs;
    }
    return relatedNodes;
  }

  getAllChildrenNodeIDs(highlightingNode) {
    const relatedNodeIDs = [];
    let currentLevelNodeIDs = highlightingNode.outLinks;
    while (currentLevelNodeIDs.length > 0) {
      let nextLevelNodeIDs = [];
      currentLevelNodeIDs.forEach((nodeId) => {
        if (relatedNodeIDs.includes(nodeId) || nextLevelNodeIDs.includes(nodeId)) return;
        relatedNodeIDs.push(nodeId);
        const originNode = this.props.nodes.find(n => (n.id === nodeId));
        const nextLevel = originNode.outLinks;
        nextLevel.forEach((outNodeId) => {
          nextLevelNodeIDs.push(outNodeId);
        });
      });
      currentLevelNodeIDs = nextLevelNodeIDs;
    }
    return relatedNodeIDs;
  }

  getAllChildrenLinks(highlightingNode) {
    let currentLevelNodeIDs = highlightingNode.outLinks;
    const relatedLinks = currentLevelNodeIDs.map(outID => ({
      source: highlightingNode.id,
      target: outID,
    }));
    while (currentLevelNodeIDs.length > 0) {
      let nextLevelNodeIDs = [];
      currentLevelNodeIDs.forEach((nodeId) => {
        if (nextLevelNodeIDs.includes(nodeId)) return;
        const originNode = this.props.nodes.find(n => (n.id === nodeId));
        const nextLevel = originNode.outLinks;
        nextLevel.forEach((outNodeId) => {
          nextLevelNodeIDs.push(outNodeId);
          relatedLinks.push({
            source: nodeId,
            target: outNodeId,
          });
        });
      });
      currentLevelNodeIDs = nextLevelNodeIDs;
    }
    return relatedLinks;
  }

  /* eslint-disable no-underscore-dangle */
  calculateGraphLayout() {
    const { nodes, edges } = createNodesAndEdges({
      dictionary: this.props.dictionary,
      counts_search: this.props.countsSearch,
      links_search: this.props.linksSearch,
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
            const iconRadius = 10;
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
            const textPadding = 20;
            const fontSize = 10;
            const nodeNames = truncateLines(n.label);
            const rectMinHeight = height;
            const rectHeight = Math.max(rectMinHeight, textPadding * 2 + nodeNames.length * fontSize);
            const requiredPropertiesCount = originNode.required ? originNode.required.length : 0;
            const optionalPropertiesCount = originNode.properties ? Object.keys(originNode.properties).length - requiredPropertiesCount : 0;
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
              names: nodeNames,
              label: n.label,
              level: originNode.positionIndex[1],
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
              pathString = `M${sourePosition[0]} ${sourePosition[1]} L ${targetPosition[0]} ${targetPosition[1]}`;
            }
            const required = edges.find(e => (e.source.id === sourceNode.id && e.target.id === targetNode.id)).required;
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
  }
  /* eslint-enable no-underscore-dangle */

  calculateHighlightRelatedNodeIDs(newHighlightingNode) {
    if (!newHighlightingNode) {
      return [];
    }
    const relatedNodeIDs = this.getAllChildrenNodeIDs(newHighlightingNode);
    if (!relatedNodeIDs.includes(newHighlightingNode.id)) {
      return [newHighlightingNode.id, ...relatedNodeIDs];
    }
    return relatedNodeIDs;
  }

  calculateFurtherClickableNodeIDs(newHighlightingNode) {
    if (!newHighlightingNode) {
      return [];
    }
    return newHighlightingNode.outLinks;
  }

  calculateFurtherHighlightedPath(newHighlightingNode, newFurtherHighlightingNodeID) {
    if (!newHighlightingNode || !newFurtherHighlightingNodeID) {
      return [];
    }
    const nodeAlongPath = [this.props.highlightingNode.id];
    const node = this.props.nodes.find(n => n.id === newFurtherHighlightingNodeID);
    const furtherHighlightedPath = this.getAllChildrenLinks(node);
    furtherHighlightedPath.push({
      source: newHighlightingNode.id,
      target: newFurtherHighlightingNodeID,
    });
    return furtherHighlightedPath;
  }

  isArticulationNode(targetNodeID, startingNodeID, subgraphNodeIDs) {
    // calculate connected node without target node, 
    let currentLevelNodeIDs = [startingNodeID];
    let nodeIDsInSubgraphWithoutTargetNode = [];
    while (currentLevelNodeIDs.length > 0) {
      let nextLevelNodeIDs = [];
      currentLevelNodeIDs.forEach(nodeID => {
        if (nodeIDsInSubgraphWithoutTargetNode.includes(nodeID) || nextLevelNodeIDs.includes(nodeID)) return;
        nodeIDsInSubgraphWithoutTargetNode.push(nodeID);
        const node = this.props.nodes.find(n => n.id === nodeID);
        const neighborNodeIDs = [...node.inLinks, ...node.outLinks];
        neighborNodeIDs
          .filter(nid => subgraphNodeIDs.includes(nid))
          .filter(nid => (nid !== targetNodeID))
          .forEach(nid => {
            nextLevelNodeIDs.push(nid);
          });
      });
      currentLevelNodeIDs = nextLevelNodeIDs;
    }

    // if node count equals nodeCount-1, then not articulation node
    return (nodeIDsInSubgraphWithoutTargetNode.length !== subgraphNodeIDs.length - 1);
  }

  getArticulationNodesInSubgraph(startingNodeID, subgraphNodeIDs) {
    let articulationNodeIDs = [];
    subgraphNodeIDs.forEach(nodeID => {
      if (this.isArticulationNode(nodeID, startingNodeID, subgraphNodeIDs)) {
        articulationNodeIDs.push(nodeID);
      }
    });
    return articulationNodeIDs;
  }

  getNodesAndLinksBetweenArticulationNodes(startingNodeID, endingNodeID, subgraphNodeIDs) {
    const startingNode = this.props.nodes.find(node => node.id === startingNodeID);
    let betweenNodeIDs = [];
    let betweenLinks = startingNode.outLinks.map(outID => ({source: startingNodeID, target: outID}));
    let currentLevelNodeIDs = startingNode.outLinks;
    while (currentLevelNodeIDs.length > 0) {
      let nextLevelNodeIDs = [];
      currentLevelNodeIDs.forEach((nodeID) => {
        if (betweenNodeIDs.includes(nodeID) || nextLevelNodeIDs.includes(nodeID) || nodeID === endingNodeID) return;
        betweenNodeIDs.push(nodeID);
        const node = this.props.nodes.find(n => (n.id === nodeID));
        const nextLevel = node.outLinks;
        nextLevel
          .filter(outNodeID => subgraphNodeIDs.includes(outNodeID))
          .forEach(outNodeID => {
            betweenLinks.push({
              source: nodeID,
              target: outNodeID,
            });
          });
        nextLevel
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
  }

  calculateDataModelStructure(startingNode, subgraphNodeIDs) {
    if (!startingNode) return null;
    const startingNodeID = startingNode.id;
    let articulationNodeIDs = this.getArticulationNodesInSubgraph(
      startingNodeID,
      subgraphNodeIDs,
    );
    console.log('articulationNodeIDs: ', articulationNodeIDs);

    let resultStructure = [];
    for (let i = 1; i < articulationNodeIDs.length; i ++) {
      const { nodeIDs, links } = this.getNodesAndLinksBetweenArticulationNodes(articulationNodeIDs[i-1], articulationNodeIDs[i], subgraphNodeIDs);
      resultStructure.push({
        nodeID: articulationNodeIDs[i-1],
        nodeIDsBefore: nodeIDs,
        linksBefore: links,
      });
    }
    const lastArticulationNodeID = articulationNodeIDs[articulationNodeIDs.length-1];
    const lastArticulationNode = this.props.nodes.find(node => node.id === lastArticulationNodeID);
    const nodeIDsBeforeLastArticulationNode = this.getAllChildrenNodeIDs(lastArticulationNode);
    const linksBeforeLastArticulationNode = this.getAllChildrenLinks(lastArticulationNode);
    resultStructure.push({
      nodeID: lastArticulationNodeID,
      nodeIDsBefore: nodeIDsBeforeLastArticulationNode.length === 1 ? [] : nodeIDsBeforeLastArticulationNode,
      linksBefore: linksBeforeLastArticulationNode,
    });
    if (nodeIDsBeforeLastArticulationNode.length === 1) {
      resultStructure.push({
        nodeID: nodeIDsBeforeLastArticulationNode[0],
        nodeIDsBefore: [],
        linksBefore: [],
      })
    }
    
    resultStructure = resultStructure.map(entry => {
      const {nodeID, nodeIDsBefore, linksBefore} = entry;
      const category = this.props.nodes.find(n => n.id === nodeID).type;
      return {
        nodeID,
        nodeIDsBefore,
        linksBefore,
        category,
      }
    }).reverse();
    console.log('data model structure: ', resultStructure);
    return resultStructure;
  }

  componentWillUpdate(nextProps, nextState) {
    // if the highlighted node is updated, calculate related highlighted nodes
    const newHighlightingNode = nextProps.highlightingNode;
    if (this.oldHighlightingNode !== newHighlightingNode) {
      this.oldHighlightingNode = newHighlightingNode;
      const relatedNodeIDs = this.calculateHighlightRelatedNodeIDs(newHighlightingNode);
      this.props.onHighlightRelatedNodesCalculated(relatedNodeIDs);
      const furtherClickableNodeIDs = this.calculateFurtherClickableNodeIDs(newHighlightingNode);
      this.props.onFurtherClickableNodeIDsCalculated(furtherClickableNodeIDs);
      const dataModelStructure = this.calculateDataModelStructure(
        newHighlightingNode,
        relatedNodeIDs,
      );
      this.props.onDataModelStructureCalculated(dataModelStructure);
    }

    // if the further highlighted node is updated, calculate related highlighted nodes
    const newFurtherHighlightingNodeID = nextProps.furtherHighlightingNodeID;
    if (this.oldFurtherHighlightingNodeID !== newFurtherHighlightingNodeID) {
      this.oldFurtherHighlightingNodeID = newFurtherHighlightingNodeID;
      const furtherHighlightedNodeIDsAlongPath = this.calculateFurtherHighlightedPath(newHighlightingNode, newFurtherHighlightingNodeID);
      this.props.onFurtherHighlightedPathCalculated(furtherHighlightedNodeIDsAlongPath);
    }
  }

  render() {
    return (<React.Fragment />);
  }
}

GraphCalculator.propTypes = {
  dictionary: PropTypes.object,
  countsSearch: PropTypes.array,
  linksSearch: PropTypes.array,
  onGraphLayoutCalculated: PropTypes.func,
  onGraphLegendCalculated: PropTypes.func,
  highlightingNode: PropTypes.object,
  nodes: PropTypes.arrayOf(PropTypes.object),
  edges: PropTypes.arrayOf(PropTypes.object),
  onHighlightRelatedNodesCalculated: PropTypes.func,
  furtherHighlightingNodeID: PropTypes.string,
  onFurtherClickableNodeIDsCalculated: PropTypes.func,
  onFurtherHighlightedPathCalculated: PropTypes.func,
  onDataModelStructureCalculated: PropTypes.func, 
};

GraphCalculator.defaultProps = {
  dictionary: {},
  countsSearch: [],
  linksSearch: [],
  onGraphLayoutCalculated: () => {},
  onGraphLegendCalculated: () => {},
  highlightingNode: null,
  nodes: [],
  edges: [],
  onHighlightRelatedNodesCalculated: () => {},
  furtherHighlightingNodeID: null,
  onFurtherClickableNodeIDsCalculated: () => {},
  onFurtherHighlightedPathCalculated: () => {},
  onDataModelStructureCalculated: () => {},
};

export default GraphCalculator;
