import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';

interface DiscoveryLoadingProps {
 batchLoadingInfo: {allBatchesAreLoaded:boolean; isBatchLoadingEnabled: boolean;}
}

const DiscoveryLoadingProgressMini = ({
  batchLoadingInfo,
}: DiscoveryLoadingProps) => {
  const [percent, setPercent] = useState(0);
  const { allBatchesAreLoaded, isBatchLoadingEnabled } = batchLoadingInfo;
  const [displayProgressBar, setDisplayProgressBar] = useState(true);

  // this should probably be done in a CSS for production:
  const style = document.createElement('style');
  style.type = 'text/css';
  const css = '.discovery-header__dropdown-tags-container {margin-top: 15px;} .discovery-header{align-items:start;} ';
  style.innerHTML = css;
  document.head.appendChild(style);

  // Fake loading UI
  const percentUpdateInterval = 500;
  const percentIncrementAmount = 5;
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prevPercent) => prevPercent + percentIncrementAmount);
    }, percentUpdateInterval);
    return () => clearInterval(interval);
  }, [percent, allBatchesAreLoaded]);

  const delayTimeBeforeHidingProgressBar = 2000;
  useEffect(() => {
    if (allBatchesAreLoaded) {
      // Change displayProgressBar to false after delay
      setTimeout(() => {
        setDisplayProgressBar(false);
      }, delayTimeBeforeHidingProgressBar);
    }
  }, [allBatchesAreLoaded]);

  // hide the bar with a transition delay after the batches are loaded,
  // giving the browser some time to process the batch
  const progressContainerStyle = {
    textAlign: 'center',
    marginBottom: '5px',
    display: displayProgressBar ? 'block' : 'none',
  };

  if (isBatchLoadingEnabled) {
    return (
      <div style={progressContainerStyle}>
        <Progress
          width={80}
          showInfo={false}
          percent={allBatchesAreLoaded ? 100 : percent}
          status='success'
          strokeColor='#99286B'
        />
        <p
          style={{ lineHeight: 'normal', textTransform: 'inherit' }}
          className='discovery-header__stat-label'
        >
        Loading studies...
        </p>
      </div>
    );
  }
  return <React.Fragment />;
};

export default DiscoveryLoadingProgressMini;
