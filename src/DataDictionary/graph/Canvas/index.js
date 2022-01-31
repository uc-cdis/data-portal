import { connect } from 'react-redux';
import {
  clickBlankSpace,
  setCanvasBoundingRect,
  setNeedReset,
} from '../../action';
import Canvas from './Canvas';

/** @typedef {import('../../types').DdgraphState} DdgraphState */

const ReduxCanvas = (() => {
  /** @param {{ ddgraph: DdgraphState }} state */
  const mapStateToProps = (state) => ({
    isGraphView: state.ddgraph.isGraphView,
    needReset: state.ddgraph.needReset,
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onClickBlankSpace: () => {
      dispatch(clickBlankSpace());
    },
    /** @param {DdgraphState['canvasBoundingRect']} canvasBoundingRect */
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
