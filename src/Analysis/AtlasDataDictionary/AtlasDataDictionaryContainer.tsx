import React, { useState, useEffect } from 'react';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { Loader } from '@mantine/core';
import AtlasDataDictionaryTable from './AtlasDataDictionaryTable/AtlasDataDictionaryTable';
import ProtectedContent from '../../Login/ProtectedContent';
import { cohortMiddlewarePath } from '../../localconf';
import './AtlasDataDictionary.css';

export const UserLoggedInContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [TableData, setTableData] = useState([{}]);
  const endpoint = `${cohortMiddlewarePath}/data-dictionary/Retrieve`;

  async function safeParseJSON(response:any) {
    const body = await response.text();
    try {
      return JSON.parse(body);
    } catch (err) {
      return { status: response.status, response: JSON.stringify(response), error: err.message };
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetch(endpoint)
      .then((response) => safeParseJSON(response))
      .then((data) => {
        setTableData(data);
        setIsLoading(false);
      });
  }, [endpoint]);

  const TableDataIsValid = 'total' in TableData && 'data' in TableData;
  if (!isLoading && !TableDataIsValid) {
    // eslint-disable-next-line
    console.error(TableData);
    return (<h3 className='data-not-available'>Data Not Available</h3>);
  }
  return (
    <React.Fragment>
      {isLoading && (
        <div className='loading-container'>
          <Loader />
          <br />
          Loading...
        </div>
      )}
      {!isLoading && TableDataIsValid && (
        <AtlasDataDictionaryTable TableData={TableData} />
      )}
    </React.Fragment>
  );
};

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
        component={() => <UserLoggedInContent />}
      />
    </div>
  );
};

export default AtlasDataDictionaryContainer;
