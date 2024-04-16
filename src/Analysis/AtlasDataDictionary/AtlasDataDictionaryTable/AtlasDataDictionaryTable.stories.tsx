import React from 'react';
import AtlasDataDictionaryTable from './AtlasDataDictionaryTable';
import TableData from './TestData/TableData';

export default {
  title: 'Tests2/AtlasDataDictionary/Components/AtlasDataDictionaryContainer',
  component: 'AtlasDataDictionaryContainer',
};

const MockTemplate = () => (
  <React.Fragment>
    <AtlasDataDictionaryTable TableData={TableData} />
  </React.Fragment>
);

export const MockedSuccess = MockTemplate.bind({});
