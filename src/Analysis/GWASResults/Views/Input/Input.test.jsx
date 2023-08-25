import React from 'react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@testing-library/react';
import SharedContext from '../../Utils/SharedContext';
import Input from './Input';

const setCurrentView = () => 'arbitrary function';
const setSelectedRowData = () => 'another arbitrary function';
const selectedRowData = 'arbitrary variable';
const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});
const inputWrapper = () => (
  <QueryClientProvider client={mockedQueryClient}>
    <SharedContext.Provider
      value={{
        setCurrentView,
        selectedRowData,
        setSelectedRowData,
      }}
    >
      <Input />
    </SharedContext.Provider>
  </QueryClientProvider>
);

describe('Input', () => {
  test('renders Input component', () => {
    render(inputWrapper());
    const pageTitle = screen.getByText('Input Details');
    expect(pageTitle).toBeInTheDocument();
  });
});
