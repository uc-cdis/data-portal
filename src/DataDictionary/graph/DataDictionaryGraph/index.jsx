import React from 'react';
import ReduxGraphCalculator from '../GraphCalculator/.';
import ReduxLegend from '../Legend/.';
import ReduxCanvas from '../Canvas/.';
import ReduxGraphDrawer from '../GraphDrawer/.';
import ReduxNodeTooltip from '../NodeTooltip/.';
import ReduxNodePopup from '../NodePopup/.';
import ReduxOverlayPropertyTable from '../OverlayPropertyTable/.';
import ReduxActionLayer from '../ActionLayer/.';

class DataDictionaryGraph extends React.Component {
  handleClearSearch = () => {

  };

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
        <ReduxActionLayer />
      </React.Fragment>
    );
  }
}

export default DataDictionaryGraph;
