import React from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';
import ACTIONS from '../../Utils/StateManagement/Actions';
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
}) => (
  <React.Fragment>
    <div className='GWASUI-row'>
      <div data-tour='configure-pcs' className='GWASUI-column'>
        <label htmlFor='input-numOfPC'>Number of PCs to use</label>
        <InputNumber
          id='input-numOfPCs'
          value={numOfPCs}
          min={1}
          max={10}
          onChange={(e) => dispatch({ type: ACTIONS.UPDATE_NUM_PCS, payload: Number(e) })}
        />
      </div>
      <div data-tour='configure-maf' className='GWASUI-column'>
        <label htmlFor='input-maf'>MAF Cutoff &nbsp;</label>
        <InputNumber
          id='input-maf'
          value={mafThreshold}
          onChange={(e) => dispatch({
            type: ACTIONS.UPDATE_MAF_THRESHOLD,
            payload: Number(e),
          })}
          stringMode
          step='0.01'
          min={'0'}
          max={'0.5'}
        />
      </div>
    </div>
    <div className='GWASUI-row'>
      <div data-tour='configure-hare' className='GWASUI-column'>
        <label htmlFor='input-selectHareDropDown'>HARE Ancestry</label>
        <SelectHareDropDown
          id='input-selectHareDropDown'
          selectedCohort={selectedCohort}
          covariates={covariates}
          outcome={outcome}
          dispatch={dispatch}
        />
      </div>
      <div data-tour='configure-imputation' className='GWASUI-column'>
        <label htmlFor='input-imputation'>
          Imputation Score Cutoff &nbsp;{' '}
        </label>
        <InputNumber
          id='input-imputation'
          value={imputationScore}
          onChange={(e) => dispatch({
            type: ACTIONS.UPDATE_IMPUTATION_SCORE,
            payload: Number(e),
          })}
          stringMode
          step='0.1'
          min={'0'}
          max={'1'}
        />
      </div>
    </div>
  </React.Fragment>
);

SelectConfiguration.propTypes = {
  numOfPCs: PropTypes.number.isRequired,
  mafThreshold: PropTypes.number.isRequired,
  selectedCohort: PropTypes.object.isRequired,
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  imputationScore: PropTypes.number.isRequired,
};

export default SelectConfiguration;
