import React, { useState, useEffect } from 'react';
import { Loader } from '@mantine/core';
import AtlasDataDictionaryTable from './AtlasDataDictionaryTable';
import { cohortMiddlewarePath } from '../../../localconf';

const AtlasDataDictionaryLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [TableData, setTableData] = useState([{}]);
  const endpoint = `${cohortMiddlewarePath}/data-dictionary/Retrieve`;

  async function safeParseJSON(response:any) {
    const body = await response.text();
    try {
      return JSON.parse(body);
    } catch (err) {
      return {
        status: response.status,
        response: JSON.stringify(response),
        error: err.message,
      };
    }
  }

  useEffect(() => {
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

export default AtlasDataDictionaryLoading;
