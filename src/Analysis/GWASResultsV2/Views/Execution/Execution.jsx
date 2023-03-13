import React, { useContext } from 'react';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from '../../SharedComponents/ReturnHomeButton/ReturnHomeButton';

const Execution = () => {
  const { selectedRowData } = useContext(SharedContext);
  const { name, uid } = selectedRowData;
  return (
    <React.Fragment>
      <ReturnHomeButton />
      <h1>Execution</h1>
      <strong>Name: </strong> {name}
      <br />
      <strong>UID: </strong> {uid}
    </React.Fragment>
  );
};
export default Execution;
