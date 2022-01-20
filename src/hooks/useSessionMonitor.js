import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import sessionMonitor from '../SessionMonitor';

export default function useSessionMonitor() {
  const dispatch = useDispatch();
  useEffect(() => {
    sessionMonitor.useDispatch(dispatch);
    sessionMonitor.start();
  }, []);

  return sessionMonitor;
}
