import React from 'react';
import { mount } from 'enzyme';
import DictionarySearcher from './DictionarySearcher';

describe('DictionarySearcher', () => {
  const testDict = {
    a1: {
      id: 'a1',
      category: 'A',
      description: 'whatever',
      properties: [],
    },
    a2: {
      id: 'a2',
      category: 'A',
      description: 'whatever',
      properties: [],
    },
    b1: {
      id: 'b1',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
    b2: {
      id: 'b2',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
    b3: {
      id: 'b3',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
    b4: {
      id: 'b4',
      category: 'B',
      description: 'whatever',
      properties: [],
    },
  };

  it('can render', () => {
    const wrapper = mount(
      <DictionarySearcher
        dictionary={testDict}
      />,
    );
    expect(wrapper.find(DictionarySearcher).length).toBe(1);
  });
});
