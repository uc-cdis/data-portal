import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiscoveryLoadingProgressBar from './DiscoveryLoadingProgressBar';

describe('DiscoveryLoadingProgressBar', () => {
  it('renders an active (pending) full progress bar while loading', () => {
    const { container } = render(<DiscoveryLoadingProgressBar allBatchesAreReady={false} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('Loading studies...')).toBeInTheDocument();
    expect(container.querySelector('.ant-progress-status-active')).toBeInTheDocument();
  });

  it('disappears immediately once loading completes', () => {
    const { rerender } = render(<DiscoveryLoadingProgressBar allBatchesAreReady={false} />);
    rerender(<DiscoveryLoadingProgressBar allBatchesAreReady />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading studies...')).not.toBeInTheDocument();
  });
});
