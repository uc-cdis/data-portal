import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';

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

export default {
  GoogleAnalytics,
};

// const init = (trackingId, dev, gaDebug, options = {}) => {
//   const isGAEnabled = trackingId !== 'undefined';
//   if (isGAEnabled) {
//     ReactGA.initialize(trackingId, { debug: gaDebug, ...options });
//   }
//   return isGAEnabled;
// };

// export default {
//   GoogleAnalytics,
//   init,
// };

// import React, { useEffect } from 'react';
// import { useLocation, Route } from 'react-router-dom';

// const GoogleAnalytics = () => {
//   const location = useLocation();

//   useEffect(() => {
//     window.gtag('event', 'page_view', {
//       page_path: location.pathname + location.search,
//     });
//   }, [location]);
// };

// export const GoogleAnalyticsRouteTracker = () => <Route component={GoogleAnalytics} />;

// export default GoogleAnalytics;
