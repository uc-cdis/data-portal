/* eslint-disable no-shadow */
import { memo, useState } from 'react';
import Spinner from '../../components/Spinner';
import { useExplorerConfig } from '../ExplorerConfigContext';
import useSurvivalAnalysisResult from './useSurvivalAnalysisResult';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import './ExplorerSurvivalAnalysis.css';

/** @typedef {import('./types').UserInputSubmitHandler} UserInputSubmitHandler */

function ExplorerSurvivalAnalysis() {
  const [[risktable, survival], refershResult] = useSurvivalAnalysisResult();
  const [timeInterval, setTimeInterval] = useState(4);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(undefined);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(false);
  /** @type {UserInputSubmitHandler} */
  const handleSubmit = ({
    timeInterval,
    startTime,
    endTime,
    usedFilterSets,
  }) => {
    if (isError) setIsError(false);
    setIsUpdating(true);
    setTimeInterval(timeInterval);
    setStartTime(startTime);
    setEndTime(endTime);

    refershResult(usedFilterSets)
      .then(() => setIsUpdating(false))
      .catch(() => {
        setIsError(true);
        setIsUpdating(false);
      });
  };

  const { survivalAnalysisConfig: config } = useExplorerConfig().current;

  return (
    <div className='explorer-survival-analysis'>
      <div className='explorer-survival-analysis__column-left'>
        <ControlForm
          onSubmit={handleSubmit}
          timeInterval={timeInterval}
          isError={isError}
        />
      </div>
      <div className='explorer-survival-analysis__column-right'>
        {/* eslint-disable-next-line no-nested-ternary */}
        {isUpdating ? (
          <Spinner />
        ) : isError ? (
          <div className='explorer-survival-analysis__error'>
            <h1>Error obtaining survival analysis result...</h1>
            <p>
              Please retry by clicking {'"Apply"'} button or refreshing the
              page. If the problem persists, please contact administrator for
              more information.
            </p>
          </div>
        ) : (
          <>
            {config.result?.survival && (
              <SurvivalPlot
                data={survival}
                endTime={endTime}
                startTime={startTime}
                timeInterval={timeInterval}
              />
            )}
            {config.result?.risktable && (
              <RiskTable
                data={risktable}
                endTime={endTime}
                startTime={startTime}
                timeInterval={timeInterval}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(ExplorerSurvivalAnalysis);
