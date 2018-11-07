import React from 'react';
import PropTypes from 'prop-types';
import { getCategoryColor } from '../../utils';
import DataDictionaryPropertyTable from './DataDictionaryPropertyTable';
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

  render() {
    return (
      <React.Fragment>
        <div className='data-dictionary-node' style={{ borderLeftColor: getCategoryColor(this.props.node.category) }}>
          <span className='data-dictionary-node__title' onClick={() => this.handleClickNode(this.props.node.id)}>
            <i className='g3-icon g3-icon--datafile data-dictionary-node__file-icon' />
            {this.props.node.title}
            <i className={`g3-icon g3-icon--chevron-${this.props.expanded ? 'down' : 'right'} data-dictionary-node__toggle-icon`} />
          </span>
          <span className='data-dictionary-node__description'>
            {this.props.description}
          </span>
          <div className='data-dictionary-node__download-group'>
            <span className='data-dictionary-node__button-wrap'>
              <a
                className='data-dictionary-node__download-button'
                href={`/api/v0/submission/template/${this.props.node.id}?format=json`}
              >
                JSON
              </a>
            </span>
            <span className='data-dictionary-node__button-wrap'>
              <a
                className='data-dictionary-node__download-button'
                href={`/api/v0/submission/template/${this.props.node.id}?format=tsv`}
              >
                TSV
              </a>
            </span>
          </div>
        </div>
        {
          this.props.expanded && (
            <DataDictionaryPropertyTable
              nodeName={this.props.node.title}
              properties={this.props.node.properties}
              requiredProperties={this.props.node.required}
              onClose={this.handleCloseNode}
            />
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
