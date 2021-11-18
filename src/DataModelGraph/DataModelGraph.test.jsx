import React from 'react';
import { render } from '@testing-library/react';
import { buildTestData } from '../GraphUtils/testData';
import { createNodesAndEdges } from '../GraphUtils/utils';
import DataModelGraph from './DataModelGraph';

const data = buildTestData();
const props = {
  full: createNodesAndEdges(data, true),
  compact: createNodesAndEdges(data, false),
};

test('renders', () => {
  const { container } = render(<DataModelGraph {...props} />);
  expect(container.firstElementChild).toHaveClass('data-model-graph');
});

test('toggles between full and compact views', () => {
  // TODO
});
