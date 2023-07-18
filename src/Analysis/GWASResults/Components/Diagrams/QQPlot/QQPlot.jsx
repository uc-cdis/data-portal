import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { create_qq_plot } from '../lib/pheweb_plots';
import LoadingErrorMessage from '../../LoadingErrorMessage/LoadingErrorMessage';

/* eslint camelcase: 0 */ const QQPlot = ({
  maf_ranges,
  qq_ci,
  qq_plot_container_id,
}) => {
  const [pheWebFailed, setPheWebFailed] = useState(false);
  const [pheWebFailure, setPheWebFailure] = useState('');

  useEffect(() => {
    console.log('maf_ranges', maf_ranges);
    console.log('qq_ci', qq_ci);
    try {
      create_qq_plot(maf_ranges, qq_ci, qq_plot_container_id);
    } catch (error) {
      setPheWebFailed(true);
      setPheWebFailure(error);
    }
  }, [maf_ranges, qq_ci, qq_plot_container_id]);

  if (pheWebFailed) {
    return (
      <LoadingErrorMessage
        message={`Error while trying to render qq plot: ${pheWebFailure}`}
      />
    );
  }

  return (
    <div id={qq_plot_container_id} data-testid={qq_plot_container_id}></div>
  );
};

QQPlot.propTypes = {
  maf_ranges: PropTypes.array.isRequired,
  qq_ci: PropTypes.array.isRequired,
  qq_plot_container_id: PropTypes.string.isRequired,
};

export default QQPlot;
