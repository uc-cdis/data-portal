import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';
import ACTIONS from '../../Shared/StateManagement/Actions';

const twSudo = {
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
  },
};

// todo react tour

const ConfigureGWAS = ({
  dispatch,
  numOfPCs,
  mafThreshold,
  imputationScore,
}) => {
  const { flexCol, flexRow } = twSudo;
  // https://xd.adobe.com/view/5773a0b3-0957-443b-830b-95318a30363c-0220/screen/b66dc7ca-840f-4cc9-92ba-0e02b21319fb/
  // https://ant.design/components/modal/
  // todo: add modal here, enable when fields valid (refer to WorkflowParameters.jsx & GWASFormSubmit.jsx)
  return (
    <React.Fragment>
      <div style={flexCol}>
        <div style={flexRow}>
          <React.Fragment>
            <label
              className='GWASUI-label GWASUI-asterisk'
              htmlFor='input-numOfPC'
            >
              Number of PCs to use &nbsp;
              <InputNumber
                id='input-numOfPC'
                value={numOfPCs}
                min={1}
                max={10}
                onChange={(e) =>
                  dispatch({ type: ACTIONS.UPDATE_NUM_PCS, payload: Number(e) })
                }
              />
              {/* {(!numOfPC) && (<span style={{ color: 'red' }}> Please input a value between 1 and 10</span>)} */}
            </label>
          </React.Fragment>
          <React.Fragment>
            <label className='GWASUI-label' htmlFor='input-maf'>
              MAF Cutoff &nbsp;
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
            </label>
          </React.Fragment>
        </div>
        <div style={flexRow}>
          <React.Fragment>
            {/* todo add hare dropdown here */}
            {/* dispatch({ type: "selectedHare", update: selectedHare }) */}
          </React.Fragment>
          <React.Fragment>
            <label className='GWASUI-label' htmlFor='input-imputation'>
              Imputation Score Cutoff &nbsp;
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
            </label>
          </React.Fragment>
        </div>
      </div>
    </React.Fragment>
  );
};

ConfigureGWAS.propTypes = {
  dispatch: PropTypes.func.isRequired,
  numOfPCs: PropTypes.number,
  mafThreshold: PropTypes.number,
  imputationScore: PropTypes.number,
};

ConfigureGWAS.defaultProps = {
  numOfPCs: 3,
  mafThreshold: 0.01,
  imputationScore: 0.3,
};

export default ConfigureGWAS;
