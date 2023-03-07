import React from 'react';
import PropTypes from 'prop-types';

const CohortsOverlapLegend = ({ cohort1Label, cohort2Label, cohort3Label }) => (
  <div className='euler-diagram-legend'>
    <div className='legend-item'>
      <span className='legend-mark legend-mark-1' />
      <span className='legend-label'>{cohort1Label}</span>
    </div>
    <div className='legend-item'>
      <span className='legend-mark legend-mark-2' />
      <span className='legend-label'>{cohort2Label}</span>
    </div>
    <div className='legend-item' id='legend-set3'>
      <span className='legend-mark legend-mark-3' />
      <span className='legend-label'>{cohort3Label}</span>
    </div>
  </div>
);

CohortsOverlapLegend.propTypes = {
  cohort1Label: PropTypes.string.isRequired,
  cohort2Label: PropTypes.string.isRequired,
  cohort3Label: PropTypes.string.isRequired,
};

export default CohortsOverlapLegend;
