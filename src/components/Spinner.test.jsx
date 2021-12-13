import { render } from '@testing-library/react';
import Spinner from './Spinner';

test('displays spinner', () => {
  const { container } = render(<Spinner />);
  expect(container.firstElementChild).toHaveClass('spinner');
  expect(container.firstElementChild.firstElementChild).toHaveClass(
    'spinner__svg'
  );
});
