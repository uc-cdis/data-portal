import React from 'react';
import AtlasDataDictionaryContainer from './AtlasDataDictionaryContainer';

export default {
  title: 'Tests2/AtlasDataDictionary/Components/AtlasDataDictionaryContainer',
  component: 'AtlasDataDictionaryContainer',
};

const MockTemplate = () => (
  <React.Fragment>
    <AtlasDataDictionaryContainer />
  </React.Fragment>
);

export const MockedSuccess = MockTemplate.bind({});
