import React from 'react';
import { useQuery } from 'react-query';
import queryConfig from '../../QueryConfig';
import { Button, Result } from 'antd';
import fetchArboristTeamProjectRoles from '../Utils/teamProjectApi';

const InvalidTeamProjectMessage = ({ isEditable }) => {
  let currentTeamProjectIsValid = false;
  const { data, status } = useQuery(
    'teamprojects',
    fetchArboristTeamProjectRoles,
    queryConfig
  );

  if (data) {
    const currentTeamProject = localStorage.getItem('teamProject');
    console.log('data.teams', data.teams);
    console.log(`{teamName: "${currentTeamProject}"}`);
    data.teams.forEach((team) => {
      console.log(team.teamName);
      console.log(currentTeamProject);
      if (team.teamName === currentTeamProject) {
        currentTeamProjectIsValid = true;
      }
    });

    if (currentTeamProjectIsValid === false) {
      console.log('removing teamProject');
      localStorage.removeItem('teamProject');
    }
  }
  return (
    <>
      {status}
      {!isEditable && !currentTeamProjectIsValid && status === 'success' && (
        <Result
          status='warning'
          title='There are some problems with your operation.'
          extra={
            <Button type='primary' key='console'>
              Go Console
            </Button>
          }
        />
      )}
    </>
  );
};

export default InvalidTeamProjectMessage;
