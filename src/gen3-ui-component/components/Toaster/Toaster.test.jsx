import React from 'react';
import { render } from '@testing-library/react';
import Toaster from './index';

test('updates with state change', () => {
  const { container, rerender } = render(
    <Toaster isEnabled={false}>
      <div>Test</div>
    </Toaster>
  );
  expect(container.firstElementChild).not.toBeInTheDocument();

  rerender(
    <Toaster isEnabled>
      <div>Test</div>
    </Toaster>
  );
  expect(container.firstElementChild).toHaveClass('toaster__div');

  rerender(
    <Toaster isEnabled={false}>
      <div>Test</div>
    </Toaster>
  );
  expect(container.firstElementChild).not.toBeInTheDocument();
});
