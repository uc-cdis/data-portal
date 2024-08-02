import React, { useState, useEffect } from 'react';
import {
  Progress,
} from 'antd';

interface DiscoveryLoadingProps {
    allBatchesAreLoaded:boolean
}

const DiscoveryLoadingProgress = ({ allBatchesAreLoaded }:DiscoveryLoadingProps) => {
  const [percent, setPercent] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (percent >= 90) return;
    const interval = setInterval(() => {
      setPercent((prevPercent) => Math.min(prevPercent + 20, 90));
    }, 1000);

    return () => clearInterval(interval);
  }, [percent]);

  const progressContainerStyle = {
    textAlign: 'center',
    width: '600px',
    margin: '20px auto',
    transition: allBatchesAreLoaded ? 'visibility 3s, height  4s' : null,
    height: allBatchesAreLoaded ? '0' : '100px',
    visibility: allBatchesAreLoaded ? 'hidden' : 'visible',
    pointerEvents: hide ? 'none' : 'auto', // Optional: Prevents interaction with the hidden element
  };

  return (
    <div style={progressContainerStyle}>
      <h3 className='discovery-header__stat-label'>Loading...</h3>
      <Progress percent={percent} showInfo={false} status='active' />
    </div>
  );
};

export default DiscoveryLoadingProgress;
