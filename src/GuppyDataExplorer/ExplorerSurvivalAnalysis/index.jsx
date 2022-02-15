/* eslint-disable no-shadow */
import { memo, useState } from 'react';
import Spinner from '../../components/Spinner';
import Button from '../../gen3-ui-component/components/Button';
import { useExplorerConfig } from '../ExplorerConfigContext';
import useSurvivalAnalysisResult from './useSurvivalAnalysisResult';
import SurvivalPlot from './SurvivalPlot';
import ControlForm from './ControlForm';
import RiskTable from './RiskTable';
import { checkUserAgreement, handleUserAgreement } from './utils';
import './ExplorerSurvivalAnalysis.css';

/** @typedef {import('./types').UserInputSubmitHandler} UserInputSubmitHandler */

function ExplorerSurvivalAnalysis() {
  const [isUserCompliant, setIsUserCompliant] = useState(checkUserAgreement());

  const [parsedResult, refershResult] = useSurvivalAnalysisResult();
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
      {isUserCompliant ? (
        <>
          <div className='explorer-survival-analysis__column-left'>
            <ControlForm
              countByFilterSet={parsedResult.count}
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
                  page. If the problem persists, please contact administrator
                  for more information.
                </p>
              </div>
            ) : (
              <>
                {config.result?.survival && (
                  <SurvivalPlot
                    data={parsedResult.survival}
                    endTime={endTime}
                    startTime={startTime}
                    timeInterval={timeInterval}
                  />
                )}
                {config.result?.risktable && (
                  <RiskTable
                    data={parsedResult.risktable}
                    endTime={endTime}
                    startTime={startTime}
                    timeInterval={timeInterval}
                  />
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className='explorer-survival-analysis__user-agreement'>
          <p>
            In order to use the Survival Analysis analytics tool, you must agree
            to the following:
          </p>
          <ul>
            <li>
              I will not engage in “p-hacking” or other forms of statistical
              abuse.
            </li>
            <li>
              I will maintain a hypothesis record and declare a hypothesis
              before analyzing data.
            </li>
            <li>
              I will not reproduce or distribute results generated using
              analytics tools.
            </li>
            <li>
              I understand and agree that use of analytics tools is logged and
              monitored to identify abuse and improve the tools. Individual user
              data may be shared with partners of the PCDC (e.g., member
              consortia) for operational purposes. Aggregate or de-identified
              user data may be shared outside of the PCDC without limitation.
            </li>
            <li>
              I understand that access may be revoked if a user is suspected to
              engage in statistical abuse.
            </li>
          </ul>
          <Button
            buttonType='primary'
            label='I Agree'
            onClick={() => {
              handleUserAgreement();
              setIsUserCompliant(checkUserAgreement());
            }}
          />
        </div>
      )}
    </div>
  );
}

export default memo(ExplorerSurvivalAnalysis);
