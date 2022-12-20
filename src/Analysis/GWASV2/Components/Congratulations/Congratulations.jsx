import React, { useState, useEffect } from 'react';

const Congratulations = ({ dispatch, setShowSuccess, successText }) => {
  <div className='configure-gwas_success'>
    <DismissibleMessage
      title={`Congratulations on your submission for ${jobName}`}
      description={`${successText}`}
    />
    <h3>DO YOU WANT TO</h3>
    <div className='GWASUI-row'>
      <div className='GWASUI-column'>
        <a href='./GWASResults'>
          <button type='button'>See Status</button>
        </a>
      </div>
      <div className='GWASUI-column'>
        <button
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
  </div>;
};
export default Congratulations;
