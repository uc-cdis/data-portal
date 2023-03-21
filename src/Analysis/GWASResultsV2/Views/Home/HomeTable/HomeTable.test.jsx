import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeTable from './HomeTable';
import SharedContext from '../../../Utils/SharedContext';
import testTableData from '../../../TestData/testTableData';
import '../../../TestData/matchMedia';

describe('HomeTable component', () => {
  const data = testTableData;
  const mockContext = {
    setCurrentView: jest.fn(),
    setSelectedRowData: jest.fn(),
  };

  it('should render the HomeTable component with given data', () => {
    render(
      <SharedContext.Provider value={mockContext}>
        <HomeTable data={data} />
      </SharedContext.Provider>
    );

    // Check that each of the values from data appear  in the dom
    data.forEach((item) => {
      Object.values(item).forEach((value) => {
        const textTestNodes = screen.getAllByText(value);
        expect(textTestNodes[0]).toBeInTheDocument();
      });
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
