import React from 'react';
import { ReduxGraphCalculator, ReduxGraphDrawer, ReduxLegend, ReduxCanvas, ReduxNodeTooltip, ReduxNodePopup } from './reduxer';

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
      </React.Fragment>
    );
  }
}

export default DataDictionaryGraph;
