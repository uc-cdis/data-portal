import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export const GAInit = (trackingId, gaDebug) => {
  const isGAEnabled = (trackingId?.startsWith('UA-') || trackingId?.startsWith('G-'));
  if (isGAEnabled) {
    // needs to explicitly exclude the debug parameter to turn off debug mode
    // see https://support.google.com/analytics/answer/7201382?hl=en#zippy=%2Cgoogle-tag-websites
    console.log(gaDebug);
    // if (gaDebug) {
      // ReactGA.initialize(trackingId, { gtagOptions: { debug_mode: true } });
    // } else {
      ReactGA.initialize(trackingId);
    // }
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
