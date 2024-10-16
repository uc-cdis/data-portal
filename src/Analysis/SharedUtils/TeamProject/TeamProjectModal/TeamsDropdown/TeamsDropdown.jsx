import React from 'react';
import PropTypes from 'prop-types';
import './TeamsDropdown.css';
import '../../../AccessibilityUtils/Accessibility.css';

const TeamsDropdown = ({
  teams,
  selectedTeamProject,
  setSelectedTeamProject,
}) => {
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTeamProject(selectedValue);
  };

  const selectedValue = selectedTeamProject === null ? 'placeholder' : selectedTeamProject;

  return (
    <div className='teams-dropdown'>
      <div>
        <label
          id='team-select-label'
          className='screen-reader-only'
          htmlFor='team-select'
        >
          Team Projects Combo Box
        </label>
        <select
          id='team-select'
          aria-labelledby='team-select-label'
          value={selectedValue}
          onChange={handleChange}
          className={selectedTeamProject === null ? 'no-selection' : ''}
        >
          {selectedTeamProject === null && (
            <option value='placeholder' disabled>
              -select one of the team projects below-
            </option>
          )}
          {teams.map((team, index) => (
            <option key={index} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

TeamsDropdown.propTypes = {
  teams: PropTypes.array.isRequired,
  selectedTeamProject: PropTypes.string.isRequired,
  setSelectedTeamProject: PropTypes.func.isRequired,
};

export default TeamsDropdown;
