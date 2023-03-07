import React, { useState, useEffect } from 'react';
import Home from './Views/Home/Home';
import Results from './Views/Results/Results';
import Execution from './Views/Execution/Execution';
import SharedContext from './Utils/SharedContext';
import GetTableDataFromApi from './Utils/GetTableDataFromApi';
import './GWASResultsContainer.css';

const GWASResultsContainer = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentExecutionData, setCurrentExecutionData] = useState({});
  const [currentResultsData, setCurrentResultsData] = useState({});
  const [tableData, setTableData] = useState(GetTableDataFromApi());

  const pollingIntervalinMilliseconds = 50000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTableData(GetTableDataFromApi());
    }, pollingIntervalinMilliseconds);

    return () => clearInterval(interval);
  }, []);

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
      <SharedContext.Provider
        value={{
          setCurrentView,
          tableData,
          currentExecutionData,
          setCurrentExecutionData,
          currentResultsData,
          setCurrentResultsData,
        }}
      >
        <div className='view'>{generateStep(currentView)}</div>
      </SharedContext.Provider>
    </div>
  );
};

export default GWASResultsContainer;
