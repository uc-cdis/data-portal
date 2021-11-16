import React from 'react';
import { render } from '@testing-library/react';
import DataSummaryCardGroup from './DataSummaryCardGroup';

const countItems = [
  [
    {
      label: 'Project',
      value: 9,
    },
    {
      label: 'Study',
      value: 11,
    },
  ],
  {
    label: 'Subject',
    value: 13463,
  },
  {
    label: 'Sample',
    value: 2354,
  },
  {
    label: 'Aliquots',
    value: 374225,
  },
  {
    label: 'Data File',
    value: 574356,
  },
];

function renderComponent() {
  return render(<DataSummaryCardGroup summaryItems={countItems} connected />);
}

test('renders', () => {
  const { container } = renderComponent();
  expect(container.firstElementChild).toHaveClass('data-summary-card-group');
});

test('displays all cards correctly', () => {
  const { container } = renderComponent();
  expect(
    container.firstElementChild.getElementsByClassName(
      'data-summary-card-group__connected-card'
    )
  ).toHaveLength(countItems.length);
});

test('displays all sub cards correctly', () => {
  const { container } = renderComponent();
  expect(
    container.firstElementChild.firstElementChild.getElementsByClassName(
      'data-summary-card-group__sub-card-item'
    )
  ).toHaveLength(countItems[0].length);
});
