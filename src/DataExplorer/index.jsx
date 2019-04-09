import React from 'react';
import PropTypes from 'prop-types';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerVisualizations from './DataExplorerVisualizations';
import arrangerApi from '../Arranger/utils';
import { config } from '../params';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const dataExplorerConfig = config.dataExplorerConfig || {};
    const arrangerConfig = dataExplorerConfig ? dataExplorerConfig.arrangerConfig : {};

    return (
      <div className='data-explorer'>
        <ArrangerWrapper
          index={arrangerConfig.index}
          graphqlField={arrangerConfig.graphqlField}
          projectId={arrangerConfig.projectId}
          api={arrangerApi}
          charts={dataExplorerConfig.charts}
        >
          <DataExplorerFilters dataExplorerConfig={dataExplorerConfig} api={arrangerApi} />
          <DataExplorerVisualizations
            dataExplorerConfig={dataExplorerConfig}
            api={arrangerApi}
            history={this.props.history}
          />
        </ArrangerWrapper>
      </div>
    );
  }
}

DataExplorer.propTypes = {
  history: PropTypes.object.isRequired,
};

export default DataExplorer;
