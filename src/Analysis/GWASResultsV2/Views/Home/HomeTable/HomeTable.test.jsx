import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeTable from './HomeTable';
import SharedContext from '../../../Utils/SharedContext';

describe('HomeTable component', () => {
  const data = [
    {
      uid: '123',
      name: 'Workflow 1',
      startedAt: '2022-02-15T13:00:00Z',
      phase: 'finished',
      DateTimeSubmitted: '2022-02-15T13:30:00Z',
    },
    {
      uid: '456',
      name: 'Workflow 2',
      startedAt: '2022-02-16T10:00:00Z',
      phase: 'running',
      DateTimeSubmitted: '2022-02-16T10:30:00Z',
    },
  ];

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

    // Check that each of the values from data appear once in the dom
    data.forEach((item) => {
      for (const [key, value] of Object.entries(item)) {
        const textTestNode = screen.getByText(value);
        expect(textTestNode).toBeInTheDocument();
      }
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
