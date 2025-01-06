import React from 'react';
import PropTypes from 'prop-types';
import AtlasDataDictionaryLoading from './AtlasDataDictionaryTable/AtlasDataDictionaryLoading';
import AtlasLegacyDataDictionaryButton from './AtlasLegacyDataDictionaryButton/AtlasLegacyDataDictionaryButton';
import './AtlasDataDictionary.css';

const AtlasDataDictionaryContainer = ({ useLegacyDataDictionary }) => {
  if (useLegacyDataDictionary) {
    // Default legacy component: render a div with AtlasLegacyDataDictionaryButton when
    // useLegacyDataDictionary is set to true:
    return (
      <div style={{ width: '100%' }}><AtlasLegacyDataDictionaryButton /></div>
    );
  }
  return (
    <div className='atlas-data-dictionary-container'>
      <AtlasDataDictionaryLoading />
    </div>
  );
};

AtlasDataDictionaryContainer.propTypes = {
  useLegacyDataDictionary: PropTypes.bool,
};

AtlasDataDictionaryContainer.defaultProps = {
  useLegacyDataDictionary: false,
};

export default AtlasDataDictionaryContainer;
