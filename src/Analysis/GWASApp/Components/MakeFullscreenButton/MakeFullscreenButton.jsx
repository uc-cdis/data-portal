import React, { useState, useEffect } from 'react';
import Button from '@gen3/ui-component/dist/components/Button';

const MakeFullscreenButton = () => {
  const [analysisIsFullscreen, setAnalysisIsFullscreen] = useState(false);

  const setElementsDisplay = (selector, displayValue) => {
    document.querySelectorAll(selector).forEach((element) => {
      const temporaryElement = element;
      temporaryElement.style.display = displayValue;
    });
  };

  const HideShowElementsForFullscreen = (displayValue) => {
    const selectors = [
      '.top-bar',
      '.nav-bar',
      '.footer-container',
      '.analysis-app__title',
      '.analysis-app__description',
    ];
    selectors.forEach((selector) => {
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
    <div style={{ textAlign: 'center' }}>
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
