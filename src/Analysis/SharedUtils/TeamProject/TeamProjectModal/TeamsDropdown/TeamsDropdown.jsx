import React, { useState } from 'react';
import './TeamsDropdown.css';
import '../../../../SharedUtils/AccessibilityUtils/Accessibility.css'

const TeamsDropdown = ({ teams, setSelectedTeamProject, selectedTeamProject}) => {
  console.log('teams', teams);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value.teamName;
    console.log('selectedValue', selectedValue);
    setSelectedTeamProject(selectedValue);
  };

  return (
    <div className='teams-dropdown'>
      <label id='team-projects-label' className='screen-reader-only' htmlFor='team-projects'>
        {isOpen
          ? 'Team Projects, expanded combo box'
          : 'Team Projects, collapsed combo box'}
      </label>
      <div
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
          value={selectedTeamProject.teamName}
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
      </div>
    </div>
  );
};

export default TeamsDropdown;
