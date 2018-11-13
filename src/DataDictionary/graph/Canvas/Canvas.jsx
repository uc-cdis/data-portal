import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './Canvas.css';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvasElement = React.createRef();
    this.svgElement = React.createRef();
    this.containerElement = React.createRef();
  }

  componentDidMount() {
    this.zoomBehavior = d3.zoom()
      .scaleExtent([this.props.minZoom, this.props.maxZoom])
      .translateExtent([this.props.topLeftTranslateLimit, this.props.bottomRightTranslateLimit])
      .on('zoom', () => {
        this.handleCanvasUpdate();
        this.zoomTarget
          .attr('transform', d3.event.transform);
      });
    this.zoomTarget = d3.select('.canvas__container');
    this.zoomCatcher = d3.select('.canvas__overlay')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(this.zoomBehavior);
    this.updateCanvasSize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    d3.select('.canvas__overlay')
      .on('.zoom', null);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.updateCanvasSize();
  }

  updateCanvasSize() {
    this.setState({
      canvasWidth: this.canvasElement.current.clientWidth,
      canvasHeight: this.canvasElement.current.clientHeight,
    });
    this.handleCanvasUpdate();
  }

  handleCanvasUpdate = () => {
    const canvasTransform = this.svgElement.current.getScreenCTM()
      .inverse().multiply(this.containerElement.current.getScreenCTM());
    this.props.onCanvasUpdate(canvasTransform);
    const canvasBoundingRect = this.canvasElement.current.getBoundingClientRect();
    this.props.onCanvasTopLeftUpdate(canvasBoundingRect);
  }

  handleClick = () => {
    this.props.onClickBlankSpace();
  }

  handleZoomIn = () => {
    const transform = d3.zoomTransform(this.zoomCatcher.node());
    this.zoomCatcher.call(this.zoomBehavior.transform, transform.scale(1.1));
  }

  handleZoomOut = () => {
    const transform = d3.zoomTransform(this.zoomCatcher.node());
    this.zoomCatcher.call(this.zoomBehavior.transform, transform.scale(0.9));
  }

  handleReset = () => {
    this.zoomCatcher.call(this.zoomBehavior.transform, d3.zoomIdentity);
  }

  render() {
    return (
      <div className='canvas' ref={this.canvasElement} style={{ width: '100%', height: '100%' }}>
        <div className='canvas__zoom-button-group'>
          <div
            className='canvas__zoom-button'
            onClick={this.handleReset}
            role='button'
            tabIndex={-1}
          >
            <i className='canvas__zoom-icon g3-icon g3-icon--reset' />
          </div>
          <div
            className='canvas__zoom-button'
            onClick={this.handleZoomIn}
            role='button'
            tabIndex={-1}
          >
            <i className='canvas__zoom-icon g3-icon g3-icon--plus' />
          </div>
          <div
            className='canvas__zoom-button'
            onClick={this.handleZoomOut}
            role='button'
            tabIndex={-1}
          >
            <i className='canvas__zoom-icon canvas__zoom-icon--zoom-in g3-icon g3-icon--minus' />
          </div>
        </div>
        <svg
          className='canvas__svg'
          ref={this.svgElement}
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
        >
          <rect
            className='canvas__overlay'
            width={this.state.canvasWidth}
            height={this.state.canvasHeight}
            onClick={this.handleClick}
          />
          <g
            className='canvas__container'
            ref={this.containerElement}
          >
            {
              React.Children.map(this.props.children, child => React.cloneElement(child, {
                canvasWidth: this.state.canvasWidth,
                canvasHeight: this.state.canvasHeight,
              }),
              )
            }
          </g>
        </svg>
      </div>
    );
  }
}

Canvas.propTypes = {
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  topLeftTranslateLimit: PropTypes.arrayOf(PropTypes.number),
  bottomRightTranslateLimit: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onClickBlankSpace: PropTypes.func,
  onCanvasUpdate: PropTypes.func,
  onCanvasTopLeftUpdate: PropTypes.func,
};

Canvas.defaultProps = {
  minZoom: 0.1,
  maxZoom: 5,
  topLeftTranslateLimit: [-Infinity, -Infinity],
  bottomRightTranslateLimit: [+Infinity, +Infinity],
  onClickBlankSpace: () => {},
  onCanvasUpdate: () => {},
  onCanvasTopLeftUpdate: () => {},
};

export default Canvas;
