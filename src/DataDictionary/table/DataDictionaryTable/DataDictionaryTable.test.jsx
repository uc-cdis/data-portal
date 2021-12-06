import { render, screen } from '@testing-library/react';
import { parseDictionaryNodes } from '../../utils';
import DataDictionaryTable, { category2NodeList } from './DataDictionaryTable';

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
const testNodes = parseDictionaryNodes(testDict);

test('knows how to organize dictionary types by category', () => {
  const { A, B } = category2NodeList(testNodes);

  expect(Array.isArray(A)).toBe(true);
  expect(A).toHaveLength(2);

  expect(Array.isArray(B)).toBe(true);
  expect(B).toHaveLength(4);
});

test('renders', () => {
  render(<DataDictionaryTable dictionaryNodes={testNodes} />);
  expect(
    screen.getByText('Dictionary has 6 nodes and 0 properties')
  ).toBeInTheDocument();
});
