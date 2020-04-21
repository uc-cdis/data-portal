import React from 'react';
import PropTypes from 'prop-types';
import GuppyDataExplorer from './GuppyDataExplorer';
import { guppyUrl, tierAccessLevel, tierAccessLimit, explorerConfig, dataAvailabilityToolConfig } from '../localconf';
import { capitalizeFirstLetter } from '../utils';
import './GuppyExplorer.css';

// const defaultConfig = {
//   charts: {},
//   filters: { tabs: [] },
//   table: {
//     enabled: true,
//     fields: [],
//   },
//   guppyConfig: {
//     dataType: 'subject',
//     fieldMapping: [],
//     manifestMapping: {
//       resourceIndexType: 'file',
//       resourceIdField: 'file_id', // TODO: change to object_id
//       referenceIdFieldInResourceIndex: 'subject_id',
//       referenceIdFieldInDataIndex: 'subject_id', // TODO: change to node_id
//     },
//   },
//   buttons: [],
//   dropdowns: {},
// };

// const defaultFileConfig = {
//   charts: {},
//   filters: { tabs: [] },
//   table: {
//     enabled: true,
//     fields: [],
//   },
//   guppyConfig: {
//     dataType: 'file',
//     fieldMapping: [],
//     manifestMapping: {
//       resourceIndexType: 'subject',
//       resourceIdField: 'subject_id',
//       referenceIdFieldInResourceIndex: 'file_id', // TODO: change to object_id
//       referenceIdFieldInDataIndex: 'file_id', // TODO: change to object_id
//     },
//   },
//   buttons: [],
//   dropdowns: {},
// };

// const guppyExplorerConfig = [
//   _.merge(defaultConfig, config.dataExplorerConfig),
//   _.merge(defaultFileConfig, config.fileExplorerConfig),
// ];

// const routes = [
//   '/explorer',
//   '/files',
// ];

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(tabIndex) {
    this.setState({ tab: tabIndex });
  }

  render() {
    if (explorerConfig.length === 0) {
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

    return (
      <div className='guppy-explorer'>
        {
          (explorerConfig.length > 1) ?
            tabFragment
            : null
        }
        <div className={'guppy-explorer__main'}>
          <GuppyDataExplorer
            adminAppliedPreFilters={explorerConfig[this.state.tab].adminAppliedPreFilters}
            chartConfig={explorerConfig[this.state.tab].charts}
            filterConfig={explorerConfig[this.state.tab].filters}
            tableConfig={explorerConfig[this.state.tab].table}
            heatMapConfig={this.state.tab === 0 ? dataAvailabilityToolConfig : null}
            guppyConfig={{ path: guppyUrl, ...explorerConfig[this.state.tab].guppyConfig }}
            buttonConfig={{
              buttons: explorerConfig[this.state.tab].buttons,
              dropdowns: explorerConfig[this.state.tab].dropdowns,
              terraExportURL: explorerConfig[this.state.tab].terraExportURL,
              terraTemplate: explorerConfig[this.state.tab].terraTemplate,
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
};

export default Explorer;
