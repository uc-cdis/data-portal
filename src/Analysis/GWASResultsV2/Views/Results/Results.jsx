import React, { useContext } from 'react';
import DetailPageHeader from '../../SharedComponents/DetailPageHeader/DetailPageHeader';
import SharedContext from '../../Utils/SharedContext';

const Results = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  return (
    <React.Fragment>
      <DetailPageHeader pageTitle={'Results'} />
      <strong>Name: </strong> {name}
      <br />
      <strong>UID: </strong> {uid}
    </React.Fragment>
  );
};
export default Results;
