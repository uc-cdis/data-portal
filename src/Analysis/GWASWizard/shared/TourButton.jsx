import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTour } from '@reactour/tour';
import { InfoCircleOutlined } from '@ant-design/icons';
import { caseControlTourSteps, quantitativeTourSteps } from './gwasSteps';

const TourButton = ({ stepInfo }) => {
  const { setIsOpen, setSteps, isOpen } = useTour();

  const currentSteps = stepInfo.workflowName === 'case control' ? caseControlTourSteps : quantitativeTourSteps;

  useEffect(() => {
    setSteps(currentSteps[stepInfo.step]);
  }, [stepInfo, currentSteps, setSteps]);

  return (
    <InfoCircleOutlined
      onClick={() => {
        if (!isOpen) {
          setIsOpen(true);
        }
      }}
      style={{ fontSize: '25px', color: '#08c' }}
    />
  );
};

TourButton.propTypes = {
  stepInfo: PropTypes.object.isRequired,
};

export default TourButton;
