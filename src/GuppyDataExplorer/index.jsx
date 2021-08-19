import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import GuppyDataExplorer from './GuppyDataExplorer';
import {
  guppyUrl,
  tierAccessLevel,
  tierAccessLimit,
  explorerConfig,
  dataAvailabilityToolConfig,
  useNewExplorerConfigFormat,
  indexScopedTierAccessMode,
} from '../localconf';
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

    const tooltipText = 'These accessibility links assist with keyboard navigation of the site. Selecting a link will bring tab focus to the specified page content.';

    // Disabling noninteractive-tabindex rule because the span tooltip must be focusable as per https://sarahmhigley.com/writing/tooltips-in-wcag-21/
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    const tabFragment = (
      <React.Fragment>
        <div className='g3-accessibility-links' aria-describedby='g3-accessibility-links-tooltip-explorer'>
          <Tooltip
            placement='left'
            overlay={tooltipText}
            overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
            arrowContent={<div className='rc-tooltip-arrow-inner' />}
            width='300px'
            trigger={['hover', 'focus']}
          >
            <div id='g3-accessibility-links-tooltip-explorer' className='g3-helper-tooltip g3-ring-on-focus' role='tooltip' tabIndex='0'>
              <i className='g3-icon g3-icon--sm g3-icon--question-mark-bootstrap help-tooltip-icon' />
            </div>
          </Tooltip>
          <a className='g3-accessibility-nav-link g3-ring-on-focus' href='#guppy-explorer-main-tabs'><span>Explorer Filters</span></a> |
          <a className='g3-accessibility-nav-link g3-ring-on-focus' href='#guppy-explorer-data-tools'><span>Data Tools</span></a> |
          <a className='g3-accessibility-nav-link g3-ring-on-focus' href='#guppy-explorer-summary-statistics'><span>Summary Statistics</span></a> |
          <a className='g3-accessibility-nav-link g3-ring-on-focus' href='#guppy-explorer-table-of-records'><span>Table of Records</span></a>
        </div>

        <div className='guppy-explorer__tabs' id='guppy-explorer-main-tabs'>
          {explorerConfig.map((element, index) => {
            let tabTitle = '';
            if (element.tabTitle) {
              // eslint-disable-next-line prefer-destructuring
              tabTitle = element.tabTitle;
            } else if (element.guppyConfig && element.guppyConfig.dataType) {
              tabTitle = capitalizeFirstLetter(element.guppyConfig.dataType);
            }

            return (
              <React.Fragment key={index}>
                <button
                  className={'g3-unstyle-btn g3-ring-on-focus guppy-explorer__tab'.concat(this.state.tab === index ? ' guppy-explorer__tab--selected' : '')}
                  onClick={() => this.onTabClick(index)}
                  onKeyPress={() => this.onTabClick(index)}
                  type='button'
                  role='tab'
                  tabIndex='0'
                  aria-selected={this.state.tab === index ? 'true' : 'false'}
                >
                  <h3>{tabTitle}</h3>
                </button>
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

    const tierAccessLevelCalculated = indexScopedTierAccessMode
      ? explorerConfig[this.state.tab].guppyConfig.tierAccessLevel : tierAccessLevel;

    return (
      <div className='guppy-explorer'>
        {
          (explorerConfig.length > 1)
            ? tabFragment
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
              loginForDownload: explorerConfig[this.state.tab].loginForDownload,
            }}
            history={this.props.history}
            location={this.props.location}
            tierAccessLevel={tierAccessLevelCalculated}
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
