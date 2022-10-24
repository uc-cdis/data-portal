import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export const GAInit = (trackingId, gaDebug, options = {}) => {
  const isGAEnabled = (trackingId?.startsWith('UA-') || trackingId?.startsWith('G-'));
  if (isGAEnabled) {
    ReactGA.initialize(trackingId, { debug: gaDebug, ...options });
  }
  return isGAEnabled;
};

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

export const GARouteTracker = () => <Route component={GoogleAnalytics} />;
