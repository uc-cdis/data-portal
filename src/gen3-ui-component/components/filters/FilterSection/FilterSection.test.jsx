import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FilterSection from './index';

const singleSelectOptions = [
  { text: 'test1', filterType: 'singleSelect' },
  { text: 'test2', filterType: 'singleSelect' },
  { text: 'test3', filterType: 'singleSelect' },
  { text: 'test4', filterType: 'singleSelect' },
];

test('renders', () => {
  const { container } = render(
    <FilterSection
      title='Section Title'
      options={singleSelectOptions}
      hideZero={false}
      onAfterDrag={() => {}}
      onSelect={() => {}}
    />
  );
  expect(container.firstElementChild).toHaveClass('g3-filter-section');
});

test('toggles expand on click', () => {
  render(
    <FilterSection
      title='Section Title'
      options={singleSelectOptions}
      hideZero={false}
      onAfterDrag={() => {}}
      onSelect={() => {}}
    />
  );
  expect(
    screen.getByLabelText('Collapse filter: Section Title')
  ).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText('Collapse filter: Section Title'));
  expect(
    screen.getByLabelText('Expand filter: Section Title')
  ).toBeInTheDocument();
});
