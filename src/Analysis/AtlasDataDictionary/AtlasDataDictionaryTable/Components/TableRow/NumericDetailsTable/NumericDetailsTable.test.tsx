import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NumericDetailsTable from './NumericDetailsTable';

const rowObject = {
  minValue: '10',
  maxValue: '20',
  meanValue: '15',
  standardDeviation: '3',
};

describe('NumericDetailsTable', () => {
  it('renders the NumericDetailsTable headers', () => {
    const headers = [
      'Min Value',
      'Max Value',
      'Mean Value',
      'Standard Deviation',
    ];
    const { getByText } = render(
      <NumericDetailsTable
        rowObject={rowObject}
        searchTerm=''
      />,
    );

    headers.forEach((header) => {
      expect(getByText(header)).toBeInTheDocument();
    });
  });

  it('renders the NumericDetailsTable correctly with rowObject props', () => {
    const { getByText } = render(
      <NumericDetailsTable
        rowObject={rowObject}
        searchTerm=''
      />,
    );

    Object.values(rowObject).forEach((value) => {
      expect(getByText(value)).toBeInTheDocument();
    });
  });
});
