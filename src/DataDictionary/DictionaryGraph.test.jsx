import React from 'react';
import { mount } from 'enzyme';

import DictionaryGraph from './DictionaryGraph';
import { buildTestData } from '../DataModelGraph/testData';


describe('the DictionaryGraph', () => {
  function buildTest() {
    const data = buildTestData();
    // Material-UI components require the Mui theme ...
    const $dom = mount(
      <DictionaryGraph
        dictionary={data.dictionary}
        counts_search={data.counts_search}
        links_search={data.links_search}
      />,
    );

    const $graph = $dom; // .find('DataModelGraph');
    return { ...data, $graph, $dom };
  }

  it('boots to a full view', () => {
    const { $graph } = buildTest();
    expect($graph.length).toBe(1);
    expect($graph.state('fullToggle')).toBe(true);
  });

  it('toggles between full and compact views', () => {
    const { $graph, $dom } = buildTest();
    const $toggleButton = $dom.find('a#toggle_button');
    expect($toggleButton.length).toBe(1);
    $toggleButton.simulate('click');
    expect($graph.state('fullToggle')).toBe(false);
    expect(document.querySelector('#data_model_graph')).toBeDefined();
    // jsdom does not yet support svg
    // const ellipseList = document.querySelectorAll('ellipse');
  });

  it('has access to the DOM in jest', () => {
    const frick = document.createElement('H1');
    frick.id = 'frickjack';
    document.body.appendChild(frick);
    expect(document.querySelector('h1#frick')).toBeDefined();
  });
});
