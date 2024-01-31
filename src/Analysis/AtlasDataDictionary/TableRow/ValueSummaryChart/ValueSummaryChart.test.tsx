import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ValueSummaryChart from './ValueSummaryChart';
import { IValueSummary } from '../../Interfaces/Interfaces';

describe('ValueSummaryChart', () => {
  it('renders the component for numeric data', () => {
    const NumericChartData: IValueSummary[] = [
      { name: 'John Doe', start: 1, personCount: 5 },
      { name: 'Jane Doe', start: 3, personCount: 7 },
    ];
    render(
      <ValueSummaryChart
        chartData={NumericChartData}
        preview={false}
        chartType='Number'
      />,
    );
    expect(screen.getByTestId('value-summary-chart')).toBeInTheDocument();
    expect(screen.getByText('VALUE AS NUMBER')).toBeInTheDocument();
  });

  it('renders the component for non numeric data', () => {
    const NonNumericChartData: IValueSummary[] = [
      {
        name: 'someName',
        valueAsString: 'someString',
        valueAsConceptID: 33,
        personCount: 55,
      },
    ];
    render(
      <ValueSummaryChart
        chartData={NonNumericChartData}
        preview={false}
        chartType='Other'
      />,
    );
    expect(screen.getByTestId('value-summary-chart')).toBeInTheDocument();
    expect(screen.queryByText('VALUE AS NUMBER')).toBeNull();
  });
});
