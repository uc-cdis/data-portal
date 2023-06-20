import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopLociTable from './TopLociTable';
import TopLociTableData from '../../../../TestData/ResultsViewData/TopLociTableData';

describe('TopLociTable', () => {
  const mockData = TopLociTableData;

  test('renders table columns and search inputs', () => {
    render(<TopLociTable data={mockData} />);

    // Check if the table columns are rendered
    expect(screen.getByText('Variant')).toBeInTheDocument();
    expect(screen.getByText('Nearest Gene(s)')).toBeInTheDocument();
    expect(screen.getByText('AF')).toBeInTheDocument();
    expect(screen.getByText('P-value')).toBeInTheDocument();

    // Check if the search inputs are rendered
    expect(
      screen.getByPlaceholderText('Search by Variant'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search by Nearest gene(s)'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by Af')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search by P-value'),
    ).toBeInTheDocument();
  });

  test('filters table data based on search term', () => {
    render(<TopLociTable data={mockData} />);

    // Enter a search term in the search input
    fireEvent.change(screen.getByPlaceholderText('Search by Nearest gene(s)'), {
      target: { value: 'A' },
    });

    // Check if the table data is filtered correctly
    expect(screen.getByText('GeneA')).toBeInTheDocument();
    expect(screen.queryByText('GeneB')).not.toBeInTheDocument();
  });

  // Add more tests for other search terms, table pagination, and interactions if needed
});
