import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvasElement = React.createRef();
    this.svgElement = React.createRef();
    this.containerElement = React.createRef();
  }

  componentDidMount() {
    d3.select('.canvas__overlay')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(d3.zoom()
        .scaleExtent([this.props.minZoom, this.props.maxZoom])
        .translateExtent([this.props.topLeftTranslateLimit, this.props.bottomRightTranslateLimit])
        .on('zoom', () => {
          this.handleCanvasUpdate();
          d3.select('.canvas__container')
            .attr('transform', d3.event.transform);
        }));
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
  }

  handleClick = () => {
    this.props.onClickBlankSpace();
  }

  render() {
    return (
      <div className='canvas' ref={this.canvasElement} style={{ width: '100%', height: '100%' }}>
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
};

Canvas.defaultProps = {
  minZoom: 0.1,
  maxZoom: 5,
  topLeftTranslateLimit: [-Infinity, -Infinity],
  bottomRightTranslateLimit: [+Infinity, +Infinity],
  onClickBlankSpace: () => {},
  onCanvasUpdate: () => {},
};

export default Canvas;
