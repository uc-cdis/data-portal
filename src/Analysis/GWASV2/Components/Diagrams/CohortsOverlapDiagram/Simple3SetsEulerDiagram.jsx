import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3-selection';
import * as venn from '@upsetjs/venn.js';
import './CohortsOverlapDiagram.css';

const Simple3SetsEulerDiagram = ({
  set1Size,
  set2Size,
  set3Size,
  set12Size,
  set13Size,
  set23Size,
  set123Size,
  // optional labels:
  set1Label,
  set2Label,
  set3Label,
  set12Label,
  set13Label,
  set23Label,
  set123Label,
}) => {
  const sets = [
    { sets: ['1'], size: set1Size, label: set1Label || Number(set1Size).toLocaleString() }, // TODO - these items take "color": as an attribute. So we can use that to guarantee the color and add a legend.
    { sets: ['2'], size: set2Size, label: set2Label || Number(set2Size).toLocaleString() },
    { sets: ['3'], size: set3Size, label: set3Label || Number(set3Size).toLocaleString() },
    { sets: ['1', '2'], size: set12Size, label: set12Label || Number(set12Size).toLocaleString() },
    { sets: ['1', '3'], size: set13Size, label: set13Label || Number(set13Size).toLocaleString() },
    { sets: ['2', '3'], size: set23Size, label: set23Label || Number(set23Size).toLocaleString() },
    { sets: ['1', '2', '3'], size: set123Size, label: set123Label || Number(set123Size).toLocaleString() },
  ];

  useEffect(() => {
    // some basic validation:
    if ((set1Size < set12Size || set1Size < set13Size)
    || (set2Size < set12Size || set2Size < set23Size)
    || (set3Size < set13Size || set3Size < set23Size)) {
      throw Error('Error: invalid set sizes. A set overlap cannot be bigger than the set itself.');
    }
    const chart = venn.VennDiagram();
    console.log(sets); // TODO - remove this .log later
    d3.select('#euler').datum(sets).call(chart);
  }, [sets]);

  return (
    <div id='euler' className='euler-diagram' />
  );
};

Simple3SetsEulerDiagram.propTypes = {
  set1Size: PropTypes.number.isRequired,
  set1Label: PropTypes.string,
  set2Size: PropTypes.number.isRequired,
  set2Label: PropTypes.string,
  set3Size: PropTypes.number.isRequired,
  set3Label: PropTypes.string,
  set12Size: PropTypes.number.isRequired,
  set12Label: PropTypes.string,
  set13Size: PropTypes.number.isRequired,
  set13Label: PropTypes.string,
  set23Size: PropTypes.number.isRequired,
  set23Label: PropTypes.string,
  set123Size: PropTypes.number.isRequired,
  set123Label: PropTypes.string,
};

Simple3SetsEulerDiagram.defaultProps = {
  set1Label: null,
  set2Label: null,
  set3Label: null,
  set12Label: null,
  set13Label: null,
  set23Label: null,
  set123Label: null,
};

export default Simple3SetsEulerDiagram;
