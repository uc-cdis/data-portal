import React from 'react';
import { mount } from 'enzyme';
import DataModelStructure from './DataModelStructure';

describe('DataModelStructure', () => {
  /*
   * example structure:
   *
   *     a
   *     |
   *     b
   *    / \
   *   c   d
   *    \ /
   *     e
   *
   */
  const nodeESummary = {
    nodeID: 'e',
    nodeIDsBefore: ['c', 'd'],
    linksBefore: [
      { source: 'b', target: 'c' },
      { source: 'b', target: 'd' },
      { source: 'c', target: 'e' },
      { source: 'd', target: 'e' },
    ],
    category: 'test',
  };
  const dataModelStructure = [
    {
      nodeID: 'a',
      nodeIDsBefore: [],
      linksBefore: [],
      category: 'test',
    },
    {
      nodeID: 'b',
      nodeIDsBefore: [],
      linksBefore: [{ source: 'a', target: 'b' }],
      category: 'test',
    },
    nodeESummary,
  ];
  const graphFunc = jest.fn();
  const overlayFunc = jest.fn();
  const resetFunc = jest.fn();
  const downloadMultiTemplateFunc = jest.fn();
  const allRoutes = [
    ['a', 'b', 'c', 'e'],
    ['a', 'b', 'd', 'e'],
  ];
  const clickingNodeName = 'e';
  const dictionaryVersion = '1';
  const wrapper = mount(
    <DataModelStructure
      dataModelStructure={dataModelStructure}
      isGraphView
      overlayPropertyHidden
      onSetGraphView={graphFunc}
      onSetOverlayPropertyTableHidden={overlayFunc}
      onResetGraphCanvas={resetFunc}
      downloadMultiTemplate={downloadMultiTemplateFunc}
      excludedNodesForTemplates={['a']}
      relatedNodeIDs={['a', 'b', 'c', 'd', 'e']}
      allRoutes={allRoutes}
      clickingNodeName={clickingNodeName}
      dictionaryVersion={dictionaryVersion}
    />,
  );

  it('can render', () => {
    expect(wrapper.find('.data-model-structure').length).toBe(1);
    expect(wrapper.find('.data-model-structure__node').length).toBe(3); // 'a', 'b', 'e'
    expect(wrapper.find('.data-model-structure__summary-between').text())
      .toEqual(`${nodeESummary.nodeIDsBefore.length} nodes with ${nodeESummary.linksBefore.length} links`);
  });

  it('can open overlay table or switch to graph view ', () => {
    // click overlay table button
    const tableButton = wrapper.find('.data-model-structure__table-button').first();
    tableButton.simulate('click');
    expect(overlayFunc.mock.calls.length).toBe(1);
    expect(graphFunc.mock.calls.length).toBe(1);

    // click "see it in graph" button
    wrapper.setProps({ isGraphView: false });
    const graphButton = wrapper.find('.data-model-structure__graph-button').first();
    graphButton.simulate('click');
    expect(graphFunc.mock.calls.length).toBe(2);
    expect(resetFunc.mock.calls.length).toBe(1);
  });

  it('can download templates for selected nodes', () => {
    wrapper.setProps({ isGraphView: true });
    expect(wrapper.find('div.data-model-structure__template-download-dropdown').length).toBe(1);
    const dropdownButton = wrapper.find('div.data-model-structure__template-download-dropdown').first();
    dropdownButton.simulate('click');
    expect(wrapper.find('.g3-dropdown__item').length).toBe(2); // 'tsv', 'json'
    const tsvButton = wrapper.find('.g3-dropdown__item').first();
    tsvButton.simulate('click');
    expect(downloadMultiTemplateFunc.mock.calls.length).toBe(1);
    const expectedFormatArg = 'tsv';
    const expectedNodesToDownloadArg = {
      b: 'b-template.tsv',
      c: 'c-template.tsv',
      d: 'd-template.tsv',
      e: 'e-template.tsv',
    };
    const expectedRoutes = [
      ['b', 'c', 'e'],
      ['b', 'd', 'e'],
    ];
    expect(downloadMultiTemplateFunc.mock.calls[0][0]).toBe(expectedFormatArg);
    expect(downloadMultiTemplateFunc.mock.calls[0][1]).toEqual(expectedNodesToDownloadArg);
    expect(downloadMultiTemplateFunc.mock.calls[0][2]).toEqual(expectedRoutes);
    expect(downloadMultiTemplateFunc.mock.calls[0][3]).toEqual(clickingNodeName);
    expect(downloadMultiTemplateFunc.mock.calls[0][4]).toEqual(dictionaryVersion);
  });

  it('cannot download templates if selected nodes are all excluded', () => {
    wrapper.setProps({ excludedNodesForTemplates: ['a', 'b', 'c', 'd', 'e'] });
    expect(wrapper.find('div.data-model-structure__template-download-dropdown').length).toBe(0);
  });
});
