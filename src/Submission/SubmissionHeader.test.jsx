import { render } from '@testing-library/react';
import SubmissionHeader from './SubmissionHeader';

test('renders', () => {
  const { container } = render(
    <SubmissionHeader
      username='testuser@gmail.com'
      fetchUnmappedFileStats={() => {}}
    />
  );
  expect(container.firstElementChild).toHaveClass('submission-header');
});
