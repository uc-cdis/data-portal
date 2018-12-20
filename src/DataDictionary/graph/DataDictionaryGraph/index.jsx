import React from 'react';
import ReduxGraphCalculator from '../GraphCalculator/.';
import ReduxLegend from '../Legend/.';
import ReduxCanvas from '../Canvas/.';
import ReduxGraphDrawer from '../GraphDrawer/.';
import ReduxNodeTooltip from '../NodeTooltip/.';
import ReduxNodePopup from '../NodePopup/.';
import ReduxOverlayPropertyTable from '../OverlayPropertyTable/.';

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
