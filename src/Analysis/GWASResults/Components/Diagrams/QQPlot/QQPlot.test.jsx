import React from 'react';
import { render, screen } from '@testing-library/react';
import largeJsonDataFile from '../../../TestData/Diagrams/QQPlotData/LargeQQPlotTestData.json';
import '@testing-library/jest-dom';
import QQPlot from './QQPlot';

// Mock the create_qq_plot function since it's not the focus of this unit test
jest.mock('../lib/pheweb_plots', () => ({
  create_qq_plot: jest.fn(),
}));

describe('QQPlot', () => {
  test('renders without error', () => {
    render(
      <QQPlot
        maf_ranges={largeJsonDataFile.by_maf}
        qq_ci={largeJsonDataFile.ci}
        qq_plot_container_id='qq_plot_container'
      />,
    );
    const qqPlotContainer = screen.getByTestId('qq_plot_container');
    expect(qqPlotContainer).toBeInTheDocument();
  });
});
