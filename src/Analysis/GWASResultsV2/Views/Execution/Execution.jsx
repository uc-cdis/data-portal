import React, { useContext } from 'react';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from '../../SharedComponents/ReturnHomeButton/ReturnHomeButton';

const Execution = () => {
  const { executionData } = useContext(SharedContext);
  return (
    <React.Fragment>
      <ReturnHomeButton />
      <h1>Execution</h1>
      <div>{executionData}</div>
    </React.Fragment>
  );
};
export default Execution;
