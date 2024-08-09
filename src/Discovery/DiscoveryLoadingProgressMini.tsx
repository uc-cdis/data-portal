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

  // this should probably be done in a CSS for production:
  const style = document.createElement('style');
  style.type = 'text/css';
  const css = '.discovery-header__dropdown-tags-container {margin-top: 15px;} .discovery-header{align-items:start;} ';
  style.innerHTML = css;
  document.head.appendChild(style);

  // Fake loading UI
  useEffect(() => {
    if (percent >= 96) return;
    const interval = setInterval(() => {
      setPercent((prevPercent) => Math.min(prevPercent + 5, 90));
    }, 500);
    return () => clearInterval(interval);
  }, [percent]);

  // hide the bar with a transition delay after the batches are loaded,
  // giving the browser some time to process the batch
  const progressContainerStyle = {
    textAlign: 'center',
    marginBottom: '5px',
    transition: allBatchesAreLoaded ? 'visibility 1s, height 1s' : null,
    height: allBatchesAreLoaded ? '0' : '30px',
    visibility: allBatchesAreLoaded ? 'hidden' : 'visible',
  };

  if (isBatchLoadingEnabled) {
    return (
      <div style={progressContainerStyle}>
        <Progress
          width={80}
          showInfo={false}
          percent={percent}
          status='success'
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
