import React from 'react';
import PropTypes from 'prop-types';
import {
  getAllTypes,
  calculateGraphLayout,
  calculateFurtherHighlightedPath,
  calculateHighlightRelatedNodeIDs,
  calculateDataModelStructure,
} from './graphCalculatorHelper';

class GraphCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.oldHighlightingNode = null;
    this.oldFurtherHighlightingNodeID = null;
  }

  componentDidMount() {
    calculateGraphLayout(
      this.props.dictionary,
      this.props.countsSearch,
      this.props.linksSearch,
    ).then((layoutResult) => {
      this.props.onGraphLayoutCalculated(layoutResult);
      const legendItems = getAllTypes(layoutResult.nodes);
      this.props.onGraphLegendCalculated(legendItems);
    });
  }

  componentWillUpdate(nextProps) {
    // if the highlighted node is updated, calculate related highlighted nodes
    const newHighlightingNode = nextProps.highlightingNode;
    const newSecondHighlightingNodeID = nextProps.secondHighlightingNodeID;
    if (this.oldHighlightingNode !== newHighlightingNode) {
      const relatedHighlightedNodeIDs = calculateHighlightRelatedNodeIDs(
        newHighlightingNode,
        this.props.nodes,
      );
      this.props.onHighlightRelatedNodesCalculated(relatedHighlightedNodeIDs);
      const clickableHighlightedNodeIDs = newHighlightingNode ? newHighlightingNode.outLinks : [];
      this.props.onFurtherClickableNodeIDsCalculated(clickableHighlightedNodeIDs);
    }

    // if the second highlighted node is updated, calculate related highlighted nodes
    if (this.oldFurtherHighlightingNodeID !== newSecondHighlightingNodeID) {
      const furtherHighlightedPath = calculateFurtherHighlightedPath(
        newHighlightingNode,
        newSecondHighlightingNodeID,
        this.props.nodes,
      );
      this.props.onFurtherHighlightedPathCalculated(furtherHighlightedPath);
    }

    // update data model structure if update highlighted/furtherHighlighted node
    if (this.oldHighlightingNode !== newHighlightingNode
      || this.oldFurtherHighlightingNodeID !== newSecondHighlightingNodeID
    ) {
      if (newSecondHighlightingNodeID) {
        const dataModelStructure = this.getDataModelStructureForFurtherHighlightedNodes(
          newHighlightingNode,
          newSecondHighlightingNodeID,
        );
        this.props.onDataModelStructureCalculated(dataModelStructure);
      } else if (newHighlightingNode) {
        const dataModelStructure = this.getDataModelStructureForHighlightedNodes(
          newHighlightingNode,
        );
        this.props.onDataModelStructureCalculated(dataModelStructure);
      } else {
        this.props.onDataModelStructureCalculated(null);
      }
    }

    this.oldHighlightingNode = newHighlightingNode;
    this.oldFurtherHighlightingNodeID = newSecondHighlightingNodeID;
  }

  getDataModelStructureForHighlightedNodes(newHighlightingNode) {
    const relatedHighlightedNodeIDs = calculateHighlightRelatedNodeIDs(
      newHighlightingNode,
      this.props.nodes,
    );
    const subgraphEdges = this.props.edges
      .filter(e => (relatedHighlightedNodeIDs.includes(e.source)
        && relatedHighlightedNodeIDs.includes(e.target)))
      .map(e => ({ source: e.source, target: e.target }));
    const dataModelStructure = calculateDataModelStructure(
      newHighlightingNode,
      relatedHighlightedNodeIDs,
      subgraphEdges,
      this.props.nodes,
    );
    return dataModelStructure;
  }

  getDataModelStructureForFurtherHighlightedNodes(
    newHighlightingNode,
    newSecondHighlightingNodeID,
  ) {
    const subgraphNodeIDs = [];
    const furtherHighlightedPath = calculateFurtherHighlightedPath(
      newHighlightingNode,
      newSecondHighlightingNodeID,
      this.props.nodes,
    );
    furtherHighlightedPath.forEach((e) => {
      if (!subgraphNodeIDs.includes(e.source)) subgraphNodeIDs.push(e.source);
      if (!subgraphNodeIDs.includes(e.target)) subgraphNodeIDs.push(e.target);
    });
    const dataModelStructure = calculateDataModelStructure(
      newHighlightingNode,
      subgraphNodeIDs,
      furtherHighlightedPath,
      this.props.nodes,
    );
    return dataModelStructure;
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
  nodes: PropTypes.arrayOf(PropTypes.object),
  edges: PropTypes.arrayOf(PropTypes.object),
  highlightingNode: PropTypes.object,
  onHighlightRelatedNodesCalculated: PropTypes.func,
  onFurtherClickableNodeIDsCalculated: PropTypes.func,
  secondHighlightingNodeID: PropTypes.string,
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
  secondHighlightingNodeID: null,
  onFurtherClickableNodeIDsCalculated: () => {},
  onFurtherHighlightedPathCalculated: () => {},
  onDataModelStructureCalculated: () => {},
};

export default GraphCalculator;
