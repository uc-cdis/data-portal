import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { gaDebug, hostname } from '../localconf';
import { gaTracking as gaTrackingId } from '../params';

const isUsingGoogleAnalytics = /UA-\d+-\d+/.test(gaTrackingId);

if (isUsingGoogleAnalytics)
  ReactGA.initialize(gaTrackingId, { debug: gaDebug });

const origin = hostname.slice(0, -1);

/** @param {import('history').Location} location */
function useGoogleAnalytics(location) {
  const page = location.pathname + location.search;
  useEffect(() => {
    ReactGA.set({ page, location: `${origin}${page}` });
    ReactGA.pageview(page);
  }, [location]);
}

export default isUsingGoogleAnalytics
  ? useGoogleAnalytics
  : () => {
      /* noop */
    };
