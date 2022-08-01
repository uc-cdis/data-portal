import { connect } from 'react-redux';
import {
  clickBlankSpace,
  setCanvasBoundingRect,
  setNeedReset,
} from '../../../redux/ddgraph/slice';
import Canvas from './Canvas';

/** @typedef {import('../../../redux/types').RootState} RootState */

const ReduxCanvas = (() => {
  /** @param {RootState} state */
  const mapStateToProps = (state) => ({
    isGraphView: state.ddgraph.isGraphView,
    needReset: state.ddgraph.needReset,
  });

  /** @param {import('../../../redux/types').AppDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onClickBlankSpace: () => {
      dispatch(clickBlankSpace());
    },
    /** @param {RootState['ddgraph']['canvasBoundingRect']} canvasBoundingRect */
    onCanvasBoundingBoxUpdate: (canvasBoundingRect) => {
      dispatch(setCanvasBoundingRect(canvasBoundingRect));
    },
    onResetCanvasFinished: () => {
      dispatch(setNeedReset(false));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(Canvas);
})();

export default ReduxCanvas;
