import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { create_qq_plot } from '../lib/pheweb_plots';
import LoadingErrorMessage from '../../LoadingErrorMessage/LoadingErrorMessage';

/* eslint camelcase: 0 */ const QQPlot = ({
  maf_ranges,
  qq_ci,
  qq_plot_container_id,
}) => {
  const [qqPlotFailed, setQQPlotFailed] = useState(false);
  const [qqPlotFailure, setQQPlotFailure] = useState('');

  useEffect(() => {
    try {
      create_qq_plot(maf_ranges, qq_ci, qq_plot_container_id);
    } catch (error) {
      setQQPlotFailed(true);
      setQQPlotFailure(error);
    }
  }, [maf_ranges, qq_ci, qq_plot_container_id]);

  if (qqPlotFailed) {
    return (
      <LoadingErrorMessage
        message={`Error while trying to render qq plot: ${qqPlotFailure}`}
      />
    );
  }

  return <div id={qq_plot_container_id} data-testid={qq_plot_container_id} />;
};

QQPlot.propTypes = {
  maf_ranges: PropTypes.array.isRequired,
  qq_ci: PropTypes.array.isRequired,
  qq_plot_container_id: PropTypes.string.isRequired,
};

export default QQPlot;
