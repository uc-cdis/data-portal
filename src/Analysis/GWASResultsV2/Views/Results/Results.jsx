import React, { useContext } from 'react';
import SharedContext from '../../Utils/SharedContext';
import ReturnHomeButton from '../../SharedComponents/ReturnHomeButton/ReturnHomeButton';

const Results = () => {
  const { currentResultsData } = useContext(SharedContext);
  return (
    <React.Fragment>
      <ReturnHomeButton />
      <h1>Results</h1>
      <h2>{currentResultsData}</h2>
    </React.Fragment>
  );
};
export default Results;
