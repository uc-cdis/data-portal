import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataDictionaryContainer from './AtlasDataDictionaryContainer';

const dataDictionaryUITestIds = [
  'data-dictionary-container',
  'search-bar',
  'column-headers',
  'entries-header',
  'pagination-controls',
];

describe('DataDictionaryContainer', () => {
  it('renders the DataDictionaryContainer component and associated UI elements correctly', () => {
    render(<DataDictionaryContainer />);
    dataDictionaryUITestIds.forEach((testID) => {
      expect(screen.getByTestId(testID)).toBeInTheDocument();
    });
  });
});
