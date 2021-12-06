import { render } from '@testing-library/react';
import Button from './index';

test('renders', () => {
  const { container } = render(<Button label='test-button' />);
  expect(container.firstElementChild).toHaveClass('g3-button');
});
