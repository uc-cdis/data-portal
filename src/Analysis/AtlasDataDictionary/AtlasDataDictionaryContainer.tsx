import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import ProtectedContent from '../../Login/ProtectedContent';
import AtlasDataDictionaryLoading from './AtlasDataDictionaryTable/AtlasDataDictionaryLoading';
import AtlasDataDictionaryButton from './AtlasDataDictionaryButton/AtlasDataDictionaryButton';
import './AtlasDataDictionary.css';

const AtlasDataDictionaryContainer = ({ title }) => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  if (!title || !title.includes('(new)')) {
    // Legacy component: render a div with AtlasDataDictionaryButton when title does not include '(new)'
    return (
      <div style={{ width: '100%' }}><AtlasDataDictionaryButton /></div>
    );
  } else {
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
  }
};

AtlasDataDictionaryContainer.propTypes = {
  title: PropTypes.string,
};
export default AtlasDataDictionaryContainer;
