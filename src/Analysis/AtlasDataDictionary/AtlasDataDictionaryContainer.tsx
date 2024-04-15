import React from 'react';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import ProtectedContent from '../../Login/ProtectedContent';
import AtlasDataDictionaryLoading from './AtlasDataDictionaryTable/AtlasDataDictionaryLoading';
import './AtlasDataDictionary.css';

const AtlasDataDictionaryContainer = () => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  return (
    <div className='atlas-data-dictionary-container'>
      <ProtectedContent
        public
        location={location}
        history={history}
        match={match}
        component={() => <AtlasDataDictionaryLoading />}
      />
    </div>
  );
};

export default AtlasDataDictionaryContainer;
