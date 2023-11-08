import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import TableData from '../../TestData/TableData';
import SharedContext from '../../Utils/SharedContext';
import Home from './Home';
import InitialHomeTableState from './HomeTableState/InitialHomeTableState';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const testJSX = () => (
  <QueryClientProvider client={mockedQueryClient}>
    <SharedContext.Provider
      value={{
        setCurrentView: jest.fn(),
        selectedRowData: jest.fn(),
        setSelectedRowData: jest.fn(),
        homeTableState: InitialHomeTableState,
        setHomeTableState: jest.fn(),
      }}
    >
      <Home />
    </SharedContext.Provider>
  </QueryClientProvider>
);

describe('Home component', () => {
  it('should render a loading spinner when data is loading', async () => {
    const { container } = render(testJSX());
    expect(container.getElementsByClassName('ant-spin').length).toBe(1);
  });

  it('should render an error message when data loading fails', async () => {
    jest
      .spyOn(window, 'fetch')
      .mockRejectedValueOnce(() => Promise.reject(new Error('error')));
    render(testJSX());
    await waitFor(() => expect(screen.getByTestId('loading-error-message')).toBeInTheDocument(),
    );
  });

  it('should render the HomeTable component with data when test data is loaded', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([TableData]),
    });
    render(testJSX());
    await screen.findByText(TableData[0].wf_name);
    TableData.forEach((item) => {
      expect(screen.getByText(item.wf_name)).toBeInTheDocument();
    });
  });
});
