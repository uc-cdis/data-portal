import { render, fireEvent } from '@testing-library/react';
import GraphDrawer from './GraphDrawer';
import { calculateGraphLayout } from '../GraphCalculator/graphCalculatorHelper';
import { buildTestData } from '../../../GraphUtils/testData';

test('renders nodes and edges in graph', async () => {
  const { dictionary } = buildTestData();
  const layout = await calculateGraphLayout(dictionary);
  const props = {
    nodes: layout.nodes,
    edges: layout.edges,
    layoutInitialized: true,
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const { container } = render(<GraphDrawer {...props} />, {
    container: document.body.appendChild(svg),
  });
  expect(container.firstElementChild).toHaveClass('graph-drawer');
  expect(container.getElementsByClassName('graph-node')).toHaveLength(
    layout.nodes.length
  );
  expect(container.getElementsByClassName('graph-edge')).toHaveLength(
    layout.edges.length
  );
});

test('hovers and clicks nodes, and updates svg element', async () => {
  const { dictionary } = buildTestData();
  const layout = await calculateGraphLayout(dictionary);

  const onHoverNode = jest.fn();
  const onCancelHoverNode = jest.fn();
  const onClickNode = jest.fn();

  const props = {
    nodes: layout.nodes,
    edges: layout.edges,
    layoutInitialized: true,
    onHoverNode,
    onCancelHoverNode,
    onClickNode,
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const { container } = render(<GraphDrawer {...props} />, {
    container: document.body.appendChild(svg),
  });
  const firstNodeElement = container.querySelector('.graph-node');

  fireEvent.mouseOver(firstNodeElement);
  expect(onHoverNode).toHaveBeenCalledTimes(1);

  fireEvent.mouseOut(firstNodeElement);
  expect(onCancelHoverNode).toHaveBeenCalledTimes(1);

  fireEvent.click(firstNodeElement);
  expect(onClickNode).toHaveBeenCalledTimes(1);
});
