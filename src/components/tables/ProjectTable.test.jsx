import React from 'react';
import { render } from '@testing-library/react';

import ProjectTable from './ProjectTable';

const projectList = [
  {
    name: 'frickjack',
    counts: [5, 20, 30, 200],
  },
];
const summaryFields = ['a', 'b', 'c', 'd'];

test('renders', () => {
  const { container } = render(
    <ProjectTable projectList={projectList} summaryFields={summaryFields} />
  );

  // summary totals row
  expect(container.firstElementChild.querySelectorAll('thead tr')).toHaveLength(
    1
  );
  // data row
  expect(container.firstElementChild.querySelectorAll('tbody tr')).toHaveLength(
    1
  );
});
