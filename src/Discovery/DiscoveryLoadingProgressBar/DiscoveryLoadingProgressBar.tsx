import React from 'react';
import { Progress } from 'antd';
import './DiscoveryLoadingProgress.css';

interface DiscoveryLoadingProgressBarProps {
 allBatchesAreReady: boolean;
}

const DiscoveryLoadingProgressBar = ({
  allBatchesAreReady,
}: DiscoveryLoadingProgressBarProps) => {
  if (allBatchesAreReady) {
    return null;
  }

  return (
    <div className='discovery-loading-progress-bar' aria-busy>
      <Progress
        width={80}
        showInfo={false}
        percent={100}
        status='active'
        strokeColor='#99286B'
        aria-valuenow={100}
      />
      <p className='discovery-header__stat-label'>
        Loading studies...
      </p>
    </div>
  );
};

export default DiscoveryLoadingProgressBar;
