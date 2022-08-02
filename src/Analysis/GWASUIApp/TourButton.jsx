import React, { useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { InfoCircleOutlined } from '@ant-design/icons';
import { case_control_steps, quantitative_steps } from './gwassteps';

const TourButton = ({ stepInfo }) => {
  const { setIsOpen, setSteps, isOpen } = useTour();

  const current_steps = stepInfo.workflowName === 'case control' ? case_control_steps : quantitative_steps;

  useEffect(() => {
    setSteps(current_steps[stepInfo.step]);
  }, [stepInfo]);

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

export default TourButton;
