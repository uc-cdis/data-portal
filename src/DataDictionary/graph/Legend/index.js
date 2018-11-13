import { connect } from 'react-redux';
import Legend from './Legend';

const ReduxLegend = (() => {
  const mapStateToProps = state => ({
    items: state.ddgraph.legendItems,
  });

  return connect(mapStateToProps)(Legend);
})();

export default ReduxLegend;
