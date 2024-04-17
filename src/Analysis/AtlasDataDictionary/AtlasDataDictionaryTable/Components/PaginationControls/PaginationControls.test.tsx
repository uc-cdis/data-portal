import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaginationControls from './PaginationControls';

describe('PaginationControls', () => {
  const defaultProps = {
    entriesShown: 10,
    handleTableChange: jest.fn(),
    currentPage: 1,
    totalEntriesAvailable: 30,
  };

  it('should render PaginationControls with correct initial state', () => {
    const { getByTestId, getByLabelText } = render(
      <PaginationControls {...defaultProps} />,
    );
    expect(getByTestId('pagination-controls')).toBeInTheDocument();
    expect(getByLabelText('Show')).toBeInTheDocument();
    expect(getByLabelText('entries')).toBeInTheDocument();
  });

  it('should call setEntriesShown when select value changes', () => {
    const { getByTestId } = render(<PaginationControls {...defaultProps} />);
    const entriesSelect = getByTestId('entries-select');
    fireEvent.change(entriesSelect, { target: { value: '20' } });
    expect(defaultProps.handleTableChange).toHaveBeenCalledWith('entriesShown', 20);
  });

  it('should call setActivePage when pagination button is clicked', () => {
    const { getAllByRole } = render(<PaginationControls {...defaultProps} />);
    const twoButton = getAllByRole('button', { name: /2/i })[0];
    fireEvent.click(twoButton);
    expect(defaultProps.handleTableChange).toHaveBeenCalledWith('currentPage', 2);
  });
});
