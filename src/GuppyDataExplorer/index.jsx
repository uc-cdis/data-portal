import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import GuppyDataExplorer from './GuppyDataExplorer';
import { guppyUrl, tierAccessLevel, tierAccessLimit, explorerConfig, dataAvailabilityToolConfig, useNewExplorerConfigFormat } from '../localconf';
import { capitalizeFirstLetter } from '../utils';
import './GuppyExplorer.css';

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    const tabIndex = (props.location.pathname === '/files') ? _.findIndex(explorerConfig, (config) => {
      // find file tab index from config array using guppyConfig.dataType
      if (config.guppyConfig && config.guppyConfig.dataType) {
        return config.guppyConfig.dataType === 'file';
      }
      return false;
    }) : 0;
    this.state = {
      tab: tabIndex,
    };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(tabIndex) {
    this.setState({ tab: tabIndex });
  }

  render() {
    // if no configs or comes from '/files' but there is no file tab
    if (explorerConfig.length === 0 || this.state.tab === -1) {
      return <React.Fragment />;
    }

    const tabFragment = (
      <React.Fragment>
        <div className='guppy-explorer__tabs'>
          {explorerConfig.map((element, index) => {
            let tabTitle = '';
            if (element.tabTitle) {
              tabTitle = element.tabTitle;
            } else if (element.guppyConfig && element.guppyConfig.dataType) {
              tabTitle = capitalizeFirstLetter(element.guppyConfig.dataType);
            }

            return (
              <React.Fragment key={index}>
                <div
                  className={'guppy-explorer__tab'.concat(this.state.tab === index ? ' guppy-explorer__tab--selected' : '')}
                  onClick={() => this.onTabClick(index)}
                  role='button'
                  tabIndex={index}
                >
                  <h3>{tabTitle}</h3>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </React.Fragment>
    );

    let heatMapConfig = null;
    // new explorer config format, DAT config should ships with each tab
    if (useNewExplorerConfigFormat
      && explorerConfig[this.state.tab].dataAvailabilityToolConfig) {
      heatMapConfig = explorerConfig[this.state.tab].dataAvailabilityToolConfig;
    }
    // old explorer config format, standalone DAT config
    if (!useNewExplorerConfigFormat && dataAvailabilityToolConfig) {
      heatMapConfig = this.state.tab === 0 ? dataAvailabilityToolConfig : null;
    }

    return (
      <div className='guppy-explorer'>
        {
          (explorerConfig.length > 1) ?
            tabFragment
            : null
        }
        <div className={(explorerConfig.length > 1) ? 'guppy-explorer__main' : ''}>
          <GuppyDataExplorer
            adminAppliedPreFilters={explorerConfig[this.state.tab].adminAppliedPreFilters}
            chartConfig={explorerConfig[this.state.tab].charts}
            filterConfig={explorerConfig[this.state.tab].filters}
            tableConfig={explorerConfig[this.state.tab].table}
            heatMapConfig={heatMapConfig}
            guppyConfig={{ path: guppyUrl, ...explorerConfig[this.state.tab].guppyConfig }}
            buttonConfig={{
              buttons: explorerConfig[this.state.tab].buttons,
              dropdowns: explorerConfig[this.state.tab].dropdowns,
              terraExportURL: explorerConfig[this.state.tab].terraExportURL,
              terraTemplate: explorerConfig[this.state.tab].terraTemplate,
              sevenBridgesExportURL: explorerConfig[this.state.tab].sevenBridgesExportURL,
              enableLimitedFilePFBExport: explorerConfig[this.state.tab].enableLimitedFilePFBExport,
            }}
            history={this.props.history}
            tierAccessLevel={tierAccessLevel}
            tierAccessLimit={tierAccessLimit}
            getAccessButtonLink={explorerConfig[this.state.tab].getAccessButtonLink}
            hideGetAccessButton={explorerConfig[this.state.tab].hideGetAccessButton}
            // the "fully uncontrolled component with a key" trick
            key={this.state.tab}
          />
        </div>
      </div>
    );
  }
}

Explorer.propTypes = {
  history: PropTypes.object.isRequired, // inherited from ProtectedContent
  location: PropTypes.object.isRequired,
};

export default Explorer;
