import { render, waitFor } from '@testing-library/react';
import GraphCalculator from './GraphCalculator';
import { testGraph1 } from '../../../GraphUtils/testData';

test('initializes layout on mount', () => {
  const initializeGraphLayout = jest.fn();
  const props = {
    initializeGraphLayout,
  };
  render(<GraphCalculator {...props} />);

  waitFor(() => {
    expect(initializeGraphLayout).toHaveBeenCalledTimes(1);
  });
});

test('updates related highlighted nodes and clickable nodes when highlighted node changes', () => {
  const onDataModelStructureCalculated = jest.fn();
  const onHighlightRelatedNodesCalculated = jest.fn();
  const onPathRelatedToSecondHighlightingNodeCalculated = jest.fn();
  const onSecondHighlightingNodeCandidateIDsCalculated = jest.fn();
  const props = {
    edges: testGraph1.graphEdges,
    nodes: testGraph1.graphNodes,
    onDataModelStructureCalculated,
    onHighlightRelatedNodesCalculated,
    onPathRelatedToSecondHighlightingNodeCalculated,
    onSecondHighlightingNodeCandidateIDsCalculated,
  };
  const { rerender } = render(<GraphCalculator {...props} />);

  rerender(
    <GraphCalculator {...props} highlightingNode={testGraph1.testClickNode} />
  );
  expect(onHighlightRelatedNodesCalculated).toHaveBeenCalledTimes(1);
  expect(
    onSecondHighlightingNodeCandidateIDsCalculated.mock.calls
  ).toHaveLength(1);
  expect(onDataModelStructureCalculated).toHaveBeenCalledTimes(1);

  rerender(
    <GraphCalculator
      {...props}
      secondHighlightingNodeID={testGraph1.testSecondClickNodeID}
    />
  );
  expect(onDataModelStructureCalculated).toHaveBeenCalledTimes(2);
  expect(
    onPathRelatedToSecondHighlightingNodeCalculated.mock.calls
  ).toHaveLength(1);
});
