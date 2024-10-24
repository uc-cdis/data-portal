import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamsDropdown from './TeamsDropdown';

describe('TeamsDropdown', () => {
  const mockSetSelectedTeamProject = jest.fn();
  const teams = [
    { teamName: 'Team A' },
    { teamName: 'Team B' },
    { teamName: 'Team C' },
  ];

  beforeEach(() => {
    mockSetSelectedTeamProject.mockClear();
  });

  test('renders the dropdown with the placeholder when no team is selected', () => {
    render(
      <TeamsDropdown
        teams={teams}
        selectedTeamProject={null}
        setSelectedTeamProject={mockSetSelectedTeamProject}
      />,
    );

    expect(
      screen.getByLabelText('Select Team Project'),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('placeholder');
    expect(
      screen.getByText('-select one of the team projects below-'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(teams.length + 1); // +1 for the placeholder
  });

  test('calls setSelectedTeamProject with the correct value when a team is selected', () => {
    render(
      <TeamsDropdown
        teams={teams}
        selectedTeamProject={null}
        setSelectedTeamProject={mockSetSelectedTeamProject}
      />,
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Team A' } });
    expect(mockSetSelectedTeamProject).toHaveBeenCalledWith('Team A');
  });

  test('displays the selected team project when it is selected', () => {
    render(
      <TeamsDropdown
        teams={teams}
        selectedTeamProject='Team A'
        setSelectedTeamProject={mockSetSelectedTeamProject}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveValue('Team A');
  });
});
