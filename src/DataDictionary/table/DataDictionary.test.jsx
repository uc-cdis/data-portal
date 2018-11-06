import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import DataDictionaryTable, { category2NodeList } from './DataDictionaryTable';

describe('the DataDictionaryTable component', () => {
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

  it.skip('knows how to organize dictionary types by category', () => {
    const mapping = category2NodeList(testDict);
    expect(Array.isArray(mapping.A)).toBe(true);
    expect(Array.isArray(mapping.B)).toBe(true);
    expect(mapping.A.length).toBe(2);
    expect(mapping.B.length).toBe(4);
  });

  it.skip('renders category tables', () => {
    const ux = mount(
      <StaticRouter location={{ pathname: '/dd' }}>
        <DataDictionaryTable dictionary={testDict} />
      </StaticRouter>,
    );
    expect(ux.find('table').length).toBe(2);
  });
});
