import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useTour } from '@reactour/tour';
import TourSteps from './TourSteps';

const TourButton = ({ currentStep, selectionMode }) => {
  const { setIsOpen, setSteps } = useTour();

  useEffect(() => {
    console.log('currentStep', currentStep);
    console.log('setSteps', setSteps);
    console.log('SelectionMode', selectionMode);
    if (selectionMode === 'continuous' && currentStep === 1) {
      setSteps(TourSteps[1.1]);
    } else if (selectionMode === 'dichotomous' && currentStep === 1) {
      setSteps(TourSteps[1.2]);
    } else if (selectionMode === 'continuous' && currentStep === 2) {
      setSteps(TourSteps[2.1]);
    } else if (selectionMode === 'dichotomous' && currentStep === 2) {
      setSteps(TourSteps[2.2]);
    } else {
      setSteps(TourSteps[currentStep]);
    }
  }, [currentStep, selectionMode]);

  return (
    <Button onClick={() => setIsOpen(true)}>New to GWAS? Get started here!</Button>
  );
};

TourButton.propTypes = {
  currentStep: PropTypes.number.isRequired,
  selectionMode: PropTypes.string.isRequired,
};

export default TourButton;
