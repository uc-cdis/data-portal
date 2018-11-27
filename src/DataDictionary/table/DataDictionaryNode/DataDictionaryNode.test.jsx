import React from 'react';
import { mount } from 'enzyme';
import DataDictionaryNode from './.';

describe('DataDictionaryNode', () => {
  const node = {
    id: 'a',
    title: 'test title',
    category: 'test',
    properties: { pro1: {}, pro2: {} },
    required: ['pro1'],
  };
  const expandFunc = jest.fn();
  const wrapper = mount(
    <DataDictionaryNode
      node={node}
      description='test description'
      expanded={false}
      onExpandNode={expandFunc}
    />,
  );

  it('can render and toggle properties', () => {
    expect(wrapper.find('.data-dictionary-node').length).toBe(1);
    expect(wrapper.find('.data-dictionary-node__property').length).toBe(0);

    // expand node
    const nodeElem = wrapper.find('.data-dictionary-node').first();
    nodeElem.simulate('click');
    expect(expandFunc.mock.calls.length).toBe(1);
    wrapper.setProps({ expanded: true });
    expect(wrapper.find('.data-dictionary-node__property').length).toBe(1);

    // unexpand node
    const closeElem = wrapper.find('.data-dictionary-node__property-close').first();
    closeElem.simulate('click');
    expect(expandFunc.mock.calls.length).toBe(2);
  });
});
