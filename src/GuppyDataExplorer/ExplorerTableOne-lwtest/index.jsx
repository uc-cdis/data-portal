/* eslint-disable no-shadow */
import { memo, useState } from 'react';
import { updateSurvivalResult } from '../../redux/explorer/asyncThunks';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { checkUserAgreement, handleUserAgreement } from './utils';
import './ExplorerSurvivalAnalysis.css';
import { DEFAULT_END_YEAR, DEFAULT_INTERVAL } from './const';
import CovarForm from './CovarForm';
import Button from '../../gen3-ui-component/components/Button';

/** @typedef {import('./types').UserInputSubmitHandler} UserInputSubmitHandler */

function ExplorerTableOne() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(
    (state) => state.explorer.survivalAnalysisResult
  );

  const [isUserCompliant, setIsUserCompliant] = useState(checkUserAgreement());
  const [timeInterval, setTimeInterval] = useState(DEFAULT_INTERVAL);
  const [startTime, setStartTime] = useState(0);
  const [efsFlag, setEfsFlag] = useState(false);
  const [endTime, setEndTime] = useState(DEFAULT_END_YEAR);

  /** @type {UserInputSubmitHandler} */
  // const handleSubmit = (input) => {
  //   const shouldRefetch = efsFlag !== input.efsFlag;

  //   setEfsFlag(input.efsFlag);
  //   setTimeInterval(input.timeInterval);
  //   setStartTime(input.startTime);
  //   setEndTime(input.endTime);

  //   dispatch(
  //     updateSurvivalResult({
  //       efsFlag: input.efsFlag,
  //       shouldRefetch,
  //       usedFilterSets: input.usedFilterSets,
  //     })
  //   );
  // };

  return (
    <div className='explorer-survival-analysis'>

        <>
          <div className='explorer-survival-analysis__column-left'>
           <CovarForm/>
          </div>
          <div className='explorer-survival-analysis__column-right'>
          </div>
        </>
    </div>
  );
}

export default memo(ExplorerTableOne);
