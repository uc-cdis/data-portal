import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { create_gwas_plot } from '../lib/pheweb_plots';

/* eslint camelcase: 0 */ // --> OFF

const ManhattanPlot = ({
  variant_bins, unbinned_variants,
}) => {
  useEffect(() => {
    create_gwas_plot(variant_bins, unbinned_variants);
  }, [variant_bins, unbinned_variants]);

  return (
    <div id='manhattan_plot_container' data-testid='manhattan_plot_container' style={{ marginTop: '100px' }} />
  );
};

ManhattanPlot.propTypes = {
  variant_bins: PropTypes.array.isRequired,
  unbinned_variants: PropTypes.array.isRequired,
};

export default ManhattanPlot;
