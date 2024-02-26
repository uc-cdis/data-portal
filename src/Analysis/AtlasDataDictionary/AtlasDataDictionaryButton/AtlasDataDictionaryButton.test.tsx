import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import AtlasDataDictionaryButton from './AtlasDataDictionaryButton';

describe('AtlasDataDictionaryButton', () => {
  it('should render the Atlas Data Dictionary button correctly with a link and a secondary button', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <AtlasDataDictionaryButton />
      </BrowserRouter>
    );

    const expectedPath = '/analysis/AtlasDataDictionary';
    expect(getByTestId('atlas-data-dictionary-button')).toBeInTheDocument();
    expect(getByTestId('atlas-data-dictionary-link')).toHaveAttribute(
      'href',
      expectedPath
    );
    expect(getByTestId('atlas-data-dictionary-link')).toHaveAttribute(
      'target',
      '_blank'
    );
  });
});
