import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EntriesHeader from './EntriesHeader';

describe('EntriesHeader', () => {
  const defaultProps = {
    start: 1,
    stop: 5,
    total: 10,
    colspan: 2,
  };

  it('renders the EntriesHeader component correctly with provided props', () => {
    render(
      <table>
        <EntriesHeader {...defaultProps} />
      </table>
    );
    expect(screen.getByTestId('entries-header').textContent).toBe(
      'Showing 1 to 5 of 10 entries'
    );
  });
});
