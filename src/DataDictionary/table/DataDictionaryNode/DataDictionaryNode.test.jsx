import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DataDictionaryNode from './index';

const node = {
  id: 'a',
  title: 'test title',
  category: 'test',
  properties: { pro1: {}, pro2: {} },
  required: ['pro1'],
};

test('renders', () => {
  const { container } = render(<DataDictionaryNode node={node} />);
  expect(container.firstElementChild).toHaveClass('data-dictionary-node');
});

test('toggles properties', () => {
  const onExpandNode = jest.fn();
  const props = { node, onExpandNode };
  const { container, rerender } = render(<DataDictionaryNode {...props} />);

  fireEvent.click(screen.getByLabelText('Dictionary node'));
  expect(onExpandNode).toHaveBeenCalledTimes(1);

  rerender(<DataDictionaryNode {...props} expanded />);
  expect(
    container.querySelector('.data-dictionary-node__property')
  ).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText('Close property tab'));
  expect(onExpandNode).toHaveBeenCalledTimes(2);
});
