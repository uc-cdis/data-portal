import React from 'react';
import AtlasDataDictionaryTable from './AtlasDataDictionaryTable';
import TableData from './TestData/TableData';
import '../AtlasDataDictionary.css';

export default {
  title: 'Tests2/AtlasDataDictionary/Components/AtlasDataDictionaryTable',
  component: 'AtlasDataDictionaryTable',
};

const MockTemplate = () => (
  <div className='atlas-data-dictionary-container'>
    <AtlasDataDictionaryTable TableData={TableData} />
  </div>
);

export const MockedSuccess = MockTemplate.bind({});
