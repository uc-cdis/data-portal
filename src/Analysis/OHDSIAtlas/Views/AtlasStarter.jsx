import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { useQuery } from 'react-query';
import queryConfig from '../../SharedUtils/QueryConfig';
import fetchAuthorizationMappingsForCurrentUser from '../Utils/teamProjectApi';
import SelectTeamProjectDropDown from '../Components/SelectTeamProjectDropDown';

const AtlasStarter = ({ setCurrentViewAndTeamProject }) => {
  const [selectedTeamProject, setSelectedTeamProject] = useState('');

  async function fetchArboristTeamProjectRoles() {
    const authorizationMappings = await fetchAuthorizationMappingsForCurrentUser();
    const teamProjectList = Object.keys(authorizationMappings)
      .filter((key) => key.startsWith('/gwas_projects/'))
      .map((key) => ({ teamName: key }));
    return { teams: teamProjectList };
  }

  const { data, status } = useQuery('teamprojects', fetchArboristTeamProjectRoles, queryConfig);
  if (status === 'loading') {
    return (
      <React.Fragment>
        <div className='spinner-container'>
          <Spin /> Retrieving the list of team projects.
          <br />
          Please wait...
        </div>
      </React.Fragment>
    );
  }
  if (status === 'error') {
    return 'Error';
  }
  return (
    <React.Fragment>
      Select a team project:
      <SelectTeamProjectDropDown
        teamProjects={data.teams}
        setSelectedTeamProject={setSelectedTeamProject}
      />
      <button type='button' style={{ height: '32px' }} onClick={() => { setCurrentViewAndTeamProject('atlas', selectedTeamProject); }}>Start Atlas</button>
    </React.Fragment>
  );
};

AtlasStarter.propTypes = {
  setCurrentViewAndTeamProject: PropTypes.func.isRequired,
};

export default AtlasStarter;
