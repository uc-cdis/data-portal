import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { basename } from '../localconf';

export const GAInit = (trackingId) => {
  const isGAEnabled = (trackingId?.startsWith('UA-') || trackingId?.startsWith('G-'));
  if (isGAEnabled) {
    ReactGA.initialize(trackingId);
  }
  return isGAEnabled;
};

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = (basename === '/') ? `${location.pathname}${location.search}` : `${basename}${location.pathname}${location.search}`;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
    });
  }, [location]);

  return null;
};

export const GARouteTracker = () => <Route component={GoogleAnalytics} />;
