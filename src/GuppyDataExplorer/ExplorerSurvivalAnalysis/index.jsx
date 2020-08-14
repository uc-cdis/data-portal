import React from 'react';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import './ExplorerSurvivalAnalysis.css';

function ExplorerSurvivalAnalysis() {
  return (
    <div className='explorer-survival-analysis'>
      <div className='explorer-survival-analysis__column-left'>
        <ControlForm className='explorer-survival-analysis__control-form' />
      </div>
      <div className='explorer-survival-analysis__column-right'>
        <SurvivalPlot className='explorer-survival-analysis__survival-plot' />
        <RiskTable className='explorer-survival-analysis__risk-table' />
      </div>
    </div>
  );
}

export default ExplorerSurvivalAnalysis;
