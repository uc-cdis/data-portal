import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubmissionHeader from './SubmissionHeader';

test('renders', () => {
  const { container } = render(
    <MemoryRouter>
      <SubmissionHeader
        username='testuser@gmail.com'
        fetchUnmappedFileStats={() => {}}
      />
    </MemoryRouter>
  );
  expect(container.firstElementChild).toHaveClass('submission-header');
});
