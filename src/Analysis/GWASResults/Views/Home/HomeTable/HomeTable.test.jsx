import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeTable from './HomeTable';
import SharedContext from '../../../Utils/SharedContext';
import TableData from '../../../TestData/TableData';
import InitialHomeTableState from '../InitialState/InitialHomeTableState';

describe('HomeTable component', () => {
  const data = TableData;
  const mockContext = {
    setCurrentView: jest.fn(),
    setSelectedRowData: jest.fn(),
    homeTableState: InitialHomeTableState,
    setHomeTableState: jest.fn(),
  };

  it('should render the HomeTable component with given data', () => {
    render(
      <SharedContext.Provider value={mockContext}>
        <HomeTable data={data} />
      </SharedContext.Provider>,
    );

    // Check that each of the values from data that needed to be shown appear in the dom
    data.forEach((item) => {
      const finishedTestDate = new Date(item.finishedAt);
      const formattedFinishedTestDate = finishedTestDate.toLocaleDateString();
      const submittedTestDate = new Date(item.submittedAt);
      const formattedSubmittedTestDate = submittedTestDate.toLocaleDateString();

      expect(screen.getAllByText(item.name)[0]).toBeInTheDocument();
      expect(screen.getAllByText(item.wf_name)[0]).toBeInTheDocument();
      expect(
        screen.getAllByText(formattedFinishedTestDate)[0],
      ).toBeInTheDocument();
      expect(screen.getAllByText(item.phase)[0]).toBeInTheDocument();
      expect(
        screen.getAllByText(formattedSubmittedTestDate)[0],
      ).toBeInTheDocument();
    });

    // Check that the execution and results buttons render for each row
    const executionButton = screen.getAllByText('Execution');
    expect(executionButton[0]).toBeInTheDocument();
    expect(executionButton[1]).toBeInTheDocument();

    const resultsButton = screen.getAllByText('Results');
    expect(resultsButton[0]).toBeInTheDocument();
    expect(resultsButton[1]).toBeInTheDocument();
  });
});
