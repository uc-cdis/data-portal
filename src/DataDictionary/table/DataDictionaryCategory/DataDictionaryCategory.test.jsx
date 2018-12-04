import React from 'react';
import { mount } from 'enzyme';
import DataDictionaryCategory from './.';
import DataDictionaryNode from '../DataDictionaryNode/.';

describe('DataDictionaryCategory', () => {
  const nodes = [
    { id: 'a', description: 'node a description' },
    { id: 'b', description: 'node b description' },
  ];
  const expandFunc = jest.fn();
  const wrapper = mount(
    <DataDictionaryCategory
      category='test'
      nodes={nodes}
      highlightingNodeID={null}
      onExpandNode={expandFunc}
    />,
  );

  it('can render', () => {
    expect(wrapper.find('.data-dictionary-category').length).toBe(1);
    expect(wrapper.find(DataDictionaryNode).length).toBe(nodes.length);
  });
});
