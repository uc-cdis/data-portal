import React from 'react';
import { mount } from 'enzyme';
import DataDictionary, { category2NodeList } from './DataDictionary';

describe('the DataDictionary component', () => {
  const testDict = {
    a1: {
      id: 'a1',
      category: 'A',
      description: 'whatever',
    },
    a2: {
      id: 'a2',
      category: 'A',
      description: 'whatever',
    },
    b1: {
      id: 'b1',
      category: 'B',
      description: 'whatever',
    },
    b2: {
      id: 'b2',
      category: 'B',
      description: 'whatever',
    },
    b3: {
      id: 'b3',
      category: 'B',
      description: 'whatever',
    },
    b4: {
      id: 'b4',
      category: 'B',
      description: 'whatever',
    },
  };

  it('knows how to organize dictionary types by category', () => {
    const mapping = category2NodeList(testDict);
    expect(Array.isArray(mapping.A)).toBe(true);
    expect(Array.isArray(mapping.B)).toBe(true);
    expect(mapping.A.length).toBe(2);
    expect(mapping.B.length).toBe(4);
  });

  it('renders category tables', () => {
    const ux = mount(<DataDictionary dictionary={testDict} />);
    expect(ux.find('table').length).toBe(2);
  });
});
