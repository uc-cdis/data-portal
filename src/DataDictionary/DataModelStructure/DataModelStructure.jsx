import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { getTypeIconSVG } from '../utils';
import './DataModelStructure.css';

class DataModelStructure extends React.Component {
  handleClickGraphButton = () => {
    this.props.onSetGraphView(true);
  };

  handleClickOverlayPropertyButton = () => {
    this.props.onSetGraphView(true);
    this.props.onOpenOverlayPropertyTable();
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
              const IconSVG = getTypeIconSVG(category);
              const lastNodeModier = (i === this.props.dataModelStructure.length - 1) ? 'data-model-structure__node-name--last' : '';
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
                  <div className={'data-model-structure__node'}>
                    <IconSVG className='data-model-structure__icon' />
                    <span className={`data-model-structure__node-name ${lastNodeModier} introduction`}>{nodeID}</span>
                  </div>
                </React.Fragment>
              );
            })
          }
        </div>
        {
          this.props.isGraphView && (
            <Button
              onClick={this.handleClickOverlayPropertyButton}
              label='Open properties'
              className='data-model-structure__table-button'
              rightIcon='list'
              buttonType='primary'
            />
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
  onOpenOverlayPropertyTable: PropTypes.func,
};

DataModelStructure.defaultProps = {
  dataModelStructure: null,
  isGraphView: true,
  onSetGraphView: () => {},
  onOpenOverlayPropertyTable: () => {},
};

export default DataModelStructure;
