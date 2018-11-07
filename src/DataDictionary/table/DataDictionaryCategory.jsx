import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter, getCategoryColor } from '../../utils';
import DataDictionaryNode from './DataDictionaryNode';
import './DataDictionaryTable.css';

class DataDictionaryCategory extends React.Component {
  render() {
    return (<div className='data-dictionary-table__category'>
      <div className='data-dictionary-table__category-head' style={{ borderLeftColor: getCategoryColor(this.props.category) }}>
        <span>
          {capitalizeFirstLetter(this.props.category)}
        </span>
        <span className='data-dictionary-table__category-download_template'>Download Template</span>
      </div>
      {
        this.props.nodes.map(
          node => (<DataDictionaryNode
            node={node}
            key={node.id}
            description={node.description}
            expanded={this.props.highlightingNodeID && this.props.highlightingNodeID === node.id}
            onExpandNode={this.props.onExpandNode}
          />),
        )
      }
    </div>);
  }
}

DataDictionaryCategory.propTypes = {
  category: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
  highlightingNodeID: PropTypes.string,
  onExpandNode: PropTypes.func,
};

DataDictionaryCategory.defaultProps = {
  highlightingNodeID: null,
  onExpandNode: () => {},
};

export default DataDictionaryCategory;
