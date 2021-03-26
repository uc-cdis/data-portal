import React from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '@gen3/guppy/dist/components/GuppyWrapper';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerTopMessageBanner from './ExplorerTopMessageBanner';
import { labelToPlural, base64Encode, base64Decode, getQueryParameter, IsValidJSONString } from './utils';
import {
  GuppyConfigType,
  FilterConfigType,
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
} from './configTypeDef';
import './GuppyDataExplorer.css';
import isEnabled from '../helpers/featureFlags';

class GuppyDataExplorer extends React.Component {
  constructor(props) {
    super(props);
    let initialState = {};
    let initialFilter = {};

    if (isEnabled('storeExplorerStateInURL')) {
      const stateFromURL = getQueryParameter('filters');
      if (stateFromURL) {
        const decodedFilter = base64Decode(stateFromURL);
        const isValidJSON = IsValidJSONString(decodedFilter);
        if (isValidJSON) {
          initialState = JSON.parse(decodedFilter);
          initialFilter = initialState.filter;
        }
      }
    }

    this.state = {
      aggsData: {},
      filter: {},
      initialFilterFromURL: initialFilter,
      encodableExplorerStateForURL: { filter: initialFilter },
      userFilterFromURL: {},
    };
  }

  getEncodedQueryStateFromExplorer = () => {
    const stateObj = this.state.encodableExplorerStateForURL;
    if (this.isExplorerStatePristine(stateObj)) {
      return '';
    }
    const encoded = encodeURIComponent(base64Encode(JSON.stringify(stateObj)));
    return encoded;
  }

  refreshQueryStateInUrl = () => {
    const encodedState = this.getEncodedQueryStateFromExplorer();
    if (encodedState === '') {
      window.history.pushState(null, null, window.location.pathname);
      return;
    }
    window.history.pushState('', '', `?filters=${encodedState}`);
  }

  applyFilterUIChanges = (filterToApplyToUI) => {
    this.setState({ userFilterFromURL: filterToApplyToUI });
  }

  handleReceiveNewAggsData = (newAggsData) => {
    this.setState({ aggsData: newAggsData });
  };

  handleFilterChangeForQueryStateUrl = (event) => {
    const newExplorerState = this.state.encodableExplorerStateForURL;
    newExplorerState.filter = event;
    this.setState({ encodableExplorerStateForURL: newExplorerState });
  }

  isExplorerStatePristine = (explorerState) => {
    const values = Object.values(explorerState);
    for (let i = 0; i < values.length; i += 1) {
      if (typeof values[i] !== 'object' && values[i] !== null) {
        return false;
      }
      if (typeof values[i] === 'object' && Object.values(values[i]).length > 0) {
        return false;
      }
    }
    return true;
  }

  render() {
    if (isEnabled('storeExplorerStateInURL')) {
      this.refreshQueryStateInUrl();
    }
    return (
      <div className='guppy-data-explorer'>
        <GuppyWrapper
          adminAppliedPreFilters={this.props.adminAppliedPreFilters}
          initialFilterFromURL={this.state.initialFilterFromURL}
          applyFilterUIChanges={this.applyFilterUIChanges}
          filterConfig={this.props.filterConfig}
          guppyConfig={{ type: this.props.guppyConfig.dataType, ...this.props.guppyConfig }}
          onReceiveNewAggsData={this.handleReceiveNewAggsData}
          onFilterChange={this.handleFilterChangeForQueryStateUrl}
          rawDataFields={this.props.tableConfig.fields}
          accessibleFieldCheckList={this.props.guppyConfig.accessibleFieldCheckList}
        >
          <ExplorerTopMessageBanner
            className='guppy-data-explorer__top-banner'
            tierAccessLevel={this.props.tierAccessLevel}
            tierAccessLimit={this.props.tierAccessLimit}
            guppyConfig={this.props.guppyConfig}
            getAccessButtonLink={this.props.getAccessButtonLink}
            hideGetAccessButton={this.props.hideGetAccessButton}
          />
          <ExplorerFilter
            className='guppy-data-explorer__filter'
            guppyConfig={this.props.guppyConfig}
            getAccessButtonLink={this.props.getAccessButtonLink}
            hideGetAccessButton={this.props.hideGetAccessButton}
            tierAccessLevel={this.props.tierAccessLevel}
            tierAccessLimit={this.props.tierAccessLimit}
            userFilterFromURL={this.state.initialFilterFromURL}
          />
          <ExplorerVisualization
            className='guppy-data-explorer__visualization'
            chartConfig={this.props.chartConfig}
            tableConfig={this.props.tableConfig}
            buttonConfig={this.props.buttonConfig}
            heatMapConfig={this.props.heatMapConfig}
            guppyConfig={this.props.guppyConfig}
            history={this.props.history}
            nodeCountTitle={
              this.props.guppyConfig.nodeCountTitle
              || labelToPlural(this.props.guppyConfig.dataType, true)}
            tierAccessLimit={this.props.tierAccessLimit}
          />
        </GuppyWrapper>
      </div>
    );
  }
}

GuppyDataExplorer.propTypes = {
  guppyConfig: GuppyConfigType.isRequired,
  filterConfig: FilterConfigType.isRequired,
  tableConfig: TableConfigType.isRequired,
  chartConfig: ChartConfigType.isRequired,
  buttonConfig: ButtonConfigType.isRequired,
  heatMapConfig: PropTypes.object,
  nodeCountTitle: PropTypes.string,
  history: PropTypes.object.isRequired,
  tierAccessLevel: PropTypes.string.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
  getAccessButtonLink: PropTypes.string,
  hideGetAccessButton: PropTypes.bool,
  adminAppliedPreFilters: PropTypes.object,
};

GuppyDataExplorer.defaultProps = {
  heatMapConfig: {},
  nodeCountTitle: undefined,
  getAccessButtonLink: undefined,
  hideGetAccessButton: false,
  adminAppliedPreFilters: {},
};

export default GuppyDataExplorer;
