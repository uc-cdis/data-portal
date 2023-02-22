import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CohortsOverlapLegend from './CohortsOverlapLegend';

describe('CohortsOverlapLegend', () => {
  const cohort1Label = 'Cohort 1';
  const cohort2Label = 'Cohort 2';
  const cohort3Label = 'Cohort 3';

  it('renders the legend items with the correct labels', () => {
    render(
      <CohortsOverlapLegend
        cohort1Label={cohort1Label}
        cohort2Label={cohort2Label}
        cohort3Label={cohort3Label}
      />,
    );
    expect(screen.getByText(cohort1Label)).toBeInTheDocument();
    expect(screen.getByText(cohort2Label)).toBeInTheDocument();
    expect(screen.getByText(cohort3Label)).toBeInTheDocument();
  });
});
