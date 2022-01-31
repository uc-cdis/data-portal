import { connect } from 'react-redux';
import ActionLayer from './ActionLayer';

/** @typedef {import('../../types').DdgraphState} DdgraphState */

const ReduxActionLayer = (() => {
  /** @param {{ ddgraph: DdgraphState }} state */
  const mapStateToProps = (state) => ({
    isSearchMode: state.ddgraph.isSearchMode,
  });

  return connect(mapStateToProps)(ActionLayer);
})();

export default ReduxActionLayer;
