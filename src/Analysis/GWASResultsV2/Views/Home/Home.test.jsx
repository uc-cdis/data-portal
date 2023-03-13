import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import Home from './Home';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});
const setCurrentView = () => 'arbitrary function';
const setSelectedRowData = () => 'another arbitrary function';
const selectedRowData = 'arbitrary variable';
const testJSX = () => (
  <QueryClientProvider client={mockedQueryClient}>
    <SharedContext.Provider
      value={{
        setCurrentView,
        selectedRowData,
        setSelectedRowData,
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
    await screen.findByText('Error loading data for table');
    expect(
      screen.getByText('Error loading data for table'),
    ).toBeInTheDocument();
  });

  it('should render the HomeTable component with data when data is loaded', async () => {
    const mockData = [
      { uid: 1, name: 'Workflow 1' },
      { uid: 2, name: 'Workflow 2' },
    ];
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });
    render(testJSX());
    await screen.findByText('Workflow 1');
    expect(screen.getByText('Workflow 1')).toBeInTheDocument();
    expect(screen.getByText('Workflow 2')).toBeInTheDocument();
  });
});
