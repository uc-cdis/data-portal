import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import DataDictionaryGraph from './DataDictionaryGraph';
import { buildTestData } from '../../DataModelGraph/testData';


describe('the DataDictionaryGraph', () => {
  function buildTest() {
    const data = buildTestData();
    // Material-UI components require the Mui theme ...
    const $dom = mount(
      <StaticRouter location={{ pathname: '/dd/graph' }} context={{}}>
        <DataDictionaryGraph
          dictionary={data.dictionary}
          counts_search={data.counts_search}
          links_search={data.links_search}
        />
      </StaticRouter>,
    );

    const $graph = $dom.find(DataDictionaryGraph);
    return { ...data, $graph, $dom };
  }

  it.skip('boots to a full view', () => {
    const { $graph } = buildTest();
    expect($graph.length).toBe(1);
    expect(!!$graph.find('div[data-toggle="full"]')).toBe(true);
  });

  it.skip('toggles between full and compact views', () => {
    const { $graph, $dom } = buildTest();
    const $toggleButton = $dom.find('button#toggle_button');
    expect($toggleButton.length).toBe(1);
    $toggleButton.simulate('click');
    expect(!!$graph.find('div[data-toggle="abridged"]')).toBe(true);
    expect(document.querySelector('#data_model_graph')).toBeDefined();
    // jsdom does not yet support svg
    // const ellipseList = document.querySelectorAll('ellipse');
  });

  it.skip('has access to the DOM in jest', () => {
    const frick = document.createElement('H1');
    frick.id = 'frickjack';
    document.body.appendChild(frick);
    expect(document.querySelector('h1#frick')).toBeDefined();
  });
});
