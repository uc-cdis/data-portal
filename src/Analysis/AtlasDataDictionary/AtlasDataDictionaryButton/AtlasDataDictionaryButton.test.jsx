import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AtlasDataDictionaryButton from './AtlasDataDictionaryButton';

describe('AtlasDataDictionaryButton', () => {
  it('renders the AtlasDataDictionaryButton component with an "MVP Data Dictionary" Button', () => {
    const { getByRole, getByTestId } = render(<AtlasDataDictionaryButton />);
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByRole('button')).toHaveTextContent('MVP Data Dictionary');
    expect(getByTestId('atlas-data-dictionary-button')).toBeInTheDocument();
  });

  it('shows the Modal when the button is clicked', () => {
    const { getByRole, queryByText } = render(<AtlasDataDictionaryButton />);
    fireEvent.click(getByRole('button'));
    expect(queryByText('You\'re now leaving the VA Data Commons')).toBeInTheDocument();
  });
});
