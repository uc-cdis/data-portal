import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import '@testing-library/jest-dom';
import TeamProjectHeader from './TeamProjectHeader';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
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
    </QueryClientProvider>,
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
    </Router>,
  );

  expect(history.location.pathname).toBe('/analysis');
});

test('renders TeamProjectHeader with edit button when isEditable is true and can open modal', () => {
  render(
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader isEditable />
    </QueryClientProvider>,
  );

  // Assert that the component renders with the edit button
  expect(screen.queryByTestId('team-project-edit')).toBeInTheDocument();

  // Simulate a click on the edit button and assert that the modal opens
  fireEvent.click(screen.queryByTestId('team-project-edit'));
  expect(screen.getByText('Team Projects')).toBeInTheDocument();
});

test('Renders project name based on local storage value', () => {
  // Mocking the useQuery hook
  jest.mock('react-query');

  // Set up a mock value for localStorage.getItem('teamProject')
  const teamProjectValue = 'Mock Team Project Name';
  localStorageMock.getItem.mockReturnValueOnce(teamProjectValue);

  useQuery.mockReturnValueOnce({
    data: { teams: [{ team: 'Mock Team Project Name' }] },
    status: 'success',
  });
  jest.mock('react-query');

  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <QueryClientProvider client={new QueryClient()} contextSharing>
        <TeamProjectHeader />
      </QueryClientProvider>
    </Router>,
  );
  // Assert that the component renders with the banner text from localStorage
  expect(screen.getByText(`/ ${teamProjectValue}`)).toBeInTheDocument();
});
