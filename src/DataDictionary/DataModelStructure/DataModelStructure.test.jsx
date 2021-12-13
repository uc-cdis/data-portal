import { fireEvent, render, screen } from '@testing-library/react';
import DataModelStructure from './DataModelStructure';

/*
 * example structure:
 *
 *     a
 *     |
 *     b
 *    / \
 *   c   d
 *    \ /
 *     e
 *
 */
const nodeESummary = {
  nodeID: 'e',
  nodeIDsBefore: ['c', 'd'],
  linksBefore: [
    { source: 'b', target: 'c' },
    { source: 'b', target: 'd' },
    { source: 'c', target: 'e' },
    { source: 'd', target: 'e' },
  ],
  category: 'test',
};

function renderComponent(props) {
  const defaultProps = {
    allRoutes: [
      ['a', 'b', 'c', 'e'],
      ['a', 'b', 'd', 'e'],
    ],
    dataModelStructure: [
      {
        nodeID: 'a',
        nodeIDsBefore: [],
        linksBefore: [],
        category: 'test',
      },
      {
        nodeID: 'b',
        nodeIDsBefore: [],
        linksBefore: [{ source: 'a', target: 'b' }],
        category: 'test',
      },
      nodeESummary,
    ],
    downloadMultiTemplate: () => {},
    excludedNodesForTemplates: ['a'],
    onSetGraphView: () => {},
    onSetOverlayPropertyTableHidden: () => {},
    onResetGraphCanvas: () => {},
    relatedNodeIDs: ['a', 'b', 'c', 'd', 'e'],
  };
  return render(<DataModelStructure {...{ ...defaultProps, ...props }} />);
}

test('renders', () => {
  const { container } = renderComponent();

  expect(container.firstElementChild).toHaveClass('data-model-structure');
  expect(
    container.getElementsByClassName('data-model-structure__node')
  ).toHaveLength(3);
  const summaryText = `${nodeESummary.nodeIDsBefore.length} nodes with ${nodeESummary.linksBefore.length} links`;
  expect(screen.queryByText(summaryText)).toBeInTheDocument();
});

test('opens overlay table', () => {
  const onSetGraphView = jest.fn();
  const onSetOverlayPropertyTableHidden = jest.fn();
  renderComponent({
    onSetGraphView,
    onSetOverlayPropertyTableHidden,
  });

  fireEvent.click(screen.getByText('Open properties'));
  expect(onSetGraphView).toHaveBeenCalledTimes(1);
  expect(onSetOverlayPropertyTableHidden).toHaveBeenCalledTimes(1);
});

test('switches to graph view', () => {
  const onSetGraphView = jest.fn();
  const onResetGraphCanvas = jest.fn();
  renderComponent({ isGraphView: false, onSetGraphView, onResetGraphCanvas });

  fireEvent.click(screen.getByText('See it on graph'));
  expect(onSetGraphView).toHaveBeenCalledTimes(1);
  expect(onResetGraphCanvas).toHaveBeenCalledTimes(1);
});

test('can download templates for selected nodes', () => {
  const clickingNodeName = 'e';
  const dictionaryVersion = '1';
  const downloadMultiTemplate = jest.fn();
  renderComponent({
    clickingNodeName,
    dictionaryVersion,
    downloadMultiTemplate,
  });

  fireEvent.click(screen.getByText('Download templates'));
  expect(screen.queryByText('TSV')).toBeInTheDocument();
  expect(screen.queryByText('JSON')).toBeInTheDocument();

  fireEvent.click(screen.getByText('TSV'));
  expect(downloadMultiTemplate).toHaveBeenCalledTimes(1);

  const [
    receivedFormat,
    receivedNodesToDownload,
    receivedRoutes,
    receivedClickingNodeName,
    receivedDictionaryVersion,
  ] = downloadMultiTemplate.mock.calls[0];
  expect(receivedFormat).toBe('tsv');
  expect(receivedNodesToDownload).toEqual({
    b: 'b-template.tsv',
    c: 'c-template.tsv',
    d: 'd-template.tsv',
    e: 'e-template.tsv',
  });
  expect(receivedRoutes).toEqual([
    ['b', 'c', 'e'],
    ['b', 'd', 'e'],
  ]);
  expect(receivedClickingNodeName).toEqual(clickingNodeName);
  expect(receivedDictionaryVersion).toEqual(dictionaryVersion);
});

test('cannot download templates if selected nodes are all excluded', () => {
  renderComponent({ excludedNodesForTemplates: ['a', 'b', 'c', 'd', 'e'] });
  expect(screen.queryByText('Download templates')).not.toBeInTheDocument();
});
