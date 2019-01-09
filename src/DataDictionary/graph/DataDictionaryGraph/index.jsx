import React from 'react';
import PropTypes from 'prop-types';
import ReduxGraphCalculator from '../GraphCalculator/.';
import ReduxLegend from '../Legend/.';
import ReduxCanvas from '../Canvas/.';
import ReduxGraphDrawer from '../GraphDrawer/.';
import ReduxNodeTooltip from '../NodeTooltip/.';
import ReduxNodePopup from '../NodePopup/.';
import ReduxOverlayPropertyTable from '../OverlayPropertyTable/.';
import ReduxActionLayer from '../ActionLayer/.';

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
        <ReduxActionLayer onClearSearchResult={this.props.onClearSearchResult} />
      </React.Fragment>
    );
  }
}

DataDictionaryGraph.propTypes = {
  onClearSearchResult: PropTypes.func,
};

DataDictionaryGraph.defaultProps = {
  onClearSearchResult: () => {},
};

export default DataDictionaryGraph;
