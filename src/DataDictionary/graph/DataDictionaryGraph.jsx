import React from 'react';
import { ReduxGraphCalculator, ReduxGraphDrawer, ReduxLegend, ReduxCanvas, ReduxNodeTooltip, ReduxNodePopup } from './reduxer';
import ReduxOverlayPropertyTable from './OverlayPropertyTable';

class DataDictionaryGraph extends React.Component {
  render() {
    return (
      <React.Fragment>
        <ReduxGraphCalculator />
        <ReduxLegend />
        <ReduxCanvas>
          <ReduxGraphDrawer />
        </ReduxCanvas>
        <ReduxNodeTooltip />
        <ReduxNodePopup />
        <ReduxOverlayPropertyTable />
      </React.Fragment>
    );
  }
}

export default DataDictionaryGraph;
