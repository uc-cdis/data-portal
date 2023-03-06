import React, { useState } from 'react';
import { Space } from 'antd';
import Home from './Views/Home/Home';
import './GWASResults.less';

const GWASResultsContainer = () => {
  const [currentView, setCurrentView] = useState('home');
  const returnHome = () => {
    setCurrentView('home');
  };

  const generateStep = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'results':
        return <Results returnHome={returnHome} />;
      case 'execution':
        return <Execution returnHome={returnHome} />;
      default:
        return null;
    }
  };

  return (
    <div className='GWASResults'>
      <div className='view'>
        <Space direction={'vertical'} align={'center'}>
          {generateStep(currentView)}
        </Space>
      </div>
    </div>
  );
};

export default GWASResultsContainer;
