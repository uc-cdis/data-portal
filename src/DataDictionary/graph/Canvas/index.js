import { connect } from 'react-redux';
import { clickBlankSpace, setCanvasBoundingRect, setNeedReset } from '../../action';
import Canvas from './Canvas';

const ReduxCanvas = (() => {
  const mapStateToProps = state => ({
    isGraphView: state.ddgraph.isGraphView,
    needReset: state.ddgraph.needReset,
  });

  const mapDispatchToProps = dispatch => ({
    onClickBlankSpace: () => dispatch(clickBlankSpace()),
    onCanvasBoundingBoxUpdate:
      canvasBoundingRect => dispatch(setCanvasBoundingRect(canvasBoundingRect)),
    onResetCanvasFinished: () => dispatch(setNeedReset(false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Canvas);
})();

export default ReduxCanvas;
