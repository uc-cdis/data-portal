import React, { useState } from 'react';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import { getSurvivalSeries } from './utils';
import {
  factors as mockFactors,
  fetchResult as fetchMockSurvivalResult,
} from './mockData';
import './ExplorerSurvivalAnalysis.css';

function ExplorerSurvivalAnalysis({ aggsData, filters }) {
  const [pval, setPval] = useState();
  const [risktable, setRisktable] = useState([]);
  const [survivalSeries, setSurvivalSeries] = useState([]);
  const [timeInterval, setTimeInterval] = useState(2);

  const handleSubmit = (userInput) => {
    setTimeInterval(userInput.timeInterval);

    fetchMockSurvivalResult(userInput).then((result) => {
      setPval(result.pval && +parseFloat(result.pval).toFixed(4));
      setRisktable(result.risktable);
      setSurvivalSeries(getSurvivalSeries(result.survival, userInput));
    });
  };

  return (
    <div className='explorer-survival-analysis'>
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
        <SurvivalPlot data={survivalSeries} timeInterval={timeInterval} />
        <RiskTable data={risktable} timeInterval={timeInterval} />
      </div>
    </div>
  );
}

export default ExplorerSurvivalAnalysis;
