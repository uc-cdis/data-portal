import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import PropTypes from 'prop-types';
import { calculateDropdownButtonConfigs, humanizeNumber } from '../../DataExplorer/utils';
import { ButtonConfigType, GuppyConfigType } from '../configTypeDef';

class ExplorerButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manifestEntryCount: 0,

      // a semaphore that could hold pending state by multiple queries
      pendingManifestEntryCountRequestNumber: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.totalCount !== this.props.totalCount) {
      this.refreshManifestEntryCount();
    }
  }

  refreshManifestEntryCount = async () => {
    const fileType = 'file'; // FIXME
    this.setState(prevState => ({
      pendingManifestEntryCountRequestNumber: prevState.pendingManifestEntryCountRequestNumber + 1,
      manifestEntryCount: 0,
    }));
    if (this.props.buttonConfig
      && this.props.buttonConfig.buttons
      && this.props.buttonConfig.buttons.some(btnCfg => btnCfg.type === 'manifest' && btnCfg.enabled)) {
      const nodeIDResult = await this.props.downloadRawDataByFields({ fields: [this.props.nodeIDField] });
      if (nodeIDResult) {
        const nodeIDList = nodeIDResult.map(i => i[this.props.nodeIDField]);
        const countResult = await this.props.getTotalCountsByTypeAndFilter(fileType, {
          [this.props.nodeIDField]: {
            selectedValues: nodeIDList,
          },
        });
        this.setState(prevState => ({
          manifestEntryCount: countResult,
          pendingManifestEntryCountRequestNumber: prevState.pendingManifestEntryCountRequestNumber - 1,
        }));
      } else {
        throw Error('Error when downloading data');
      }
    }
  }

  downloadData = filename => () => {
    this.props.downloadRawData().then((res) => {
      if (res) {
        const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'text/json' });
        FileSaver.saveAs(blob, filename);
      } else {
        throw Error('Error when downloading data');
      }
    });
  };

  downloadManifest = filename => async () => {
    const fileType = 'file'; // FIXME
    const nodeIDList = await this.props.downloadRawDataByFields({ fields: [this.props.nodeIDField] }).then(res => res.map(i => i[this.props.nodeIDField]));
    const resultManifest = await this.props.downloadRawDataByTypeAndFilter(
      fileType, {
        [this.props.nodeIDField]: {
          selectedValues: nodeIDList,
        },
      },
      ['file_id', 'subject_id'],
    );
    if (resultManifest) {
      const blob = new Blob([JSON.stringify(resultManifest, null, 2)], { type: 'text/json' });
      FileSaver.saveAs(blob, filename);
    } else {
      throw Error('Error when downloading manifest');
    }
  }

  exportToCloud = () => {
    // exportAllSelectedDataToCloud(
    //   this.props.api,
    //   this.props.projectId,
    //   this.props.dataExplorerConfig.arrangerConfig.nodeCountField,
    //   this.state.nodeIds,
    //   this.props.dataExplorerConfig.arrangerConfig,
    // );
  }

  getOnClickFunction = (buttonConfig) => {
    let clickFunc = () => {};
    if (buttonConfig.type === 'data') {
      clickFunc = this.downloadData(buttonConfig.fileName);
    }
    if (buttonConfig.type === 'manifest') {
      clickFunc = this.downloadManifest(buttonConfig.fileName);
    }
    if (buttonConfig.type === 'export') {
      clickFunc = this.exportToCloud;
    }
    return clickFunc;
  }

  renderButton = (buttonConfig) => {
    const clickFunc = this.getOnClickFunction(buttonConfig);
    const pendingState = buttonConfig.type === 'manifest' ? (this.state.pendingManifestEntryCountRequestNumber > 0) : false;
    let buttonTitle = buttonConfig.title;
    if (buttonConfig.type === 'data') {
      buttonTitle = `${buttonConfig.title} (${this.props.totalCount})`;
    } else if (buttonConfig.type === 'manifest' && !pendingState && this.state.manifestEntryCount > 0) {
      buttonTitle = `${buttonConfig.title} (${humanizeNumber(this.state.manifestEntryCount)})`;
    }


    return (
      <Button
        key={buttonConfig.type}
        onClick={clickFunc}
        label={buttonTitle}
        leftIcon={buttonConfig.leftIcon}
        rightIcon={buttonConfig.rightIcon}
        className='data-explorer__download-button'
        buttonType='primary'
        enabled={this.isButtonEnabled(buttonConfig)}
        tooltipEnabled={buttonConfig.tooltipText ? !this.isButtonEnabled(buttonConfig) : false}
        tooltipText={buttonConfig.tooltipText}
        isPending={pendingState}
      />
    );
  }

  isButtonEnabled = (buttonConfig) => {
    if (buttonConfig.type === 'manifest') {
      return this.state.manifestEntryCount > 0;
    }

    return this.props.totalCount > 0;
  }

  render() {
    const dropdownConfigs = calculateDropdownButtonConfigs(this.props.buttonConfig);
    return (
      <React.Fragment>
        {
          /*
          * First, render dropdown buttons
          * Buttons are grouped under same dropdown if they have the same dropdownID
          * If only one button points to the same dropdownId, it won't be grouped into dropdown
          *   but will only be rendered as sinlge normal button instead.
          */
          dropdownConfigs && Object.keys(dropdownConfigs).length > 0
          && Object.keys(dropdownConfigs)
            .filter(dropdownId => (dropdownConfigs[dropdownId].cnt > 1))
            .map((dropdownId) => {
              const entry = dropdownConfigs[dropdownId];
              const btnConfigs = entry.buttonConfigs;
              const dropdownTitle = entry.dropdownConfig.title;
              return (
                <Dropdown
                  key={dropdownId}
                  className='data-explorer__dropdown'
                  disabled={this.props.totalCount === 0}
                >
                  <Dropdown.Button>{dropdownTitle}</Dropdown.Button>
                  <Dropdown.Menu>
                    {
                      btnConfigs.map((btnCfg) => {
                        const onClick = this.getOnClickFunction(btnCfg);
                        return (
                          <Dropdown.Item
                            key={btnCfg.type}
                            leftIcon='datafile'
                            rightIcon='download'
                            onClick={onClick}
                          >
                            {btnCfg.title}
                          </Dropdown.Item>
                        );
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown>
              );
            })
        }
        {
          /**
          * Second, render normal buttons.
          * Buttons without dropdownId are rendered as normal buttons
          * Buttons don't share same dropdownId with others are rendered as normal buttons
          */
          this.props.buttonConfig
          && this.props.buttonConfig.buttons
          && this.props.buttonConfig.buttons
            .filter(buttonConfig => !dropdownConfigs
              || !buttonConfig.dropdownId
              || (dropdownConfigs[buttonConfig.dropdownId].cnt === 1),
            )
            .filter(buttonConfig => buttonConfig.enabled)
            .map(buttonConfig => this.renderButton(buttonConfig))
        }
      </React.Fragment>
    );
  }
}

ExplorerButtonGroup.propTypes = {
  downloadRawData: PropTypes.func,
  downloadRawDataByFields: PropTypes.func,
  getTotalCountsByTypeAndFilter: PropTypes.func,
  downloadRawDataByTypeAndFilter: PropTypes.func,
  totalCount: PropTypes.number,
  buttonConfig: ButtonConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
  filter: PropTypes.object,
  nodeIDField: PropTypes.string,
};

ExplorerButtonGroup.defaultProps = {
  nodeIDField: 'subject_id',
};

export default ExplorerButtonGroup;
