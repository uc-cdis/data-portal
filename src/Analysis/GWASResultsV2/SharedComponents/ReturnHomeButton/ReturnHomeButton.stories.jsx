import React from 'react';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from './ReturnHomeButton';

export default {
  title: 'Tests2/GWASResults/SharedComponents/ReturnHomeButton',
  component: 'ReturnHomeButton',
};

const setCurrentView = (input) => {
  alert(`setCurrentView called with ${input}`);
};
const MockTemplate = () => {
  return (
    <SharedContext.Provider
      value={{
        setCurrentView,
      }}
    >
      <ReturnHomeButton />
    </SharedContext.Provider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
