import React from 'react';
import DataDictionaryContainer from './DataDictionaryContainer';

export default {
  title: 'Tests2/DataDictionary/Components/DataDictionaryContainer',
  component: 'DataDictionaryContainer',
};

const MockTemplate = () => (
  <React.Fragment>
    <DataDictionaryContainer />
  </React.Fragment>
);

export const MockedSuccess = MockTemplate.bind({});
