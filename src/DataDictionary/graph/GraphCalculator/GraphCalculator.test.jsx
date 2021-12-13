import { render, waitFor } from '@testing-library/react';
import GraphCalculator from './GraphCalculator';
import { buildTestData, testGraph1 } from '../../../GraphUtils/testData';

const data = buildTestData();

test('calculates layout and legend on mount', () => {
  const onGraphLayoutCalculated = jest.fn();
  const onGraphLegendCalculated = jest.fn();
  const props = {
    dictionary: data.dictionary,
    onGraphLayoutCalculated,
    onGraphLegendCalculated,
  };
  render(<GraphCalculator {...props} />);

  waitFor(() => {
    expect(onGraphLayoutCalculated).toHaveBeenCalledTimes(1);
    expect(onGraphLegendCalculated).toHaveBeenCalledTimes(1);
  });
});

test('updates related highlighted nodes and clickable nodes when highlighted node changes', () => {
  const onDataModelStructureCalculated = jest.fn();
  const onHighlightRelatedNodesCalculated = jest.fn();
  const onPathRelatedToSecondHighlightingNodeCalculated = jest.fn();
  const onSecondHighlightingNodeCandidateIDsCalculated = jest.fn();
  const props = {
    dictionary: data.dictionary,
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
