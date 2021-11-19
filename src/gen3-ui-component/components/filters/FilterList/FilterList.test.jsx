import React from 'react';
import { render } from '@testing-library/react';
import FilterList from './index';

const filterOptions = [
  { text: 'test1', filterType: 'singleSelect' },
  { text: 'test2', filterType: 'singleSelect' },
  { text: 'test3', filterType: 'singleSelect' },
  {
    text: 'test4',
    filterType: 'range',
    min: 0,
    max: 100,
  },
];

const filterSections = [
  { title: 'Section 1', options: filterOptions },
  { title: 'Section 2', options: filterOptions },
];

test('renders', () => {
  const { container } = render(<FilterList sections={filterSections} />);
  expect(container.firstElementChild).toHaveClass('g3-filter-list');
});
