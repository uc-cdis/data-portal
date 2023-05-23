import React from 'react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import SharedContext from '../../Utils/SharedContext';
import { render } from '@testing-library/react';
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
    // Render the Input component
    const { getByText, getByTestId } = render(inputWrapper());

    // Assert that the DetailPageHeader component is rendered with the correct page title
    const pageTitle = getByText('Input Details');
    expect(pageTitle).toBeInTheDocument();
  });
});
