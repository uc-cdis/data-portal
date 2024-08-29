import React, { useState } from 'react';

interface ExternalFooterProps {
    url: string
}

const ExternalFooter: React.FC<ExternalFooterProps> = (props: ExternalFooterProps) => {
  const [elementHeight, setElementHeight] = useState('178px');
  return (
    <iframe
      title='externalFooter'
      id='externalFooter'
      frameBorder={0}
      src={props.url}
      style={{ display: 'block', width: '100%', height: elementHeight }}
      onLoad={
        () => setElementHeight(
          `${document.getElementById('externalFooter').contentWindow.document.body.scrollHeight}px`,
        )
      }
    />
  );
};
export default ExternalFooter;
