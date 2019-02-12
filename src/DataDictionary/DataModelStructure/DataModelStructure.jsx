import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { getCategoryIconSVG } from '../NodeCategories/helper';
import { downloadMultiTemplate } from '../utils';
import './DataModelStructure.css';

class DataModelStructure extends React.Component {
  handleClickGraphButton = () => {
    this.props.onSetGraphView(true);
    this.props.onResetGraphCanvas();
  };

  handleClickOverlayPropertyButton = () => {
    this.props.onSetGraphView(true);
    this.props.onSetOverlayPropertyTableHidden(!this.props.overlayPropertyHidden);
  };

  downloadTemplatesEnabled = () => {
    const nodeIDs = this.props.dataModelStructure.reduce((acc, cur) => {
      const { nodeID, nodeIDsBefore } = cur;
      acc.push(nodeID);
      cur.forEach(nid => acc.push(nid));
      return acc;
    }, []);
    return nodeIDs.filter(nid => !this.props.excludedNodesForTemplates.includes(nid)).length > 0;
  };

  handleDownloadAllTemplates = (format) => {
    const nodesToDownload = {};
    let counter = 1;

    this.props.dataModelStructure.forEach((entry) => {
      const { nodeID, nodeIDsBefore } = entry;
      const nodeIDsBeforeForDownload = nodeIDsBefore
        .filter(nid => !this.props.excludedNodesForTemplates.includes(nid));
      if (nodeIDsBeforeForDownload.length > 0) {
        let innerCount = 1;
        nodeIDsBeforeForDownload.forEach((nid) => {
          if (nid in nodesToDownload) return;
          if (nodeIDsBeforeForDownload.length > 1) {
            nodesToDownload[nid] = `${counter}-${innerCount}_${nid}_template.${format}`;
            innerCount += 1;
          } else nodesToDownload[nid] = `${counter}_${nid}_template.${format}`;
        });
        counter += 1;
      }
      if (!this.props.excludedNodesForTemplates.includes(nodeID)) {
        nodesToDownload[nodeID] = `${counter}_${nodeID}_template.${format}`;
        counter += 1;
      }
    });
    this.props.downloadMultiTemplate(format, nodesToDownload);
  };

  render() {
    if (!this.props.dataModelStructure) return (<React.Fragment />);
    return (
      <div className='data-model-structure'>
        <h4 className='data-model-structure__header'>Data Model Structure</h4>
        <div className='data-model-structure__containter'>
          <div className='data-model-structure__path-line' />
          {
            this.props.dataModelStructure.map((entry, i) => {
              const { nodeID, nodeIDsBefore, linksBefore, category } = entry;
              const IconSVG = getCategoryIconSVG(category);
              const lastNodeModifier = (i === this.props.dataModelStructure.length - 1) ? 'data-model-structure__node-name--last' : '';
              return (
                <React.Fragment key={nodeID}>
                  {
                    nodeIDsBefore.length > 0 && (
                      <React.Fragment>
                        <div className='data-model-structure__summary-between'>{nodeIDsBefore.length} nodes with {linksBefore.length} links</div>
                        {
                          !this.props.isGraphView && (
                            <Button
                              onClick={this.handleClickGraphButton}
                              label='See it on graph'
                              className='data-model-structure__graph-button'
                              buttonType='secondary'
                            />
                          )
                        }
                      </React.Fragment>
                    )
                  }
                  <div className='data-model-structure__node'>
                    <IconSVG className='data-model-structure__icon' />
                    <span className={`data-model-structure__node-name ${lastNodeModifier} introduction`}>{nodeID}</span>
                  </div>
                </React.Fragment>
              );
            })
          }
        </div>
        {
          this.props.isGraphView && (
            <React.Fragment>
              <Button
                onClick={this.handleClickOverlayPropertyButton}
                label={this.props.overlayPropertyHidden ? 'Open properties' : 'Close properties'}
                className='data-model-structure__table-button'
                rightIcon='list'
                buttonType='primary'
              />
              {
                this.downloadTemplatesEnabled() && (
                  <Dropdown
                    className='data-model-structure__template-download-dropdown'
                  >
                    <Dropdown.Button>Download Templates</Dropdown.Button>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        rightIcon='download'
                        onClick={() => this.handleDownloadAllTemplates('tsv')}
                      >
                        TSV
                      </Dropdown.Item>
                      <Dropdown.Item
                        rightIcon='download'
                        onClick={() => this.handleDownloadAllTemplates('json')}
                      >
                        JSON
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )
              }
            </React.Fragment>
          )
        }
      </div>
    );
  }
}

DataModelStructure.propTypes = {
  dataModelStructure: PropTypes.arrayOf(PropTypes.object),
  isGraphView: PropTypes.bool,
  onSetGraphView: PropTypes.func,
  onSetOverlayPropertyTableHidden: PropTypes.func,
  onResetGraphCanvas: PropTypes.func,
  overlayPropertyHidden: PropTypes.bool,
  downloadMultiTemplate: PropTypes.func,
  excludedNodesForTemplates: PropTypes.arrayOf(PropTypes.string),
};

DataModelStructure.defaultProps = {
  dataModelStructure: null,
  isGraphView: true,
  onSetGraphView: () => {},
  onSetOverlayPropertyTableHidden: () => {},
  onResetGraphCanvas: () => {},
  overlayPropertyHidden: true,
  downloadMultiTemplate,
  excludedNodesForTemplates: ['project', 'program'],
};

export default DataModelStructure;
