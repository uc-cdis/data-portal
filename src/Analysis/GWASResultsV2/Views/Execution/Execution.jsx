import React, { useContext } from 'react';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from '../../SharedComponents/ReturnHomeButton/ReturnHomeButton';

const Execution = () => {
  const { currentExecutionData } = useContext(SharedContext);
  return (
    <React.Fragment>
      <ReturnHomeButton />
      <h1>Execution</h1>
      <h2>{currentExecutionData}</h2>
    </React.Fragment>
  );
};
export default Execution;
