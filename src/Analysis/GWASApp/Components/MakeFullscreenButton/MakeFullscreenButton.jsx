import React, { useState, useEffect } from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import FullScreenClassNames from './FullscreenClassNames';
import './MakeFullscreenButton.css';

const MakeFullscreenButton = () => {
  const [analysisIsFullscreen, setAnalysisIsFullscreen] = useState(false);

  const setElementsDisplay = (selector, displayValue) => {
    document.querySelectorAll(selector).forEach((element) => {
      const temporaryElement = element;
      temporaryElement.style.display = displayValue;
    });
  };

  const HideShowElementsForFullscreen = (displayValue) => {
    FullScreenClassNames.forEach((selector) => {
      setElementsDisplay(selector, displayValue);
    });
  };

  const handleFullscreenButtonClick = () => {
    if (!analysisIsFullscreen) {
      HideShowElementsForFullscreen('none');
    }
    if (analysisIsFullscreen) {
      HideShowElementsForFullscreen('block');
    }
    setAnalysisIsFullscreen(!analysisIsFullscreen);
  };

  // Reset any hidden elements when leaving the app
  useEffect(() => () => HideShowElementsForFullscreen('block'), []);
  return (
    <div className='make-full-screen-button>
      <Button
        className='analysis-app__button'
        onClick={handleFullscreenButtonClick}
        label={analysisIsFullscreen ? 'Exit Fullscreen' : 'Make Fullscreen'}
        buttonType='secondary'
        rightIcon={analysisIsFullscreen ? 'back' : 'external-link'}
      />
    </div>
  );
};

export default MakeFullscreenButton;
