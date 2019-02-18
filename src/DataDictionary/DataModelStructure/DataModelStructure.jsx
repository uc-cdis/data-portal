import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { getCategoryIconSVG } from '../NodeCategories/helper';
import { downloadMultiTemplate } from '../utils';
import { intersection } from '../../utils';
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
    if (this.props.relatedNodeIDs.length > this.props.excludedNodesForTemplates) return true;
    const intersectionNodeIDs = intersection(
      this.props.relatedNodeIDs,
      this.props.excludedNodesForTemplates,
    );
    return intersectionNodeIDs.length !== this.props.relatedNodeIDs.length;
  }

  handleDownloadAllTemplates = (format) => {
    const nodesToDownload = {};
    this.props.relatedNodeIDs
      .filter(nid => !this.props.excludedNodesForTemplates.includes(nid))
      .forEach((nid) => {
        nodesToDownload[nid] = `${nid}-template.${format}`;
      }, []);
    const allRoutes = this.props.allRoutes.map(nodeIDsInRoute =>
      nodeIDsInRoute.filter(nid => !this.props.excludedNodesForTemplates.includes(nid)));
    this.props.downloadMultiTemplate(
      format,
      nodesToDownload,
      allRoutes,
      this.props.clickingNodeName,
      this.props.dictionaryVersion,
    );
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
                    <Dropdown.Button>Download templates</Dropdown.Button>
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
  relatedNodeIDs: PropTypes.arrayOf(PropTypes.string),
  allRoutes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  clickingNodeName: PropTypes.string,
  dictionaryVersion: PropTypes.string,
};

DataModelStructure.defaultProps = {
  dataModelStructure: null,
  isGraphView: true,
  onSetGraphView: () => {},
  onSetOverlayPropertyTableHidden: () => {},
  onResetGraphCanvas: () => {},
  overlayPropertyHidden: true,
  downloadMultiTemplate,
  excludedNodesForTemplates: ['program', 'project'],
  relatedNodeIDs: [],
  allRoutes: [],
  clickingNodeName: '',
  dictionaryVersion: 'Unknown',
};

export default DataModelStructure;
