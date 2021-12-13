import { render } from '@testing-library/react';
import Spinner from './Spinner';

test('renders', () => {
  const { container } = render(<Spinner />);
  expect(container.firstElementChild).toHaveClass('spinner');
  expect(container.querySelectorAll('svg')).toHaveLength(1);
});
