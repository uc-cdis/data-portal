import React from 'react';
import PropTypes from 'prop-types';
import SearchResultTable from './SearchResultTable';
import OverlayPropertyTable from '../OverlayPropertyTable/OverlayPropertyTable';
import './SearchResultLayer.css';

class SearchResultLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedNode: null,
    };
  }

  // for closing the matched result popup
  handleClosePopup = (nodeID) => {
    this.props.onClosePopup(nodeID);
  }

  // for closing the whole node
  handleCloseNode = () => {
    this.setState({ expandedNode: null });
  };

  handleOpenNode = (node) => {
    this.setState({ expandedNode: node });
  };

  render() {
    return (
      <React.Fragment>
        {
          this.props.matchedNodeIDs.map((nodeID) => {
            if (this.props.matchedNodeExpandingStatus[nodeID]) {
              const node = this.props.dictionary[nodeID];
              if (!node) return null;
              const resultItem = this.props.searchResult
                .find(resItem => resItem.item.id === nodeID);
              return (
                <SearchResultTable
                  key={nodeID}
                  node={node}
                  nodeSVGElement={this.props.graphNodesSVGElements[nodeID]}
                  canvasBoundingRect={this.props.canvasBoundingRect}
                  matchResult={resultItem}
                  onOpenNode={() => this.handleOpenNode(node)}
                  onCloseNode={() => this.handleClosePopup(nodeID)}
                />
              );
            }
            return null;
          })
        }
        {
          this.state.expandedNode && (
            <OverlayPropertyTable
              node={this.state.expandedNode}
              hidden={false}
              onCloseOverlayPropertyTable={this.handleCloseNode}
            />
          )
        }
      </React.Fragment>
    );
  }
}

SearchResultLayer.propTypes = {
  graphNodesSVGElements: PropTypes.object,
  matchedNodeIDs: PropTypes.arrayOf(PropTypes.string),
  matchedNodeExpandingStatus: PropTypes.object,
  dictionary: PropTypes.object,
  searchResult: PropTypes.arrayOf(PropTypes.object),
  onClosePopup: PropTypes.func,
  canvasBoundingRect: PropTypes.object,
};

SearchResultLayer.defaultProps = {
  graphNodesSVGElements: null,
  matchedNodeIDs: [],
  matchedNodeExpandingStatus: {},
  dictionary: {},
  searchResult: [],
  onClosePopup: () => {},
  canvasBoundingRect: { top: 0, left: 0 },
};

export default SearchResultLayer;
