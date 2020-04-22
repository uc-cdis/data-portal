import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import { downloadTemplate } from '../../utils';
import { getCategoryColor } from '../../NodeCategories/helper';
import DataDictionaryPropertyTable from '../DataDictionaryPropertyTable/.';
import './DataDictionaryNode.css';

class DataDictionaryNode extends React.Component {
  handleClickNode(nodeID) {
    if (!this.props.expanded) {
      this.props.onExpandNode(nodeID);
    } else {
      this.props.onExpandNode(null);
    }
  }

  handleCloseNode = () => {
    this.props.onExpandNode(null);
  }

  handleDownloadTemplate = (e, format) => {
    e.stopPropagation(); // no toggling
    downloadTemplate(format, this.props.node.id);
  }

  render() {
    return (
      <React.Fragment>
        <div
          className='data-dictionary-node'
          style={{ borderLeftColor: getCategoryColor(this.props.node.category) }}
          onClick={() => this.handleClickNode(this.props.node.id)}
          onKeyPress={() => this.handleClickNode(this.props.node.id)}
          role='button'
          tabIndex={0}
        >
          <span
            className='data-dictionary-node__title'
          >
            <i className='g3-icon g3-icon--folder data-dictionary-node__file-icon' />
            {this.props.node.title}
            <i className={`g3-icon g3-icon--chevron-${this.props.expanded ? 'down' : 'right'} data-dictionary-node__toggle-icon`} />
          </span>
          <span
            className='data-dictionary-node__description'
          >
            {this.props.description}
          </span>
          <div className='data-dictionary-node__download-group'>
            <span className='data-dictionary-node__button-wrap'>
              <Button
                className='data-dictionary-node__download-button'
                onClick={(e) => { this.handleDownloadTemplate(e, 'json'); }}
                label='JSON'
                rightIcon='download'
                buttonType='secondary'
              />
            </span>
            <span className='data-dictionary-node__button-wrap'>
              <Button
                className='data-dictionary-node__download-button'
                onClick={(e) => { this.handleDownloadTemplate(e, 'tsv'); }}
                label='TSV'
                rightIcon='download'
                buttonType='secondary'
              />
            </span>
          </div>
        </div>
        {
          this.props.expanded && (
            <div className='data-dictionary-node__property'>
              <span
                className='data-dictionary-node__property-close'
                onClick={this.handleCloseNode}
                onKeyPress={this.handleCloseNode}
                role='button'
                tabIndex={0}
              >
                Close tab
                <i className='g3-icon g3-icon--cross data-dictionary-node__property-close-icon' />
              </span>
              <div className='data-dictionary-node__property-summary'>
                <span>{this.props.node.title}</span>
                <span> has </span>
                <span>{Object.keys(this.props.node.properties).length}</span>
                <span> properties. </span>
              </div>
              <DataDictionaryPropertyTable
                properties={this.props.node.properties}
                requiredProperties={this.props.node.required}
              />
            </div>
          )
        }
      </React.Fragment>
    );
  }
}

DataDictionaryNode.propTypes = {
  node: PropTypes.object.isRequired,
  description: PropTypes.string,
  expanded: PropTypes.bool,
  onExpandNode: PropTypes.func,
};

DataDictionaryNode.defaultProps = {
  description: '',
  expanded: false,
  onExpandNode: () => {},
};

export default DataDictionaryNode;
