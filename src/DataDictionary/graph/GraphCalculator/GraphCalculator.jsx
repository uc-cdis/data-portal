import React from 'react';
import PropTypes from 'prop-types';
import {
  getAllTypes,
  getAllChildrenNodeIDs,
  getAllChildrenLinks,
  calculateGraphLayout,
  getArticulationNodesInSubgraph,
  sortNodesByTopology,
  getNodesAndLinksBetweenArticulationNodesInSubgraph,
} from './graphCalculatorHelper';

class GraphCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.oldHighlightingNode = null;
  }

  componentDidMount() {
    calculateGraphLayout(
      this.props.dictionary,
      this.props.countsSearch,
      this.props.linksSearch,
    ).then((layoutResult) => {
      this.props.onGraphLayoutCalculated(layoutResult);
      const legendItems = getAllTypes(layoutResult);
      this.props.onGraphLegendCalculated(legendItems);
    });
  }

  componentWillUpdate(nextProps) {
    // if the highlighted node is updated, calculate related highlighted nodes
    const newHighlightingNode = nextProps.highlightingNode;
    const newFurtherHighlightingNodeID = nextProps.furtherHighlightingNodeID;
    if (this.oldHighlightingNode !== newHighlightingNode) {
      const relatedHighlightedNodeIDs = this.calculateHighlightRelatedNodeIDs(newHighlightingNode);
      this.props.onHighlightRelatedNodesCalculated(relatedHighlightedNodeIDs);
      const furtherClickableNodeIDs = newHighlightingNode ? newHighlightingNode.outLinks : [];
      this.props.onFurtherClickableNodeIDsCalculated(furtherClickableNodeIDs);
    }

    // if the further highlighted node is updated, calculate related highlighted nodes
    if (this.oldFurtherHighlightingNodeID !== newFurtherHighlightingNodeID) {
      const furtherHighlightedPath = this.calculateFurtherHighlightedPath(
        newHighlightingNode,
        newFurtherHighlightingNodeID,
      );
      this.props.onFurtherHighlightedPathCalculated(furtherHighlightedPath);
    }

    // update data model structure
    if (this.oldHighlightingNode !== newHighlightingNode
      || this.oldFurtherHighlightingNodeID !== newFurtherHighlightingNodeID) {
      if (newFurtherHighlightingNodeID) {
        const subgraphNodeIDs = [];
        const furtherHighlightedPath = this.calculateFurtherHighlightedPath(
          newHighlightingNode,
          newFurtherHighlightingNodeID,
        );
        furtherHighlightedPath.forEach((e) => {
          if (!subgraphNodeIDs.includes(e.source)) subgraphNodeIDs.push(e.source);
          if (!subgraphNodeIDs.includes(e.target)) subgraphNodeIDs.push(e.target);
        });
        const dataModelStructure = this.calculateDataModelStructure(
          newHighlightingNode,
          subgraphNodeIDs,
          furtherHighlightedPath,
        );
        this.props.onDataModelStructureCalculated(dataModelStructure);
      } else if (newHighlightingNode) {
        const relatedHighlightedNodeIDs = this.calculateHighlightRelatedNodeIDs(
          newHighlightingNode,
        );
        const dataModelStructure = this.calculateDataModelStructure(
          newHighlightingNode,
          relatedHighlightedNodeIDs,
          this.props.edges
            .filter(e => (relatedHighlightedNodeIDs.includes(e.source)
              && relatedHighlightedNodeIDs.includes(e.target)))
            .map(e => ({ source: e.source, target: e.target })),
        );
        this.props.onDataModelStructureCalculated(dataModelStructure);
      } else {
        this.props.onDataModelStructureCalculated(null);
      }
    }

    this.oldHighlightingNode = newHighlightingNode;
    this.oldFurtherHighlightingNodeID = newFurtherHighlightingNodeID;
  }

  calculateFurtherHighlightedPath(newHighlightingNode, newFurtherHighlightingNodeID) {
    if (!newHighlightingNode || !newFurtherHighlightingNodeID) {
      return [];
    }
    const node = this.props.nodes.find(n => n.id === newFurtherHighlightingNodeID);
    const furtherHighlightedPath = getAllChildrenLinks(node, this.props.nodes);
    furtherHighlightedPath.push({
      source: newHighlightingNode.id,
      target: newFurtherHighlightingNodeID,
    });
    return furtherHighlightedPath;
  }

  calculateDataModelStructure(startingNode, subgraphNodeIDs, subgraphEdges) {
    if (!startingNode) return null;
    const startingNodeID = startingNode.id;
    const articulationNodeIDs = getArticulationNodesInSubgraph(
      startingNodeID,
      subgraphNodeIDs,
      subgraphEdges,
      this.props.nodes,
    );

    if (!articulationNodeIDs || articulationNodeIDs.length === 0) return null;
    const sortedArticulationNodeIDs = sortNodesByTopology(
      articulationNodeIDs,
      subgraphNodeIDs,
      subgraphEdges,
      this.props.nodes,
    );
    if (!sortedArticulationNodeIDs || sortedArticulationNodeIDs.length === 0) { // loop in graph
      return null;
    }
    let resultStructure = [];
    for (let i = 1; i < sortedArticulationNodeIDs.length; i += 1) {
      const { nodeIDs, links } = getNodesAndLinksBetweenArticulationNodesInSubgraph(
        sortedArticulationNodeIDs[i - 1],
        sortedArticulationNodeIDs[i],
        subgraphNodeIDs,
        subgraphEdges,
        this.props.nodes,
      );
      resultStructure.push({
        nodeID: sortedArticulationNodeIDs[i - 1],
        nodeIDsBefore: nodeIDs,
        linksBefore: links,
      });
    }
    const lastArticulationNodeID = sortedArticulationNodeIDs[sortedArticulationNodeIDs.length - 1];
    const lastArticulationNode = this.props.nodes.find(node => node.id === lastArticulationNodeID);
    const nodeIDsBeforeLastArticulationNode = getAllChildrenNodeIDs(
      lastArticulationNode,
      this.props.nodes,
    );
    const linksBeforeLastArticulationNode = getAllChildrenLinks(
      lastArticulationNode,
      this.props.nodes,
    );
    resultStructure.push({
      nodeID: lastArticulationNodeID,
      nodeIDsBefore: nodeIDsBeforeLastArticulationNode.length === 1 ? []
        : nodeIDsBeforeLastArticulationNode,
      linksBefore: linksBeforeLastArticulationNode,
    });
    if (nodeIDsBeforeLastArticulationNode.length === 1) {
      resultStructure.push({
        nodeID: nodeIDsBeforeLastArticulationNode[0],
        nodeIDsBefore: [],
        linksBefore: [],
      });
    }

    resultStructure = resultStructure.map((entry) => {
      const { nodeID, nodeIDsBefore, linksBefore } = entry;
      const category = this.props.nodes.find(n => n.id === nodeID).type;
      return {
        nodeID,
        nodeIDsBefore,
        linksBefore,
        category,
      };
    }).reverse();
    return resultStructure;
  }


  calculateHighlightRelatedNodeIDs(newHighlightingNode) {
    if (!newHighlightingNode) {
      return [];
    }
    const relatedNodeIDs = getAllChildrenNodeIDs(newHighlightingNode, this.props.nodes);
    if (!relatedNodeIDs.includes(newHighlightingNode.id)) {
      return [newHighlightingNode.id, ...relatedNodeIDs];
    }
    return relatedNodeIDs;
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
