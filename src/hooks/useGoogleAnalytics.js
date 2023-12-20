import ReactGA from 'react-ga4';
import { gaDebug } from '../localconf';
import { gaTracking as gaTrackingId } from '../params';

const isUsingGoogleAnalytics =
  gaTrackingId?.startsWith('UA-') || gaTrackingId?.startsWith('G-');

const clickApplySurvivalButtonEvent = () => {
  if (isUsingGoogleAnalytics) {
    ReactGA.event({
      action: 'Click Apply Survival Button',
      category: 'Exploration',
      label: 'Survival Analysis',
    });
  }
};

export const gaEvents = {
  clickApplySurvivalButtonEvent,
};

export default function useGoogleAnalytics() {
  if (isUsingGoogleAnalytics) {
    ReactGA.initialize(gaTrackingId, {
      testMode: gaDebug,
    });
  }
}
