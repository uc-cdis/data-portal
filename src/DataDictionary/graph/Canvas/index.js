import { connect } from 'react-redux';
import { clickBlankSpace, setSVGCTM, setCanvasBoundingRect } from '../../action.js';
import Canvas from './Canvas';

const ReduxCanvas = (() => {
  const mapStateToProps = state => ({
  });

  const mapDispatchToProps = dispatch => ({
    onClickBlankSpace: () => dispatch(clickBlankSpace()),
    onCanvasUpdate: svgCTM => dispatch(setSVGCTM(svgCTM)),
    onCanvasTopLeftUpdate: canvasBoundingRect => dispatch(setCanvasBoundingRect(canvasBoundingRect)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Canvas);
})();

export default ReduxCanvas;