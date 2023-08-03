import React, { useState, useEffect } from 'react';
import Home from './Views/Home/Home';
import Results from './Views/Results/Results';
import Execution from './Views/Execution/Execution';
import Input from './Views/Input/Input';
import SharedContext from './Utils/SharedContext';
import VIEWS from './Utils/ViewsEnumeration';
import useHideUnneededElements from './Utils/useHideUnneededElements';
import InitialHomeTableState from './Views/Home/HomeTableState/InitialHomeTableState';
import './GWASResultsContainer.css';

const GWASResultsContainer = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRowData, setSelectedRowData] = useState({});
  const [homeTableState, setHomeTableState] = useState(InitialHomeTableState);

  const generateStep = () => {
    switch (currentView) {
    case VIEWS.home:
      return <Home />;
    case VIEWS.results:
      return <Results />;
    case VIEWS.execution:
      return <Execution />;
    case VIEWS.input:
      return <Input />;
    default:
      return null;
    }
  };

  useEffect(() => {
   useHideUnneededElements(currentView)
  },[currentView]);

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
