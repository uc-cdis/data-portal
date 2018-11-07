import React from 'react';
import PropTypes from 'prop-types';
import Viz from 'viz.js';
import _ from 'underscore';
import { Module, render } from 'viz.js/full.render';
import { createNodesAndEdges, createDotStrinByNodesEdges } from '../../DataModelGraph/utils';
import { truncateLines } from './utils';
import { getCategoryColor } from '../../utils';

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

  getAllChildrenNodeIDs(highlightingNode) {
    const relatedNodeIDs = [];
    let currentLevelNodeIDs = highlightingNode.outLinks;
    while (currentLevelNodeIDs.length > 0) {
      const nextLevelNodeIDs = [];
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
      const nextLevelNodeIDs = [];
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
            const iconRadius = 10;
            const textPadding = 20;
            const fontSize = 10;
            const nodeNames = truncateLines(n.label);
            const rectMinHeight = height - iconRadius;
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
            const inNode = renderedNodes.find(node => node._gvid === edge.tail);
            const outNode = renderedNodes.find(node => node._gvid === edge.head);
            if (inNode.level === outNode.level + 1) {
              const inPosition = [
                (inNode.boundingBox.x1 + inNode.boundingBox.x2) / 2,
                inNode.boundingBox.y1,
              ];
              const outPosition = [
                (outNode.boundingBox.x1 + outNode.boundingBox.x2) / 2,
                outNode.boundingBox.y2,
              ];
              pathString = `M${inPosition[0]} ${inPosition[1]} L ${outPosition[0]} ${outPosition[1]}`;
            }
            const required = edges.find(e => (e.source.id === inNode.id && e.target.id === outNode.id)).required;
            return {
              source: inNode.id,
              target: outNode.id,
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
      relatedNodeIDs.push(newHighlightingNode.id);
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

  componentWillUpdate(nextProps, nextState) {
    // if the highlighted node is updated, calculate related highlighted nodes
    const newHighlightingNode = nextProps.highlightingNode;
    if (this.oldHighlightingNode !== newHighlightingNode) {
      this.oldHighlightingNode = newHighlightingNode;
      const relatedNodeIDs = this.calculateHighlightRelatedNodeIDs(newHighlightingNode);
      this.props.onHighlightRelatedNodesCalculated(relatedNodeIDs);
      const furtherClickableNodeIDs = this.calculateFurtherClickableNodeIDs(newHighlightingNode);
      this.props.onFurtherClickableNodeIDsCalculated(furtherClickableNodeIDs);
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
};

export default GraphCalculator;
