import React, { useState, createContext } from 'react';
import { Space } from 'antd';
import Home from './Views/Home/Home';
import Results from './Views/Results/Results';
import Execution from './Views/Execution/Execution';
import { SharedContext } from './Utils/constants';
import './GWASResultsContainer.css';

const GWASResultsContainer = () => {
  const [currentView, setCurrentView] = useState('home');
  const generateStep = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'results':
        return <Results />;
      case 'execution':
        return <Execution />;
      default:
        return null;
    }
  };

  return (
    <div className='GWASResults'>
      <SharedContext.Provider value={setCurrentView}>
        <div className='view'>{generateStep(currentView)}</div>
      </SharedContext.Provider>
    </div>
  );
};

export default GWASResultsContainer;
