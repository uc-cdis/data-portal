import { connect } from 'react-redux';
import { clickBlankSpace, setSVGCTM, setCanvasBoundingRect, setNeedReset } from '../../action.js';
import Canvas from './Canvas';

const ReduxCanvas = (() => {
  const mapStateToProps = state => ({
    isGraphView: state.ddgraph.isGraphView,
    needReset: state.ddgraph.needReset,
  });

  const mapDispatchToProps = dispatch => ({
    onClickBlankSpace: () => dispatch(clickBlankSpace()),
    onCanvasUpdate: svgCTM => dispatch(setSVGCTM(svgCTM)),
    onCanvasTopLeftUpdate:
      canvasBoundingRect => dispatch(setCanvasBoundingRect(canvasBoundingRect)),
    onResetCanvasFinished: () => dispatch(setNeedReset(false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Canvas);
})();

export default ReduxCanvas;
