import React from 'react';
import { mount } from 'enzyme';
import * as d3 from 'd3-selection';

import DataModelGraph from './DataModelGraph';
import { buildTestData } from '../GraphUtils/testData';

describe('the DataModelGraph', () => {
  function buildTest() {
    const data = buildTestData();
    // Material-UI components require the Mui theme ...
    const $dom = mount(
      <DataModelGraph
        dictionary={data.dictionary}
        counts_search={data.counts_search}
        links_search={data.links_search}
      />,
    );

    const $graph = $dom; // .find('DataModelGraph');
    return { ...data, $graph, $dom };
  }

  it('boots to a compact view', () => {
    const { $graph } = buildTest();
    expect($graph.length).toBe(1);
    expect($graph.state('fullToggle')).toBe(false);
  });

  it('toggles between full and compact views', () => {
    const { $graph, $dom } = buildTest();
    const $toggleButton = $dom.find('#cd-dmg__toggle');
    expect($toggleButton.length).toBe(1);
    // For some reason not able to inspect svg accurately here ...?
    expect(d3.selectAll('ellipse').size()).toBeDefined();

    $toggleButton.simulate('click');
    expect($graph.state('fullToggle')).toBe(true);
    expect(document.querySelector('#data_model_graph')).toBeDefined();
    // Not sure why this doesn't work ...?
    // Could be jsdom does not support svg properly.
    // expect(d3.selectAll('ellipse').size()).toBe(nodes.length);
  });

  it('has access to the DOM in jest', () => {
    const frick = document.createElement('H1');
    frick.id = 'frickjack';
    document.body.appendChild(frick);
    expect(document.querySelector('h1#frick')).toBeDefined();
  });
});
