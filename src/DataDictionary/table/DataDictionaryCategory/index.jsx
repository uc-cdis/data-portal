import PropTypes from 'prop-types';
import {
  getCategoryColor,
  getCategoryIconSVG,
} from '../../NodeCategories/helper';
import { capitalizeFirstLetter } from '../../../utils';
import DataDictionaryNode from '../DataDictionaryNode';
import './DataDictionaryCategory.css';

function DataDictionaryCategory({
  category,
  nodes,
  highlightingNodeID,
  onExpandNode,
}) {
  const IconSVG = getCategoryIconSVG(category);
  return (
    <div className='data-dictionary-category'>
      <div
        className='data-dictionary-category__head'
        style={{ borderLeftColor: getCategoryColor(category) }}
      >
        <IconSVG className='data-dictionary-category__icon' />
        <span>{capitalizeFirstLetter(category)}</span>
        <span className='data-dictionary-category__download_template'>
          Download Template
        </span>
      </div>
      {nodes.map((node) => (
        <DataDictionaryNode
          node={node}
          key={node.id}
          description={node.description}
          expanded={highlightingNodeID && highlightingNodeID === node.id}
          onExpandNode={onExpandNode}
        />
      ))}
    </div>
  );
}

DataDictionaryCategory.propTypes = {
  category: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  highlightingNodeID: PropTypes.string,
  onExpandNode: PropTypes.func,
};

DataDictionaryCategory.defaultProps = {
  highlightingNodeID: null,
  onExpandNode: () => {},
};

export default DataDictionaryCategory;
