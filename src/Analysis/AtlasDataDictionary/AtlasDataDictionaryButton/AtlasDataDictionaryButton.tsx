import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import { Link } from 'react-router-dom';
import './AtlasDataDictionaryButton.css';

const AtlasDataDictionaryButton = () => (
  <div
    className='atlas-data-dictionary-button'
    data-testid='atlas-data-dictionary-button'
  >
    <Link
      to='/analysis/AtlasDataDictionary'
      target='_blank'
      rel='noopener noreferrer'
      data-testid='atlas-data-dictionary-link'
    >
      <Button
        className='analysis-app__button'
        label='Atlas Data Dictionary'
        buttonType='secondary'
        rightIcon='external-link'
      />
    </Link>
  </div>
);

export default AtlasDataDictionaryButton;
