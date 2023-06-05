import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { create_gwas_plot } from '../lib/pheweb_plots';
import LoadingErrorMessage from '../../LoadingErrorMessage/LoadingErrorMessage';

/* eslint camelcase: 0 */ // --> OFF

const ManhattanPlot = ({
  variant_bins, unbinned_variants, manhattan_plot_container_id,
}) => {
  const [pheWebFailed, setPheWebFailed] = useState(false);
  const [pheWebFailure, setPheWebFailure] = useState('');

  useEffect(() => {
    try {
      create_gwas_plot(variant_bins, unbinned_variants, manhattan_plot_container_id);
    } catch (error) {
      setPheWebFailed(true);
      setPheWebFailure(error);
    }
  }, [variant_bins, unbinned_variants, manhattan_plot_container_id]);

  if (pheWebFailed) {
    return (
      <LoadingErrorMessage message={`Error while trying to render Manhattan plot: ${pheWebFailure}`} />
    );
  }

  return (
    <div id={manhattan_plot_container_id} data-testid={manhattan_plot_container_id} style={{ marginTop: '100px' }} />
  );
};

ManhattanPlot.propTypes = {
  variant_bins: PropTypes.array.isRequired,
  unbinned_variants: PropTypes.array.isRequired,
  manhattan_plot_container_id: PropTypes.string.isRequired,
};

export default ManhattanPlot;
