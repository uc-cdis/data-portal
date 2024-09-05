import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import './DiscoveryLoadingProgress.css';

interface DiscoveryLoadingProgressBarProps {
 allBatchesAreLoaded: boolean;
}

const DiscoveryLoadingProgressBar = ({
  allBatchesAreLoaded,
}: DiscoveryLoadingProgressBarProps) => {
  const [percent, setPercent] = useState(0);
  const [displayProgressBar, setDisplayProgressBar] = useState(true);

  // Auto incrementing percent logic
  const percentUpdateInterval = 500;
  const percentIncrementAmount = 5;
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prevPercent) => prevPercent + percentIncrementAmount);
    }, percentUpdateInterval);
    return () => clearInterval(interval);
  }, [percent, allBatchesAreLoaded]);

  // hide the bar with a transition delay after the batches are loaded,
  // giving the browser some time to process the batch
  const delayTimeBeforeHidingProgressBar = 2000;
  useEffect(() => {
    if (allBatchesAreLoaded) {
      // Change displayProgressBar to false after delay
      setTimeout(() => {
        setDisplayProgressBar(false);
      }, delayTimeBeforeHidingProgressBar);
    }
  }, [allBatchesAreLoaded]);

  return (
    <React.Fragment>
      { displayProgressBar && (
        <div className='discovery-loading-progress-bar' style={{ display: displayProgressBar ? 'block' : 'none' }}>
          <Progress
            width={80}
            showInfo={false}
            percent={allBatchesAreLoaded ? 100 : percent}
            status='success'
            strokeColor='#99286B'
          />
          <p className='discovery-header__stat-label'>
            Loading studies...
          </p>
        </div>
      )}
    </React.Fragment>
  );
};

export default DiscoveryLoadingProgressBar;
