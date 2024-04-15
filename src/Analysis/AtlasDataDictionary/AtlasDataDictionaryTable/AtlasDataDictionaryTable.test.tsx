import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AtlasDataDictionaryTable from './AtlasDataDictionaryTable';
import TableData from '../TestData/TableData';

const atlasDataDictionaryUITestIds = [
  'atlas-data-dictionary-table',
  'search-bar',
  'column-headers',
  'entries-header',
  'pagination-controls',
];

describe('AtlasDataDictionaryContainer', () => {
  it('renders the AtlasDataDictionaryContainer component and associated UI elements correctly', () => {
    render(<AtlasDataDictionaryTable TableData={TableData} />);
    atlasDataDictionaryUITestIds.forEach((testID) => {
      expect(screen.getByTestId(testID)).toBeInTheDocument();
    });
  });
});
