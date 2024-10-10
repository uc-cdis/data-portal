import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';
import './DiscoveryLoadingProgress.css';

interface DiscoveryLoadingProgressBarProps {
 allBatchesAreReady: boolean;
}

const DiscoveryLoadingProgressBar = ({
  allBatchesAreReady,
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
  }, [percent, allBatchesAreReady]);

  // hide the bar after a delay after the batches are ready,
  // giving the browser some time to process the batch
  const delayTimeBeforeHidingProgressBar = 2500;
  useEffect(() => {
    if (allBatchesAreReady) {
      setPercent(100);
      // Change displayProgressBar to false after delay
      setTimeout(() => {
        setDisplayProgressBar(false);
      }, delayTimeBeforeHidingProgressBar);
    }
  }, [allBatchesAreReady]);

  return (
    <React.Fragment>
      { displayProgressBar && (
        <div className='discovery-loading-progress-bar'>
          <Progress
            width={80}
            showInfo={false}
            percent={percent}
            status='success'
            strokeColor='#99286B'
            aria-valuenow={percent}
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
