import React from 'react';
import SharedContext from '../../Utils/SharedContext';
import DetailPageHeader from './DetailPageHeader';

export default {
  title: 'Tests2/GWASResults/Components/DetailPageHeader',
  component: 'DetailPageHeader',
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
      <DetailPageHeader pageTitle='Example Page Title' />
    </SharedContext.Provider>
  );
};

export const MockedSuccess = MockTemplate.bind({});
