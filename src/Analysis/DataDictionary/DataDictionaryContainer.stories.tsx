import React from 'react';
import DataDictionaryContainer from './DataDictionaryContainer';

export default {
  title: 'Tests2/DataDictionary/Components/DataDictionaryContainer',
  component: 'DataDictionaryContainer',
};

const MockTemplate = () => {
  return (
    <>
      <DataDictionaryContainer />
    </>
  );
};

export const MockedSuccess = MockTemplate.bind({});
