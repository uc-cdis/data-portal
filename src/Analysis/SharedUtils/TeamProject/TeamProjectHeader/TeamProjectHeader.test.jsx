import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';
import TeamProjectHeader from './TeamProjectHeader';
import TeamProjectTestData from '../TestData/TeamProjectTestData';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

test('renders TeamProjectHeader with default props when isEditable is true and no local storage', () => {
  localStorageMock.getItem.mockReturnValueOnce(null);
  render(
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader isEditable />
    </QueryClientProvider>
  );
  // Assert that the component renders without crashing without button
  expect(screen.getByText('Team Project')).toBeInTheDocument();
  expect(screen.getByText('/ - -')).toBeInTheDocument();
});

test(`Calls useHistory for redirect to analysis page when isEditable is
  false and teamProject is not set in local storage`, () => {
  localStorageMock.getItem.mockReturnValueOnce(null);
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <QueryClientProvider client={new QueryClient()} contextSharing>
        <TeamProjectHeader isEditable={false} />
      </QueryClientProvider>
    </Router>
  );

  expect(history.location.pathname).toBe('/analysis');
});

test('renders TeamProjectHeader with edit button when isEditable is true and can open modal', () => {
  render(
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader isEditable />
    </QueryClientProvider>
  );

  // Assert that the component renders with the edit button
  expect(screen.queryByTestId('team-project-edit')).toBeInTheDocument();

  // Simulate a click on the edit button and the modal with text "Team Projects" opens
  fireEvent.click(screen.queryByTestId('team-project-edit'));
  expect(screen.getByText('Team Projects')).toBeInTheDocument();
});

test('renders TeamProjectHeader with team project name from localStorage', () => {
  const testData = TeamProjectTestData;
  // Mock the data response from react-query
  jest.mock('react-query', () => ({
    ...jest.requireActual('react-query'),
    useQuery: jest.fn(() => testData),
  }));

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  const testName = TeamProjectTestData.data.teams[0].teamName;
  // Set the localStorage variable for teamProject
  localStorageMock.getItem.mockReturnValue(testName);

  render(
    <QueryClientProvider client={new QueryClient()}>
      <TeamProjectHeader isEditable={false} />
    </QueryClientProvider>
  );

  // You can add more specific assertions based on your component's structure
  expect(screen.getByText(new RegExp(testName, 'i'))).toBeInTheDocument();
});
