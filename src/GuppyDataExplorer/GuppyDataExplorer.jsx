import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import GuppyWrapper from '@gen3/guppy/dist/components/GuppyWrapper';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerTopMessageBanner from './ExplorerTopMessageBanner';
import { capitalizeFirstLetter } from '../utils';
import {
  GuppyConfigType,
  FilterConfigType,
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
} from './configTypeDef';
import './GuppyDataExplorer.css';

class GuppyDataExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aggsData: {},
      filter: {},
    };
  }

  handleReceiveNewAggsData = (newAggsData) => {
    this.setState({ aggsData: newAggsData });
  };

  renderGetAccessButton = () => {
    let getAccessButtonConfig;
    if (this.props.buttonConfig
          && this.props.buttonConfig.buttons) {
      getAccessButtonConfig = this.props.buttonConfig.buttons
        .find(buttonConfig => buttonConfig.type === 'get-access');
    }
    return (
      <Button
        label={(getAccessButtonConfig && getAccessButtonConfig.title) ? getAccessButtonConfig.title : 'Get Access'}
        buttonType='default'
        onClick={(getAccessButtonConfig && getAccessButtonConfig.link) ?
          (() => {
            window.open(getAccessButtonConfig.link);
          }) : (() => {})// placeholder, if no link provided, maybe display a message toaster?)
        }
      />
    );
  };

  render() {
    return (
      <div className='guppy-data-explorer'>
        <GuppyWrapper
          filterConfig={this.props.filterConfig}
          guppyConfig={{ type: this.props.guppyConfig.dataType, ...this.props.guppyConfig }}
          onReceiveNewAggsData={this.handleReceiveNewAggsData}
          onFilterChange={this.handleFilterChange}
          rawDataFields={this.props.tableConfig.fields}
        >
          <ExplorerTopMessageBanner
            className='guppy-data-explorer__top-banner'
            tierAccessLevel={this.props.tierAccessLevel}
            tierAccessLimit={this.props.tierAccessLimit}
            renderGetAccessButton={this.renderGetAccessButton}
          />
          <ExplorerFilter
            className='guppy-data-explorer__filter'
            tierAccessLevel={this.props.tierAccessLevel}
            tierAccessLimit={this.props.tierAccessLimit}
            renderGetAccessButton={this.renderGetAccessButton}
          />
          <ExplorerVisualization
            className='guppy-data-explorer__visualization'
            chartConfig={this.props.chartConfig}
            tableConfig={this.props.tableConfig}
            buttonConfig={this.props.buttonConfig}
            guppyConfig={this.props.guppyConfig}
            history={this.props.history}
            nodeCountTitle={this.props.nodeCountTitle || capitalizeFirstLetter(
              this.props.guppyConfig.dataType)}
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
  nodeCountTitle: PropTypes.string,
  history: PropTypes.object.isRequired,
  tierAccessLevel: PropTypes.string.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
};

GuppyDataExplorer.defaultProps = {
  nodeCountTitle: undefined,
};

export default GuppyDataExplorer;
