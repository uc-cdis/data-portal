import React from 'react';
import PropTypes from 'prop-types';
import { Space, InputNumber, Select } from 'antd';

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
  selectedHare,
}) => {
  const { flexCol, flexRow } = twSudo;
  // https://xd.adobe.com/view/5773a0b3-0957-443b-830b-95318a30363c-0220/screen/b66dc7ca-840f-4cc9-92ba-0e02b21319fb/
  // https://ant.design/components/modal/
  // todo: add modal here, enable when fields valid (refer to WorkflowParameters.jsx & GWASFormSubmit.jsx)
  return (
    <>
      <div style={flexCol}>
        <div style={flexRow}>
          <>
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
                onChange={(e) => dispatch({ type: 'numOfPCs', update: e })}
              />
              {/* {(!numOfPC) && (<span style={{ color: 'red' }}> Please input a value between 1 and 10</span>)} */}
            </label>
          </>
          <>
            <label className='GWASUI-label' htmlFor='input-maf'>
              MAF Cutoff &nbsp;
              <InputNumber
                id='input-maf'
                value={mafThreshold}
                onChange={(e) =>
                  dispatch({ type: 'mafTheshold', update: Number(e) })
                }
                stringMode
                step='0.01'
                min={'0'}
                max={'0.5'}
              />
            </label>
          </>
        </div>
        <div style={flexRow}>
          <>
            {/* todo add hare dropdown here */}
            {/* dispatch({ type: "selectedHare", update: selectedHare }) */}
          </>
          <>
            <label className='GWASUI-label' htmlFor='input-imputation'>
              Imputation Score Cutoff &nbsp;
              <InputNumber
                id='input-imputation'
                value={imputationScore}
                onChange={(e) =>
                  dispatch({ type: 'imputationScore', update: Number(e) })
                }
                stringMode
                step='0.1'
                min={'0'}
                max={'1'}
              />
            </label>
          </>
        </div>
      </div>
    </>
  );
};

ConfigureGWAS.propTypes = {
  dispatch: PropTypes.func.isRequired,
  numOfPCs: PropTypes.number.isRequired,
  mafThreshold: PropTypes.number.isRequired,
  imputationScore: PropTypes.number.isRequired,
  selectedHare: PropTypes.object.isRequired,
};

ConfigureGWAS.defaultProps = {
  numOfPCs: 3,
  mafThreshold: 0.01,
  imputationScore: 0.3,
  selectedHare: {},
};

export default ConfigureGWAS;
