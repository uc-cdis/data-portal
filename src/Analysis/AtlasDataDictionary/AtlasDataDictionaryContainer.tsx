import React from 'react';
import PropTypes from 'prop-types';
import AtlasDataDictionaryLoading from './AtlasDataDictionaryTable/AtlasDataDictionaryLoading';
import AtlasLegacyDataDictionaryButton from './AtlasLegacyDataDictionaryButton/AtlasLegacyDataDictionaryButton';
import './AtlasDataDictionary.css';

const AtlasDataDictionaryContainer = ({ dataDictionaryVersion }) => {
  if (!dataDictionaryVersion || !dataDictionaryVersion.includes('new')) {
    // Default legacy component: render a div with AtlasLegacyDataDictionaryButton when
    // no dataDictionaryVersion is set or it does not include 'new':
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
  dataDictionaryVersion: PropTypes.string,
};

AtlasDataDictionaryContainer.defaultProps = {
  dataDictionaryVersion: null,
};

export default AtlasDataDictionaryContainer;
