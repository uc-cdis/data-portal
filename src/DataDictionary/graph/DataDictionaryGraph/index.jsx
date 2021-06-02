import React from 'react';
import PropTypes from 'prop-types';
import ReduxGraphCalculator from '../GraphCalculator';
import ReduxLegend from '../Legend';
import ReduxCanvas from '../Canvas';
import ReduxGraphDrawer from '../GraphDrawer';
import ReduxNodeTooltip from '../NodeTooltip';
import ReduxNodePopup from '../NodePopup';
import ReduxOverlayPropertyTable from '../OverlayPropertyTable';
import ReduxActionLayer from '../ActionLayer';

function DataDictionaryGraph({ onClearSearchResult }) {
  return (
    <>
      <ReduxGraphCalculator />
      <ReduxCanvas>
        <ReduxGraphDrawer />
      </ReduxCanvas>
      <ReduxLegend />
      <ReduxNodeTooltip />
      <ReduxNodePopup />
      <ReduxOverlayPropertyTable />
      <ReduxActionLayer onClearSearchResult={onClearSearchResult} />
    </>
  );
}

DataDictionaryGraph.propTypes = {
  onClearSearchResult: PropTypes.func,
};

DataDictionaryGraph.defaultProps = {
  onClearSearchResult: () => {},
};

export default DataDictionaryGraph;
