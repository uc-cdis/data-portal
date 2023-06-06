import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { gaDebug, basename } from '../localconf';
import { gaTracking as gaTrackingId } from '../params';

const isUsingGoogleAnalytics =
  gaTrackingId?.startsWith('UA-') || gaTrackingId?.startsWith('G-');

/** @param {import('react-router').Location} location */
export default function useGoogleAnalytics(location) {
  if (isUsingGoogleAnalytics) {
    ReactGA.initialize(gaTrackingId, {
      testMode: gaDebug,
    });
    useEffect(() => {
      const pagePath =
        basename === '/'
          ? `${location.pathname}${location.search}`
          : `${basename}${location.pathname}${location.search}`;
      window.gtag('event', 'page_view', {
        page_path: pagePath,
      });
    }, [location]);
  }
}
