import React from 'react';

const CohortsOverlapLegend = ({cohort1, cohort2, cohort3}) => {
    return(
    <div className="euler-diagram-legend">
      <div className="legend-item">
        <span className="legend-mark legend-mark-1"></span>
        <span className="legend-label">{cohort1}</span>
      </div>

      <div className="legend-item" >
        <span className="legend-mark legend-mark-2"></span>
        <span className="legend-label">{cohort2}</span>
      </div>

      <div className="legend-item" id="legend-set3">
        <span className="legend-mark legend-mark-3"></span>
        <span className="legend-label">{cohort3}</span>
      </div>
    </div>
    )
}
export default CohortsOverlapLegend;
