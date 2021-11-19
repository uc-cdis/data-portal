import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OverlayPropertyTable from './OverlayPropertyTable';

test('does not render without node', () => {
  const { container } = render(
    <OverlayPropertyTable node={null} hidden={false} />
  );
  expect(container.firstElementChild).not.toBeInTheDocument();
});

const node = {
  id: 'a',
  category: 'test',
  title: 'node A',
  description: 'node A description',
  required: [],
  properties: {},
};

test('does not render if hidden', () => {
  const { container } = render(<OverlayPropertyTable node={node} hidden />);
  expect(container.firstElementChild).not.toBeInTheDocument();
});

test('renders normal', () => {
  const onCloseOverlayPropertyTable = jest.fn();
  const props = { node, hidden: false, onCloseOverlayPropertyTable };
  const { container } = render(<OverlayPropertyTable {...props} />);
  expect(container.firstElementChild).toHaveClass('overlay-property-table');

  fireEvent.click(screen.getByLabelText('Close property table'));
  expect(onCloseOverlayPropertyTable).toHaveBeenCalledTimes(1);
});
