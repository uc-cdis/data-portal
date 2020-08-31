import React, { useState } from 'react';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import {
  factors as mockFactors,
  fetchResult as fetchMockSurvivalResult,
} from './mockData';
import './ExplorerSurvivalAnalysis.css';

function ExplorerSurvivalAnalysis({ aggsData, filters }) {
  const [pval, setPval] = useState();
  const [risktable, setRisktable] = useState([]);
  const [survival, setSurvival] = useState([]);
  const [stratificationVariable, setStratificationVariable] = useState('');
  const [timeInterval, setTimeInterval] = useState(2);

  const handleSubmit = (userInput) => {
    setStratificationVariable(userInput.stratificationVariable);
    setTimeInterval(userInput.timeInterval);

    fetchMockSurvivalResult(userInput).then((result) => {
      setPval(result.pval && +parseFloat(result.pval).toFixed(4));
      setRisktable(result.risktable);
      setSurvival(result.survival);
    });
  };

  return (
    <div className='explorer-survival-analysis'>
      <div className='explorer-survival-analysis__warning'>
        WARNING: This component is currently using mocked survival result and
        does not fully implement the intended functionality.
      </div>
      <div className='explorer-survival-analysis__column-left'>
        <ControlForm
          factors={mockFactors}
          onSubmit={handleSubmit}
          timeInterval={timeInterval}
        />
      </div>
      <div className='explorer-survival-analysis__column-right'>
        <div className='explorer-survival-analysis__pval'>
          {pval && `Log-rank test p-value: ${pval}`}
        </div>
        <SurvivalPlot
          data={survival}
          stratificationVariable={stratificationVariable}
          timeInterval={timeInterval}
        />
        <RiskTable data={risktable} timeInterval={timeInterval} />
      </div>
    </div>
  );
}

export default ExplorerSurvivalAnalysis;
