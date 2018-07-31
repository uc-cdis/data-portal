import React from 'react';
import { Link } from 'react-router-dom';

import { assignNodePositions, createNodesAndEdges } from '../DataModelGraph/utils';
import { createFullGraph, createAbridgedGraph } from './GraphCreator';

/**
 * Component handles rendering of dictionary types as a node graph
 */
class DictionaryGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullToggle: true,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { nodes, edges } = createNodesAndEdges(this.props, true, []);
    assignNodePositions(nodes, edges, { numPerRow: 3 });
    this.setState({ nodes, edges }, () => {
      if (this.state.fullToggle) {
        createFullGraph(this.state.nodes, this.state.edges);
      } else {
        if (document.getElementById('table_wrapper') !== null) {
          document.getElementById('table_wrapper').remove();
        }
        createAbridgedGraph(this.state.nodes, this.state.edges);
      }
    });
  }

  componentDidUpdate() {
    if (this.state.fullToggle) {
      createFullGraph(this.state.nodes, this.state.edges);
    } else {
      //
      // All this graph stuff is managed by d3 outside vdom, so
      // need to cleanup the mess ...
      //
      if (document.getElementById('table_wrapper') !== null) {
        document.getElementById('table_wrapper').remove();
      }
      createAbridgedGraph(this.state.nodes, this.state.edges);
    }
  }

  handleClick() {
    this.setState(prevState => ({
      fullToggle: !prevState.fullToggle,
    }));
  }

  render() {
    const divStyle = {
      backgroundColor: '#f4f4f4',
      margin: '0 auto',
      position: 'relative',
    };
    // Note: svg#data_model_graph is popuplated by createFull|AbridedGraph above
    return (
      <div data-toggle={this.state.fullToggle ? 'full' : 'abridged'}>
        <Link to={'/dd'} className="h3-typo"> Explore dictionary as a table </Link>
        <p style={{ fontSize: '75%', marginTop: '1em' }}>
          <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}> Bold, italicized</span> properties are required
        </p>
        <div style={divStyle} id="graph_wrapper">
          <button
            id="toggle_button"
            className="button-primary-white"
            onClick={this.handleClick}
          >Toggle view</button>
          <div>
            <svg id="data_model_graph" />
          </div>
        </div>
      </div>
    );
  }
}

export default DictionaryGraph;
