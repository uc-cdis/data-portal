import React from 'react';
import { mount } from 'enzyme';
import DataDictionaryTable, { category2NodeList } from './DataDictionaryTable';

describe('the DataDictionaryTable component', () => {
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

  it('knows how to organize dictionary types by category', () => {
    const mapping = category2NodeList(testDict);
    expect(Array.isArray(mapping.A)).toBe(true);
    expect(Array.isArray(mapping.B)).toBe(true);
    expect(mapping.A.length).toBe(2);
    expect(mapping.B.length).toBe(4);
  });

  it('renders', () => {
    const wrapper = mount(
      <DataDictionaryTable dictionary={testDict} />,
    );
    expect(wrapper.find(DataDictionaryTable).length).toBe(1);
  });
});
