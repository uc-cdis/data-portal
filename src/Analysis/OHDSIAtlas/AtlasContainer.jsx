import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AtlasStarter from './Views/AtlasStarter';

const AtlasContainer = ({ atlasUrl, handleIframeApp }) => {
  const [currentView, setCurrentView] = useState('start');
  const [teamProject, setTeamProject] = useState('');

  const setCurrentViewAndTeamProject = (viewName, selectedTeamProject) => {
    setCurrentView(viewName);
    setTeamProject(selectedTeamProject);
  };
  const generateView = () => {
    switch (currentView) {
    case 'start':
      return <AtlasStarter setCurrentViewAndTeamProject={setCurrentViewAndTeamProject} />;
    case 'atlas':
      return (
        <React.Fragment>
          <div className='analysis-app__iframe-wrapper'>
            <iframe
              className='analysis-app__iframe'
              title='Analysis App'
              frameBorder='0'
              src={`${atlasUrl}?teamproject=${teamProject}`}
              onLoad={handleIframeApp}
            />
          </div>
        </React.Fragment>
      );
    default:
      return null;
    }
  };

  return (
    <div className='AtlasContainer' style={{ width: '100%' }}>
      <div className='view'>{generateView(currentView)}</div>
    </div>
  );
};

AtlasContainer.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  handleIframeApp: PropTypes.func.isRequired,
};

export default AtlasContainer;
