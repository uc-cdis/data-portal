import React from 'react';
import SharedContext from '../../Utils/SharedContext';
import Results from './Results';
export default {
  title: 'Tests2/GWASResults/Views/Results',
  component: 'Results',
};

const currentResultsData = 'Placeholder Results Data';
const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};

const MockTemplate = () => {
  return (
    <SharedContext.Provider
      value={{
        currentResultsData,
        setCurrentView,
      }}
    >
      <Results />
    </SharedContext.Provider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
