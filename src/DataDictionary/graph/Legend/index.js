import { connect } from 'react-redux';
import Legend from './Legend';

const ReduxLegend = (() => {
  /** @param {import('../../../redux/types').RootState} state */
  const mapStateToProps = (state) => ({
    items: state.ddgraph.legendItems,
  });

  return connect(mapStateToProps)(Legend);
})();

export default ReduxLegend;
