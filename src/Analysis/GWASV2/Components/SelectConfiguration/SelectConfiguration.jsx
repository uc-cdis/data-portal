import React from 'react';
import ACTIONS from '../../Utils/StateManagement/Actions';
import { InputNumber } from 'antd';
import SelectHareDropDown from '../SelectHare/SelectHareDropDown';
import './SelectConfiguration.css';

const SelectConfiguration = ({
  numOfPCs,
  mafThreshold,
  selectedCohort,
  covariates,
  outcome,
  dispatch,
  imputationScore,
}) => {
  return (
    <>
      <div className='GWASUI-row'>
        <div className='GWASUI-column'>
          <label htmlFor='input-numOfPC'>Number of PCs to use</label>
          <InputNumber
            id='input-numOfPC'
            value={numOfPCs}
            min={1}
            max={10}
            onChange={(e) =>
              dispatch({ type: ACTIONS.UPDATE_NUM_PCS, payload: Number(e) })
            }
          />
        </div>
        <div className='GWASUI-column'>
          <label htmlFor='input-maf'>MAF Cutoff &nbsp;</label>
          <InputNumber
            id='input-maf'
            value={mafThreshold}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.UPDATE_MAF_THRESHOLD,
                payload: Number(e),
              })
            }
            stringMode
            step='0.01'
            min={'0'}
            max={'0.5'}
          />
        </div>
      </div>
      <div className='GWASUI-row'>
        <div className='GWASUI-column'>
          <label htmlFor='input-selectHareDropDown'>HARE Ancestry</label>
          <SelectHareDropDown
            id='input-selectHareDropDown'
            selectedCohort={selectedCohort}
            covariates={covariates}
            outcome={outcome}
            dispatch={dispatch}
          />
        </div>
        <div className='GWASUI-column'>
          <label htmlFor='input-imputation'>
            Imputation Score Cutoff &nbsp;{' '}
          </label>
          <InputNumber
            id='input-imputation'
            value={imputationScore}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.UPDATE_IMPUTATION_SCORE,
                payload: Number(e),
              })
            }
            stringMode
            step='0.1'
            min={'0'}
            max={'1'}
          />
        </div>
      </div>
    </>
  );
};

export default SelectConfiguration;
