import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiscoveryLoadingProgressBar from './DiscoveryLoadingProgressBar';

describe('DiscoveryLoadingProgressBar', () => {
  it('renders the progress bar and loading text when displayProgressBar is true', () => {
    render(<DiscoveryLoadingProgressBar allBatchesAreLoaded={false} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading studies...')).toBeInTheDocument();
  });

  it('sets progress to 100% when allBatchesAreLoaded is true', () => {
    render(<DiscoveryLoadingProgressBar allBatchesAreLoaded />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });
});
