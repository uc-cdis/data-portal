import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const SelectTeamProjectDropDown = ({
  teamProjects,
  setSelectedTeamProject,
}) => {
  const onChange = (h) => {
    setSelectedTeamProject(h.value);
  };

  return (
    <Select
      id={'input-selectTeamProjectDropDown'}
      labelInValue
      onChange={onChange}
      placeholder='-select one of the team projects below-'
      fieldNames={{ label: 'teamName', value: 'teamName' }}
      options={teamProjects}
      dropdownStyle={{ width: '300px' }}
      style={{ width: '300px' }}
    />
  );
};

SelectTeamProjectDropDown.propTypes = {
  teamProjects: PropTypes.array.isRequired,
  setSelectedTeamProject: PropTypes.func.isRequired,
};

export default SelectTeamProjectDropDown;
