import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AtlasDataDictionaryContainer from './AtlasDataDictionaryContainer';

const atlasDataDictionaryUITestIds = [
  'atlas-data-dictionary-container',
  'search-bar',
  'column-headers',
  'entries-header',
  'pagination-controls',
];

describe('AtlasDataDictionaryContainer', () => {
  it('renders the AtlasDataDictionaryContainer component and associated UI elements correctly', () => {
    render(<AtlasDataDictionaryContainer />);
    atlasDataDictionaryUITestIds.forEach((testID) => {
      expect(screen.getByTestId(testID)).toBeInTheDocument();
    });
  });
});
