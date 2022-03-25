import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children
 * @property {React.ReactNode} fallback
 * @property {(error: Error, info: React.ErrorInfo) => void} [onError]
 */

/**
 * @typedef {Object} ErrorBoundaryState
 * @property {boolean} hasError
 */

/** @extends React.Component<ErrorBoundaryProps> */
class ErrorBoundary extends Component {
  /** @param {ErrorBoundaryProps} props */
  constructor(props) {
    super(props);

    /** @type {ErrorBoundaryState} */
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch = this.props.onError;

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  fallback: PropTypes.node.isRequired,
  onError: PropTypes.func,
};

ErrorBoundary.defaultProps = {
  onError: console.error, // eslint-disable-line no-console
};

export default ErrorBoundary;
