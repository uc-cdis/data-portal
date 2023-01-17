import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Steps } from 'antd';
import { useTour } from '@reactour/tour';
import TourSteps  from './TourSteps';

const TourButton = ({ currentStep }) => {
  const { setIsOpen, setSteps } = useTour();
 
  useEffect(() => {
    console.log("currentStep", currentStep);
    console.log("setSteps", setSteps);
    setSteps(TourSteps[currentStep]);
  }, [currentStep]);

  return (
    <Button onClick={() => setIsOpen(true)}>New to GWAS? Get started here!</Button>
    );
};

TourButton.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default TourButton;
