import React from 'react';
import SvgGraph from './SvgGraph';
import './DataModelGraph.less';

/**
 * Wraps SVG graph in a toggle button that toggles between 'full' and 'compact' view
 * Properties are {full, compact}
 */
class DataModelGraph extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.state = {
      fullToggle: false,
    };
  }

  handleToggleClick() {
    this.setState((prevState) => ({ fullToggle: !prevState.fullToggle }));
  }

  render() {
    const graph = this.state.fullToggle ? this.props.full : this.props.compact;

    if (
      graph.nodes.length !== 0 &&
      'count' in graph.nodes[graph.nodes.length - 1]
    ) {
      return (
        <div className='data-model-graph'>
          <button
            id='cd-dmg__toggle'
            className='button-primary-white'
            onClick={this.handleToggleClick}
          >
            Toggle view
          </button>
          <SvgGraph nodes={graph.nodes} edges={graph.edges} />
        </div>
      );
    }
    return null;
  }
}

export default DataModelGraph;
