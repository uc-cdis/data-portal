import React from 'react';
import IcoGene from './gene.svg';
import IcoStageGene from './stage-icons/stage-gene.svg';

const dictIcons = {
  gene: (height, width, scrollX, scrollY, customedStyles) => {
    if (width > 0) {
      return (<IcoGene
        viewBox={`${scrollX} ${scrollY} ${scrollX + width} ${scrollY + height}`}
        width={width}
        height={height}
        style={{ ...customedStyles }}
        preserveAspectRatio='xMinYMin slice'
      />);
    }
    return (<IcoGene
      height={height}
      viewBox={`0 ${scrollY} ${scrollX + 211} ${scrollY + height}`}
      style={{ ...customedStyles }}
      preserveAspectRatio='xMinYMin slice'
    />);
  },
  'stage-gene': (height, width, scrollX, scrollY, customedStyles) => {
    if (width > 0) {
      return (<IcoStageGene
        viewBox={`${scrollX} ${scrollY} ${scrollX + width} ${scrollY + height}`}
        width={width}
        height={height}
        style={{ ...customedStyles }}
        preserveAspectRatio='xMinYMin slice'
      />);
    }
    return (<IcoStageGene
      height={height}
      viewBox={`0 ${scrollY} ${scrollX + 211} ${scrollY + height}`}
      style={{ ...customedStyles }}
      preserveAspectRatio='xMinYMin slice'
    />);
  },
};

export default dictIcons;
