import React from 'react';
import { render, screen } from '@testing-library/react';
import DataDictionaryCategory from './index';

const nodes = [
  { id: 'a', description: 'node a description' },
  { id: 'b', description: 'node b description' },
];

test('renders', () => {
  const onExpandNode = jest.fn();
  const props = { category: 'test', nodes, onExpandNode };
  const { container } = render(<DataDictionaryCategory {...props} />);

  expect(container.firstElementChild).toHaveClass('data-dictionary-category');
  expect(screen.getAllByLabelText('Dictionary node')).toHaveLength(
    nodes.length
  );
});
