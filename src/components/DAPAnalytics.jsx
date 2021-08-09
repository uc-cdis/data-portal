/* Component for handling DAP "virtual pageview" tracking mechanism */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const scriptExists = (url) => document.querySelectorAll(`script[src="${url}"]`).length > 0;

const logPageChange = (pathname, search = '') => {
  const page = pathname + search;
  // check if DAP script has been loaded
  if (scriptExists('https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=NIH&subagency=NIAID')) {
    // apply virtual pageview using DAP function
    window.gas('send', 'pageview', page);
  }
};

class DAPAnalytics extends Component {
  componentDidMount() {
    logPageChange(
      this.props.location.pathname,
      this.props.location.search,
    );
  }

  componentDidUpdate({ location: prevLocation }) {
    const { location: { pathname, search } } = this.props;
    const isDifferentPathname = pathname !== prevLocation.pathname;
    const isDifferentSearch = search !== prevLocation.search;

    if (isDifferentPathname || isDifferentSearch) {
      logPageChange(pathname, search);
    }
  }

  render() {
    return null;
  }
}

DAPAnalytics.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};

export const DAPRouteTracker = () => <Route component={DAPAnalytics} />;

export default {
  DAPAnalytics,
};
