import {
  testGraph1,
} from '../../../GraphUtils/testData';
import {
  getAllChildrenNodeIDs,
  getAllChildrenLinks,
  isArticulationNodeInSubgraph,
  getArticulationNodesInSubgraph,
  BFSTraverseSubgraph,
  sortNodesByTopology,
  getNodesAndLinksSummaryBetweenNodesInSubgraph,
  getNodeIDsThatHaveNoInOrOutLinks,
} from './graphStructureHelper';

describe('graphCalculatorHelper', () => {
  it('can get all children node IDs', () => {
    const resultNodeIDs = getAllChildrenNodeIDs(testGraph1.startingNode.id, testGraph1.graphNodes);
    expect(resultNodeIDs).toEqual(testGraph1.expectedChildrenNodeIDs);
  });

  it('can get all children links', () => {
    const resultLinks = getAllChildrenLinks(testGraph1.startingNode.id, testGraph1.graphNodes);
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
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(result).toEqual(testGraph1.expectedArticulationNodesInSubgraph);
  });

  it('can traverse subgraph in BFS order', () => {
    const bfsResult = BFSTraverseSubgraph(
      true,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(bfsResult).toEqual(testGraph1.expectedBFSTraverseSubgraph);
    const bfsResult2 = BFSTraverseSubgraph(
      false,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(bfsResult2).toEqual(testGraph1.expectedBFSTraverseSubgraphReverseDirection);
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
    const resultNodeIDsWithoutInLinks = getNodeIDsThatHaveNoInOrOutLinks(
      true,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    const resultNodeIDsWithoutOutLinks = getNodeIDsThatHaveNoInOrOutLinks(
      false,
      testGraph1.testSubgraph,
      testGraph1.testSubgraphEdges,
      testGraph1.graphNodes,
    );
    expect(resultNodeIDsWithoutInLinks).toEqual(testGraph1.expectedNodeIDsWithNoInLinks);
    expect(resultNodeIDsWithoutOutLinks).toEqual(testGraph1.expectedNodeIDsWithNoOutLinks);
  });
});
