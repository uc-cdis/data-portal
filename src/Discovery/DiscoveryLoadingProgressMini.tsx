import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';

interface DiscoveryLoadingProps {
  allBatchesAreLoaded: boolean;
}

const DiscoveryLoadingProgressMini = ({
  allBatchesAreLoaded,
}: DiscoveryLoadingProps) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (percent >= 96) return;
    const interval = setInterval(() => {
      setPercent((prevPercent) => Math.min(prevPercent + 5, 90));
    }, 500);

    return () => clearInterval(interval);
  }, [percent]);

  const progressContainerStyle = {
    textAlign: 'center',
    marginBottom: '5px',
    transition: allBatchesAreLoaded ? 'visibility 1s, height 1s' : null,
    height: allBatchesAreLoaded ? '0' : '30px',
    visibility: allBatchesAreLoaded ? 'hidden' : 'visible',
    pointerEvents: allBatchesAreLoaded ? 'none' : 'auto', // Optional: Prevents interaction with the hidden element
  };

  return (
    <div style={progressContainerStyle}>
      <Progress width={80} showInfo={false} percent={percent} status='active' />
      <p
        style={{ lineHeight: 'normal', textTransform: 'inherit' }}
        className='discovery-header__stat-label'
      >
        Loading all studies...
      </p>
    </div>
  );
};

export default DiscoveryLoadingProgressMini;
