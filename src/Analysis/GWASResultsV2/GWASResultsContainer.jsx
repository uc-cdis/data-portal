import React, { useState } from 'react';
import Home from './Views/Home/Home';
import Results from './Views/Results/Results';
import Execution from './Views/Execution/Execution';
import SharedContext from './Utils/SharedContext';
import VIEWS from './Utils/ViewsEnumeration';
import useHideUnneededElements from './Utils/useHideUnneededElements';
import './GWASResultsContainer.css';
import InitialHomeTableState from './Utils/InitialHomeTableState';

const GWASResultsContainer = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRowData, setSelectedRowData] = useState({});
  const [homeTableState, setHomeTableState] = useState(InitialHomeTableState);

  useHideUnneededElements();
  const generateStep = () => {
    switch (currentView) {
    case VIEWS.home:
      return <Home />;
    case VIEWS.results:
      return <Results />;
    case VIEWS.execution:
      return <Execution />;
    default:
      return null;
    }
  };

  return (
    <div className='GWASResults'>
      <SharedContext.Provider
        value={{
          setCurrentView,
          selectedRowData,
          setSelectedRowData,
          homeTableState,
          setHomeTableState,
        }}
      >
        <div className='view'>{generateStep(currentView)}</div>
      </SharedContext.Provider>
    </div>
  );
};

export default GWASResultsContainer;
