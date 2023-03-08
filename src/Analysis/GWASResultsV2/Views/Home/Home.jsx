import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import HomeTable from './HomeTable/HomeTable';

import GetTableDataFromApi from './Utils/GetTableDataFromApi';
const Home = () => {
  const [tableData, setTableData] = useState(GetTableDataFromApi());
  const pollingIntervalinMilliseconds = 5000;

  // API Polling:
  useEffect(() => {
    const interval = setInterval(() => {
      setTableData(GetTableDataFromApi());
    }, pollingIntervalinMilliseconds);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>{tableData ? <HomeTable tableData={tableData} /> : <Spin />}</div>
  );
};
export default Home;
