import React from 'react';
import { mount } from 'enzyme';
import GraphCalculator from './GraphCalculator';
import {
  buildTestData,
  testGraph1,
} from '../../../GraphUtils/testData';

describe('GraphCalculator', () => {
  const data = buildTestData();
  const layoutCallback = jest.fn();
  const legendCallback = jest.fn();
  const highlightCallback = jest.fn();
  const candidateCalculatedCallback = jest.fn();
  const pathCallback = jest.fn();
  const dataModelCallback = jest.fn();
  const graphCalculator = mount(
    <GraphCalculator
      dictionary={data.dictionary}
      countsSearch={[]}
      linksSearch={[]}
      onGraphLayoutCalculated={layoutCallback}
      onGraphLegendCalculated={legendCallback}
      onHighlightRelatedNodesCalculated={highlightCallback}
      onSecondHighlightingNodeCandidateIDsCalculated={candidateCalculatedCallback}
      onPathRelatedToSecondHighlightingNodeCalculated={pathCallback}
      onDataModelStructureCalculated={dataModelCallback}
    />,
  );

  it('can calculate layout and legend', () => {
    expect(layoutCallback.mock.calls.length).toBe(1);
    expect(legendCallback.mock.calls.length).toBe(1);
  });

  it('can update related highlighted nodes and clickable nodes when highlighted node changes', () => {
    graphCalculator.setProps({
      nodes: testGraph1.graphNodes,
      edges: testGraph1.graphEdges,
    });
    graphCalculator.setProps({
      highlightingNode: testGraph1.testClickNode,
    });
    expect(highlightCallback.mock.calls.length).toBe(1);
    expect(candidateCalculatedCallback.mock.calls.length).toBe(1);
    expect(dataModelCallback.mock.calls.length).toBe(1);
    graphCalculator.setProps({
      secondHighlightingNodeID: testGraph1.testSecondClickNodeID,
    });
    expect(pathCallback.mock.calls.length).toBe(1);
    expect(dataModelCallback.mock.calls.length).toBe(2);
  });
});
