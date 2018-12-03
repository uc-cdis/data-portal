import {
  buildTestData,
  testGraph1,
} from '../../../GraphUtils/testData';
import {
  calculateGraphLayout,
  getAllTypes,
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
