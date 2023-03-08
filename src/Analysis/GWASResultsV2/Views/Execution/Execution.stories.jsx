import React from 'react';
import SharedContext from '../../Utils/SharedContext';
import Execution from './Execution';

export default {
  title: 'Tests2/GWASResults/Views/Execution',
  component: 'Execution',
};

const currentExecutionData = 'Placeholder Execution Data';
const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};

const MockTemplate = () => {
  return (
    <SharedContext.Provider
      value={{
        currentExecutionData,
        setCurrentView,
      }}
    >
      <Execution />
    </SharedContext.Provider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
