import React from 'react';
import { mount } from 'enzyme';
import DataModelStructure from './DataModelStructure';

describe('DataModelStructure', () => {
  const dataModelStructure = [{
    nodeID: 'a',
    nodeIDsBefore: ['b', 'c'],
    linksBefore: [{ source: 'a', target: 'b' }, { source: 'a', target: 'c' }],
    category: 'test',
  }];
  const graphFunc = jest.fn();
  const overlayFunc = jest.fn();
  const resetFunc = jest.fn();
  const wrapper = mount(
    <DataModelStructure
      dataModelStructure={dataModelStructure}
      isGraphView
      overlayPropertyHidden
      onSetGraphView={graphFunc}
      onSetOverlayPropertyTableHidden={overlayFunc}
      onResetGraphCanvas={resetFunc}
    />,
  );

  it('can render', () => {
    expect(wrapper.find('.data-model-structure').length).toBe(1);
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
});
