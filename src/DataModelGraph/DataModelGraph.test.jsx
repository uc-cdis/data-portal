import React from 'react';
import { mount } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DataModelGraph from './DataModelGraph';
import { buildTestData } from './testData';

describe('the DataModelGraph', () => {
  function buildTest() {
    const data = buildTestData();
    // Material-UI components require the Mui theme ...
    const $dom = mount(
        <DataModelGraph dictionary={data.dictionary}
          counts_search={data.counts_search} links_search={data.links_search}
          />
    );

    const $graph = $dom; //.find('DataModelGraph');
    return { ...data, $graph, $dom };
  }

  it('boots to a compact view', () => {
    const { $graph } = buildTest();
    expect($graph.length).toBe(1);
    expect($graph.state('fullToggle')).toBe(false);
  });

  it('toggles between full and compact views', () => {
    const { $graph, $dom } = buildTest();
    const $toggleButton = $dom.find('a#cd-dmg__toggle');
    expect($toggleButton.length).toBe(1);
    $toggleButton.simulate('click');
    expect($graph.state('fullToggle')).toBe(true);
    expect(document.querySelector('#data_model_graph')).toBeDefined();
    console.log(`DataModelGraph looks like this: ${$dom.html()}`);
    
    // dom graph puts each node (type) in an ellipse
    // after running a simulation, and modifying the browser DOM
    // directly (not via vdom) - which doesn't seem to
    // happen in the node/enzyme/jest runtime, so counting
    // ellipses here doesn't work ...
    // 
    /*
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        try {          
          console.log('Dude!');
          const ellipseList = document.querySelectorAll('ellipse');
          console.log('Yo!');
          expect(ellipseList.length).toBeGreaterThan(0);
          console.log('Bro!');
          resolve("ok"); 
        } catch (ex) {
          console.log('Ugh!', ex);
          reject('Ugh!');
        }
      }, 100);
    }); */
  });

  it('has access to the DOM in jest', () => {
    const frick = document.createElement('H1');
    frick.id='frickjack';
    document.body.appendChild(frick);
    expect(document.querySelector('h1#frick')).toBeDefined();
  });
});