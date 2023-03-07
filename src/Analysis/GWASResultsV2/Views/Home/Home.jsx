import React, { useContext } from 'react';
import { Spin } from 'antd';
import HomeTable from './HomeTable/HomeTable';
import SharedContext from '../../Utils/SharedContext';

const Home = () => {
  const { tableData } = useContext(SharedContext);
  return (
    <div>{tableData && tableData.length > 0 ? <HomeTable /> : <Spin />}</div>
  );
};
export default Home;
