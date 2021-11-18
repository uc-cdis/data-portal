import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import NodePopup from './NodePopup';

test('renders popup', () => {
  const onClosePopup = jest.fn();
  const onOpenOverlayPropertyTable = jest.fn();
  const props = {
    highlightingNode: {
      id: 'a',
      type: 'test',
      requiredPropertiesCount: 0,
      optionalPropertiesCount: 0,
    },
    graphNodesSVGElements: {
      a: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
    },
    onClosePopup,
    onOpenOverlayPropertyTable,
  };
  const { container } = render(<NodePopup {...props} />);
  expect(container.firstElementChild).toHaveClass('node-popup');

  fireEvent.click(screen.getByText('Open properties'));
  expect(onOpenOverlayPropertyTable).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByLabelText('Close popup'));
  expect(onClosePopup).toHaveBeenCalledTimes(1);
});
