import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CohortsOverlapTextVersion from './Simple3SetsOverlapTextVersion';

describe('CohortsOverlapTextVersion', () => {
  const eulerArgs = {
    set12Size: 10,
    set13Size: 5,
    set23Size: 3,
    set123Size: 1,
    set1Label: 'Set 1',
    set2Label: 'Set 2',
    set3Label: 'Set 3',
  };

  it('renders the correct cohort intersections', () => {
    render(<CohortsOverlapTextVersion eulerArgs={eulerArgs} />);
    expect(
      screen.getByText(
        `${eulerArgs.set1Label} ∩ ${
          eulerArgs.set2Label
        } = ${eulerArgs.set12Size.toLocaleString()}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${eulerArgs.set1Label} ∩ ${
          eulerArgs.set3Label
        } = ${eulerArgs.set13Size.toLocaleString()}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${eulerArgs.set2Label} ∩ ${
          eulerArgs.set3Label
        } = ${eulerArgs.set23Size.toLocaleString()}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${eulerArgs.set1Label} ∩ ${eulerArgs.set2Label} ∩ ${
          eulerArgs.set3Label
        } = ${eulerArgs.set123Size.toLocaleString()}`
      )
    ).toBeInTheDocument();
  });
});
