import { useState } from 'react';
import PropTypes from 'prop-types';
import SvgGraph from './SvgGraph';
import './DataModelGraph.css';

/**
 * Wraps SVG graph in a toggle button that toggles between 'full' and 'compact' view
 * Properties are {full, compact}
 */
function DataModelGraph({ compact, full }) {
  const [fullToggle, setFullToggle] = useState(false);
  function handleToggleClick() {
    setFullToggle(!fullToggle);
  }

  const { nodes, edges } = fullToggle ? full : compact;
  if (nodes.length !== 0 && 'count' in nodes[nodes.length - 1]) {
    return (
      <div className='data-model-graph'>
        <button
          id='cd-dmg__toggle'
          className='button-primary-white'
          onClick={handleToggleClick}
          type='button'
        >
          Toggle view
        </button>
        <SvgGraph nodes={nodes} edges={edges} />
      </div>
    );
  }
  return null;
}

DataModelGraph.propTypes = {
  compact: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object),
    edges: PropTypes.arrayOf(PropTypes.object),
  }),
  full: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.object),
    edges: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default DataModelGraph;
