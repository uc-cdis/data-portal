import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';

interface DiscoveryLoadingProps {
  allBatchesAreLoaded: boolean;
}

const DiscoveryLoadingProgress = ({
  allBatchesAreLoaded,
}: DiscoveryLoadingProps) => {
  const showBigProgress = window.location.toString().includes('showBig');
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (percent >= 96) return;
    const interval = setInterval(() => {
      setPercent((prevPercent) => Math.min(prevPercent + 10, 96));
    }, 500);

    return () => clearInterval(interval);
  }, [percent]);

  const progressContainerStyle = {
    textAlign: 'left',
    width: '50%',
    margin: '0px 0 0  40px',
    transition: allBatchesAreLoaded ? 'visibility 1s, height  1s' : null,
    height: allBatchesAreLoaded ? '0' : '40px',
    visibility: allBatchesAreLoaded ? 'hidden' : 'visible',
    pointerEvents: allBatchesAreLoaded ? 'none' : 'auto', // Optional: Prevents interaction with the hidden element
  };

  // className='discovery-header__stat-label'
  if (!showBigProgress) return <></>;
  return (
    <div style={progressContainerStyle}>
      <Progress percent={percent} showInfo={false} status='success' />
      <b style={{ lineHeight: 'normal' }}>Loading studies...</b>
    </div>
  );
};

export default DiscoveryLoadingProgress;
