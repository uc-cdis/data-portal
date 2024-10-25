import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import ProtectedContent from '../../Login/ProtectedContent';
import AtlasDataDictionaryLoading from './AtlasDataDictionaryTable/AtlasDataDictionaryLoading';
import AtlasDataDictionaryButton from './AtlasDataDictionaryButton/AtlasDataDictionaryButton';
import './AtlasDataDictionary.css';

const AtlasDataDictionaryContainer = ({ dataDictionaryVersion }) => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  if (!dataDictionaryVersion || !dataDictionaryVersion.includes('new')) {
    // Default legacy component: render a div with AtlasDataDictionaryButton when
    // no dataDictionaryVersion is set or it does not include 'new':
    return (
      <div style={{ width: '100%' }}><AtlasDataDictionaryButton /></div>
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
