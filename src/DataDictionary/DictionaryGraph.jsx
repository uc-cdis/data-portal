import React from 'react';
import { Link } from 'react-router';

import { assignNodePositions, createNodesAndEdges } from '../DataModelGraph/utils';
import { createFullGraph, createAbridgedGraph } from './GraphCreator';
import ToggleButton from '../DataModelGraph/ToggleButton';


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
    this.state = { ...this.state, nodes, edges };

    if (this.state.fullToggle) {
      createFullGraph(this.state.nodes, this.state.edges);
    } else {
      if (document.getElementById('table_wrapper') !== null) {
        document.getElementById('table_wrapper').remove();
      }
      createAbridgedGraph(this.state.nodes, this.state.edges);
    }
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
      textAlign: 'center',
      position: 'relative',
    };
    // Note: svg#data_model_graph is popuplated by createFull|AbridedGraph above
    return (
      <div>
        <Link to={'/dd'}> Explore dictionary as a table </Link>
        <p style={{ fontSize: '75%', marginTop: '1em' }}> <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}> Bold, italicized</span> properties are required</p>
        <div style={divStyle} id="graph_wrapper">
          <svg id="data_model_graph" />
          <ToggleButton id="toggle_button" onClick={this.handleClick}>Toggle view</ToggleButton>
        </div>
      </div>
    );
  }
}

export default DictionaryGraph;
