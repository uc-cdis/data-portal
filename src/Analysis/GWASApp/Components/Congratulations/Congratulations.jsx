import React from 'react';
import PropTypes from 'prop-types';
import DismissibleMessage from '../../../SharedUtils/DismissibleMessage/DismissibleMessage';
import ACTIONS from '../../Utils/StateManagement/Actions';
import './Congratulations.css';

const Congratulations = ({
  dispatch,
  setShowSuccess,
  successText,
  jobName,
}) => (
  <div className='configure-gwas_success'>
    <DismissibleMessage
      title={`Congratulations on your submission for ${jobName}`}
      description={`${successText}`}
    />
    <h3>DO YOU WANT TO</h3>
    <div className='GWASUI-row'>
      <div className='GWASUI-column'>
        <a href='./GWASResults'>
          <button id='see-status' type='button'>
            See Status
          </button>
        </a>
      </div>
      <div className='GWASUI-column'>
        <button
          id='reload'
          type='button'
          onClick={() => {
            window.location.reload();
          }}
        >
          Submit New Workflow
        </button>
      </div>
      <div className='GWASUI-column'>
        <button
          id='change-step'
          type='button'
          onClick={() => {
            setShowSuccess(false);
            dispatch({
              type: ACTIONS.SET_CURRENT_STEP,
              payload: 3,
            });
          }}
        >
          Submit Similar (Stay Here)
        </button>
      </div>
    </div>
  </div>
);

Congratulations.propTypes = {
  dispatch: PropTypes.func.isRequired,
  setShowSuccess: PropTypes.func.isRequired,
  successText: PropTypes.string.isRequired,
  jobName: PropTypes.string.isRequired,
};

export default Congratulations;
