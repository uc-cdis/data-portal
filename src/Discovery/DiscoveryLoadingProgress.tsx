import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';

interface DiscoveryLoadingProps {
  batchLoadingInfo: {allBatchesAreLoaded:boolean; isBatchLoadingEnabled: boolean;}
}

const DiscoveryLoadingProgress = ({
  batchLoadingInfo,
}: DiscoveryLoadingProps) => {
  const { allBatchesAreLoaded, isBatchLoadingEnabled } = batchLoadingInfo;
  const showBigProgress = window.location.toString().includes('showBig');
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (percent === 100) return;
    if (allBatchesAreLoaded) {
      setPercent(100);
    }
    const interval = setInterval(() => {
      setPercent((prevPercent) => prevPercent + 10);
    }, 500);
    return () => clearInterval(interval);
  }, [percent]);

  // hide the bar with a transition delay after the batches are loaded,
  // giving the browser some time to process the batch
  const progressContainerStyle = {
    textAlign: 'left',
    width: '50%',
    margin: '0px 0 0  40px',
    transition: allBatchesAreLoaded ? 'visibility 1s, height  1s' : null,
    height: allBatchesAreLoaded ? '0' : '40px',
    visibility: allBatchesAreLoaded ? 'hidden' : 'visible',
  };

  if (!showBigProgress || !isBatchLoadingEnabled) return <React.Fragment />;
  return (
    <div style={progressContainerStyle}>
      <Progress percent={percent} showInfo={false} status='success' strokeColor='#99286B' />
      <b style={{ lineHeight: 'normal' }}>Loading studies...</b>
    </div>
  );
};

export default DiscoveryLoadingProgress;
