import React, { useState } from 'react';
import './TeamsDropdown.css';
import '../../../../SharedUtils/AccessibilityUtils/Accessibility.css';

const TeamsDropdown = ({
  teams,
  selectedTeamProject,
  setSelectedTeamProject,
}) => {
  console.log('teams', teams);
  console.log(
    'selectedTeamProject?.teamName ln 7 in TeamsDropdown',
    JSON.stringify(selectedTeamProject)
  );

  // const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTeamProject(selectedValue);
  };

  const selectedValue =
    selectedTeamProject === null ? 'placeholder' : selectedTeamProject;

  return (
    <div className='teams-dropdown'>
      <div>
        <label className='screen-reader-only' htmlFor='options'>
          Team Projects Combo Box
        </label>
        <select
          id='options'
          value={selectedValue}
          aria-labelledby='options'
          onChange={handleChange}
          className={selectedTeamProject === null ? 'no-selection' : ''}
        >
          <option value='placeholder' disabled>
            -select one of the team projects below-
          </option>
          {teams.map((team, index) => {
            console.log(team.teamName === selectedTeamProject);
            return (
              <option key={index} value={team.teamName}>
                {team.teamName}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default TeamsDropdown;

{
  /*  <div
        role='combobox'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-labelledby='team-projects-label'
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            toggleDropdown();
          }
        }}
        aria-live='polite'
      >
        <select
          id='team-projects'
          value={selectedTeamProject?.teamName}
          onChange={handleChange}
        >
          <option value='' disabled>
            Select a team project
          </option>
          {teams.map((team, index) => (
            <option key={index} value={team}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div> */
}
