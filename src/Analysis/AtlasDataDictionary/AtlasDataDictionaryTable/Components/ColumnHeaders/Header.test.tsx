import React from 'react';
import {
  render, fireEvent, screen, cleanup,
} from '@testing-library/react';
import { ISortConfig } from '../../Interfaces/Interfaces';
import Header from './Header'; // adjust the import path if necessary
import '@testing-library/jest-dom/extend-expect';

describe('Header component', () => {
  afterEach(cleanup);
  const defaultProps: any = {
    handleSort: jest.fn(),
    headerJSX: <div data-testid='header'>Test Header Text</div>,
    headerKey: 'key1',
    sortConfig: { key: 'key1', sortKey: '', direction: '' },
    sortable: true,
  };

  it('renders the Header component correctly when sortable is true and there is no sort config', () => {
    render(
      <table>
        <thead>
          <tr>
            <Header {...defaultProps} />
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getAllByText('Test Header Text').length).toBeGreaterThan(0);
  });

  it(`renders the Header component correctly when sortable is true and
  there is a sort config with ascending direction`, () => {
    const sortConfig: ISortConfig = {
      sortKey: 'key1',
      direction: 'ascending',
    };
    render(
      <table>
        <thead>
          <tr>
            <Header {...defaultProps} sortConfig={sortConfig} />
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getAllByText('Test Header Text').length).toBeGreaterThan(0);
    const caretUpArrows = screen.getAllByRole('presentation', {
      name: /caret-up/i,
    });

    let activeCaretUp = false;
    caretUpArrows.forEach((caretUpArrow) => {
      if (caretUpArrow.className.includes('active')) activeCaretUp = true;
    });
    expect(activeCaretUp).toBe(true);
  });

  it(`renders the Header component correctly when sortable is true and
  there is a sort config with descending direction`, () => {
    const sortConfig: ISortConfig = {
      sortKey: 'key1',
      direction: 'descending',
    };
    render(
      <table>
        <thead>
          <tr>
            <Header {...defaultProps} sortConfig={sortConfig} />
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getAllByText('Test Header Text').length).toBeGreaterThan(0);
    const caretDownArrows = screen.getAllByRole('presentation', {
      name: /caret-down/i,
    });

    let activeCaretDown = false;
    caretDownArrows.forEach((caretDownArrow) => {
      if (caretDownArrow.className.includes('active')) activeCaretDown = true;
    });
    expect(activeCaretDown).toBe(true);
  });

  it('calls handleSort function when header is clicked', () => {
    const handleSort = jest.fn();
    render(
      <table>
        <thead>
          <tr>
            <Header {...defaultProps} handleSort={handleSort} />
          </tr>
        </thead>
      </table>,
    );
    fireEvent.click(screen.getAllByText('Test Header Text')[0]);
    expect(handleSort).toHaveBeenCalledTimes(1);
    expect(handleSort).toHaveBeenCalledWith('key1');
  });
});
