import React from 'react';
import PropTypes from 'prop-types';
import { Steps } from 'antd';
import { gwasV2Steps } from '../../Utils/constants';
import './ProgressBar.css';
import TourButton from './TourButton/TourButton';

const { Step } = Steps;
const ProgressBar = ({ currentStep, selectionMode }) => (
  <div className='progress-bar'>
    <div className='progress-bar__steps'>
      <Steps current={currentStep}>
        {gwasV2Steps.map((item, index) => (
          <Step
            key={item.title}
            icon={<React.Fragment>{index + 1}</React.Fragment>}
            title={item.title}
          />
        ))}
      </Steps>
    </div>
    <TourButton currentStep={currentStep} selectionMode={selectionMode} />
  </div>
);

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  selectionMode: PropTypes.string.isRequired,
};

export default ProgressBar;
