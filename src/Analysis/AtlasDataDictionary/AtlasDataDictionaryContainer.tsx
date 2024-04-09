import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Loader } from '@mantine/core';
import AtlasDataDictionaryTable from './AtlasDataDictionaryTable';
import ProtectedContent from '../../Login/ProtectedContent';
import './AtlasDataDictionary.css';

export const UserLoggedInContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [TableData, setTableData] = useState([{}]);
  const endpoint =
    'https://qa-mickey.planx-pla.net/cohort-middleware/data-dictionary/Retrieve';
  useEffect(() => {
    setIsLoading(true);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
        console.log(data);
        setIsLoading(false);
      });
  }, []);
  const TableDataIsValid = 'total' in TableData && 'data' in TableData;
  return (
    <div className='atlas-data-dictionary-container'>
      {isLoading && (
        <div className='loading-container'>
          <Loader />
          <br />
          Loading...
        </div>
      )}
      {!isLoading && TableDataIsValid && (
        /*  <ProtectedContent
            public
            match={true}
            location={location}
            history={history}
            component={() => <AtlasDataDictionaryTable TableData={TableData} />}
          />
          /* https://qa-mickey.planx-pla.net/dev.html/analysis/AtlasDataDictionary */
        <AtlasDataDictionaryTable TableData={TableData} />
      )}
      {!isLoading && !TableDataIsValid && (
        <h1>Recieved Table Data is Invalid</h1>
      )}
    </div>
  );
};

const AtlasDataDictionaryContainer = () => {
  const location = useLocation();
  const history = useHistory();

  return (
    <ProtectedContent
      public
      location={location}
      history={history}
      component={() => <UserLoggedInContent />}
    />
  );
};

export default AtlasDataDictionaryContainer;
