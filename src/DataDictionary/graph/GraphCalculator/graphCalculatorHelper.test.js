import {
  buildTestData,
  testGraph1,
} from '../../../GraphUtils/testData';
import {
  calculateGraphLayout,
  getAllTypes,
  getAllChildrenNodeIDs,
  getAllChildrenLinks,
  isArticulationNodeInSubgraph,
  getArticulationNodesInSubgraph,
  BFSTraverseSubgraph,
  sortNodesByTopology,
  getNodesAndLinksSummaryBetweenNodesInSubgraph,
  getNodeIDsThatHaveNoInLinks,
  getNodeIDsThatHaveNoOutLinks,
  calculateHighlightRelatedNodeIDs,
  calculatePathRelatedToSecondHighlightingNode,
  calculateDataModelStructure,
} from './graphCalculatorHelper';

describe('graphCalculatorHelper', () => {
  const { dictionary, nodes, edges } = buildTestData();

  it('can calculate layout', async () => {
    const layout = await calculateGraphLayout(dictionary);
    layout.nodes.forEach((n) => {
      expect(nodes.find(testN => testN.id === n.id)).toBeDefined();
    });
    layout.edges.forEach((e) => {
      const found = edges.find(testE => testE.source === e.source && testE.target === e.target);
      expect(found).toBeDefined();
    });
  });

  it('can get all types', () => {
    const types = getAllTypes(testGraph1.graphNodes);
    expect(types).toEqual(testGraph1.expectedNodeTypes);
  });

  it('can get all children node IDs', () => {
    const resultNodeIDs = getAllChildrenNodeIDs(testGraph1.startingNode, testGraph1.graphNodes);
    expect(resultNodeIDs).toEqual(testGraph1.expectedChildrenNodeIDs);
  });

  it('can get all children links', () => {
    const resultLinks = getAllChildrenLinks(testGraph1.startingNode, testGraph1.graphNodes);
    expect(resultLinks).toEqual(testGraph1.expectedChildrenLinks);
  });

  it('can judge articulation node from subgraph', () => {
    const result = isArticulationNodeInSubgraph(
      testGraph1.expectedArticulationNodesInSubgraph[0],
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(result).toBe(true);
  });

  it('can get articulation nodes from subgraph', () => {
    const result = getArticulationNodesInSubgraph(
      testGraph1.startingNode.id,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(result).toEqual(testGraph1.expectedArticulationNodesInSubgraph);
  });

  it('can averse subgraph in BFS order', () => {
    const bfsResult = BFSTraverseSubgraph(
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(bfsResult).toEqual(testGraph1.expectedBFSTraverseSubgraph);
  });

  it('can sort nodes in subgraph in topology order', () => {
    const sorted = sortNodesByTopology(
      testGraph1.testNodeIDsForSort,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(sorted).toEqual(testGraph1.expectedSorteddNodeIDs);
  });

  it('can get nodes and links summary between nodes in subgraph', () => {
    const result = getNodesAndLinksSummaryBetweenNodesInSubgraph(
      testGraph1.testNode1,
      testGraph1.testNode2,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(result).toEqual(testGraph1.expectedSummary);
  });

  it('can get nodes that have no in/out links in subgraph', () => {
    const resultNodeIDsWithoutInLinks = getNodeIDsThatHaveNoInLinks(
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    const resultNodeIDsWithoutOutLinks = getNodeIDsThatHaveNoOutLinks(
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(resultNodeIDsWithoutInLinks).toEqual(testGraph1.expectedNodeIDsWithNoInLinks);
    expect(resultNodeIDsWithoutOutLinks).toEqual(testGraph1.expectedNodeIDsWithNoOutLinks);
  });

  it('can calculate related highlighting node IDs', () => {
    const relatedHighlightingNodeIDs = calculateHighlightRelatedNodeIDs(
      testGraph1.testClickNode,
      testGraph1.graphNodes,
    );
    expect(relatedHighlightingNodeIDs).toEqual(testGraph1.expectedRelatedNodeIDs);
  });

  it('can calculate second highlighting node path', () => {
    const pathRelatedToSecondHighlightingNode = calculatePathRelatedToSecondHighlightingNode(
      testGraph1.testClickNode,
      testGraph1.testSecondClickNodeID,
      testGraph1.graphNodes,
    );
    expect(pathRelatedToSecondHighlightingNode).toEqual(testGraph1.expectedSecondHighlightedPath);
  });

  it('can calculate data model structure', () => {
    const dataModelStructure = calculateDataModelStructure(
      testGraph1.startingNode,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(dataModelStructure).toEqual(testGraph1.expectedDataModelStructure);
  });
});
