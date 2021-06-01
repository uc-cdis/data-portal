import React from 'react';
import PropTypes from 'prop-types';
import NotFoundSVG from '../../img/not-found.svg';

class ExplorerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('Explorer has error:', error, errorInfo);
  }

  render() {
    return this.state.hasError ? (
      <div className='guppy-data-explorer__error'>
        <h1>Error opening the Exploration page...</h1>
        <p>
          The Exploration page is not working correctly. Please try refreshing
          the page. If the problem continues, please contact administrator for
          more information.
        </p>
        <NotFoundSVG />
      </div>
    ) : (
      this.props.children
    );
  }
}

ExplorerErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default ExplorerErrorBoundary;
