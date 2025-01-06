import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NonNumericDetailsTable from './NonNumericDetailsTable';

const rowObject = {
  valueSummary: [
    {
      name: 'valueSummaryNameOg2XFpximC',
      valueAsString: 'kI4Eb9JT2M',
      valueAsConceptID: 48,
      personCount: 33,
    },
  ],
};

describe('NonNumericDetailsTable', () => {
  it('renders the NumericDetailsTable headers', () => {
    const headers = [
      'Value as String',
      'Value as Concept ID',
      'Concept Name',
      'Person Count',
    ];
    const { getByText } = render(
      <NonNumericDetailsTable rowObject={rowObject} searchTerm='' />,
    );
    headers.forEach((header) => {
      expect(getByText(header)).toBeInTheDocument();
    });
  });

  it('renders the NumericDetailsTable correctly with rowObject props', () => {
    const { getByText } = render(
      <NonNumericDetailsTable rowObject={rowObject} searchTerm='' />,
    );

    Object.values(rowObject.valueSummary[0]).forEach((value) => {
      expect(getByText(value)).toBeInTheDocument();
    });
  });
});
