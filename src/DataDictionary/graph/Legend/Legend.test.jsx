import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Legend from './Legend';

const items = ['c1', 'c2', 'c3'];

test('renders and toggles', () => {
  const { container } = render(<Legend items={items} />);
  expect(container.firstElementChild).toHaveClass(
    'data-dictionary-graph-legend'
  );

  const closeButtonElement = container.querySelector(
    '.data-dictionary-graph-legend__close'
  );
  fireEvent.click(closeButtonElement);
  expect(container.firstElementChild).toHaveClass(
    'data-dictionary-graph-legend--toggled'
  );

  const showButtonElement = container.querySelector(
    '.data-dictionary-graph-legend__info'
  );
  fireEvent.click(showButtonElement);
  expect(container.firstElementChild).not.toHaveClass(
    'data-dictionary-graph-legend--toggled'
  );
});
