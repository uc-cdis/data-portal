import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValueSummaryChart from './ValueSummaryChart';
import { IValueSummary } from '../../../Interfaces/Interfaces';

describe('ValueSummaryChart', () => {
  it('renders the component for numeric data', () => {
    const NumericChartData: IValueSummary[] = [
      { name: 'John Doe', start: 1.1111111111, personCount: 5 },
      { name: 'Jane Doe', start: 3, personCount: 7 },
    ];
    const firstTickWithExpectedRounding = '1.1';
    render(
      <ValueSummaryChart
        chartData={NumericChartData}
        preview={false}
        chartType='Number'
      />,
    );
    expect(screen.getByTestId('value-summary-chart')).toBeInTheDocument();
    expect(screen.getByText('VALUE AS NUMBER')).toBeInTheDocument();
    expect(screen.getByText(firstTickWithExpectedRounding)).toBeInTheDocument();
  });

  it('renders the component for non numeric data', () => {
    const NonNumericChartData: IValueSummary[] = [
      {
        name: 'someLongLongName',
        valueAsString: 'someString',
        valueAsConceptID: 33,
        personCount: 55,
      },
    ];
    const firstTickWithExpectedTruncation = 'someLongLongNam...';
    render(
      <ValueSummaryChart
        chartData={NonNumericChartData}
        preview={false}
        chartType='Other'
      />,
    );
    expect(screen.getByTestId('value-summary-chart')).toBeInTheDocument();
    expect(screen.queryByText('VALUE AS NUMBER')).toBeNull();
    expect(screen.getByText(firstTickWithExpectedTruncation)).toBeInTheDocument();
  });
});
