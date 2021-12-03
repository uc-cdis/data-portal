import { render } from '@testing-library/react';
import NodeTooltip from './NodeTooltip';

test('renders', () => {
  const { container } = render(
    <NodeTooltip
      hoveringNode={{
        id: 'a',
        type: 'test',
        label: 'node A',
      }}
    />
  );
  expect(container.firstElementChild).toHaveClass('node-tooltip');
});

test('does not render without node', () => {
  const { container } = render(<NodeTooltip hoveringNode={null} />);
  expect(container.firstElementChild).not.toBeInTheDocument();
});
